"""Admin side: sign-in, the unified inbox (contact form + assistant chat), replies reaching
the visitor's chat thread, and staff management. Runs against the live backend; the first
administrator comes from ADMIN_EMAIL / ADMIN_PASSWORD in backend/.env."""

import os
import uuid
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

import httpx
import pytest
from dotenv import load_dotenv

from tests.conftest import API_URL

load_dotenv(Path(__file__).parent.parent / ".env")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")

pytestmark = pytest.mark.skipif(not (ADMIN_EMAIL and ADMIN_PASSWORD), reason="ADMIN_EMAIL/ADMIN_PASSWORD not set")


@contextmanager
def signed_in(email: str = ADMIN_EMAIL, password: str = ADMIN_PASSWORD) -> Iterator[httpx.Client]:
    with httpx.Client(base_url=API_URL, timeout=30.0) as c:
        r = c.post("/auth/login", json={"email": email, "password": password})
        assert r.status_code == 200, r.text
        yield c


class TestAdmin:
    def test_admin_routes_need_sign_in(self, client):
        assert client.get("/admin/messages").status_code == 401
        assert client.get("/admin/stats").status_code == 401
        assert client.get("/auth/me").status_code == 401

    def test_public_lists_are_gone(self, client):
        # Visitor PII used to be listable without a login; now only the admin inbox shows it.
        assert client.get("/demo-requests").status_code == 405
        assert client.get("/support-messages").status_code == 405

    def test_wrong_password_is_rejected_generically(self, client):
        bad = client.post("/auth/login", json={"email": ADMIN_EMAIL, "password": "not-the-password"})
        unknown = client.post("/auth/login", json={"email": "nobody@example.com", "password": "whatever"})
        assert bad.status_code == unknown.status_code == 401
        assert bad.json()["detail"] == unknown.json()["detail"]

    def test_sign_in_sets_http_only_cookie(self):
        with httpx.Client(base_url=API_URL) as c:
            r = c.post("/auth/login", json={"email": ADMIN_EMAIL.upper(), "password": ADMIN_PASSWORD})
            assert r.status_code == 200
            assert "httponly" in r.headers["set-cookie"].lower()
            assert c.get("/auth/me").json()["role"] == "admin"
            c.post("/auth/logout")
            assert c.get("/auth/me").status_code == 401

    def test_inbox_reply_and_visitor_thread(self, client):
        tag = uuid.uuid4().hex[:8]
        contact = client.post("/demo-requests", json={
            "name": f"Contact {tag}", "work_email": f"c{tag}@example.com", "company": "Acme",
            "company_size": "11–50", "frameworks": ["NIS2"], "consent": True,
        })
        chat = client.post("/support-messages", json={
            "name": f"Chat {tag}", "email": f"v{tag}@example.com", "message": "Can I get a quote?", "consent": True,
        })
        assert contact.status_code == chat.status_code == 201
        chat_id, token = chat.json()["id"], chat.json()["thread_token"]

        with signed_in() as admin:
            inbox = admin.get("/admin/messages").json()
            mine = {m["source"]: m for m in inbox if tag in m["name"]}
            assert set(mine) == {"contact", "chat"}
            assert mine["contact"]["status"] == mine["chat"]["status"] == "new"
            assert {"label": "Frameworks", "value": "NIS2"} in mine["contact"]["details"]

            only_chat = admin.get("/admin/messages", params={"source": "chat"}).json()
            assert all(m["source"] == "chat" for m in only_chat)

            replied = admin.post(f"/admin/messages/chat/{chat_id}/reply", json={"body": "Hi! Pricing starts at €99/month."})
            assert replied.status_code == 200
            assert replied.json()["status"] == "answered"

            stats = admin.get("/admin/stats").json()
            assert stats["total"] >= 2 and len(stats["series"]) == 14

            reopened = admin.patch(f"/admin/messages/chat/{chat_id}", json={"status": "new"})
            assert reopened.json()["status"] == "new"

        # The visitor's chat window can read the reply with its token — and only with it.
        thread = client.get(f"/support-messages/{chat_id}/thread", params={"token": token})
        assert thread.status_code == 200
        assert thread.json()["replies"][0]["body"] == "Hi! Pricing starts at €99/month."
        assert client.get(f"/support-messages/{chat_id}/thread", params={"token": "guess"}).status_code == 404

    def test_staff_management_and_roles(self):
        tag = uuid.uuid4().hex[:8]
        email, pw = f"editor{tag}@example.com", "editor-pass-" + tag
        with signed_in() as admin:
            created = admin.post("/admin/users", json={"email": email, "name": "Ed Itor", "role": "editor", "password": pw})
            assert created.status_code == 201
            uid = created.json()["id"]
            assert admin.post("/admin/users", json={"email": email, "name": "Dup", "role": "editor", "password": pw}).status_code == 409
            me = admin.get("/auth/me").json()
            assert admin.delete(f"/admin/users/{me['id']}").status_code == 400  # can't delete yourself

        with signed_in(email, pw) as editor:
            assert editor.get("/admin/messages").status_code == 200  # editors handle the inbox
            assert editor.get("/admin/users").status_code == 403  # but can't manage staff

            with signed_in() as admin:
                assert admin.post(f"/admin/users/{uid}/password", json={"password": "a-brand-new-pass"}).status_code == 200
            # A reset signs the editor out everywhere.
            assert editor.get("/auth/me").status_code == 401

        with signed_in() as admin:
            assert admin.delete(f"/admin/users/{uid}").status_code == 200
