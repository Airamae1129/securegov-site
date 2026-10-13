"""One inbox over two collections: the "Book a live demo" contact form (demo_requests) and
the SecureGov Assistant "talk to a person" chat handoff (support_messages)."""

import uuid
from datetime import datetime, timezone

from lib.db import as_utc, db

SOURCES = {"contact": "demo_requests", "chat": "support_messages"}


def collection(source: str):
    return db[SOURCES[source]]


def to_message(source: str, doc: dict) -> dict:
    """Normalise a stored document into the shape the admin inbox renders."""
    if source == "contact":
        details = [
            {"label": "Company", "value": doc.get("company", "")},
            {"label": "Company size", "value": f"{doc.get('company_size', '')} staff"},
            {"label": "Frameworks", "value": ", ".join(doc.get("frameworks") or []) or "None selected"},
        ]
        body = None
        email = doc.get("work_email", "")
    else:
        details = []
        body = doc.get("message", "")
        email = doc.get("email", "")
    return {
        "id": doc["id"],
        "source": source,
        "name": doc.get("name", ""),
        "email": email,
        "body": body,
        "details": details,
        "status": doc.get("status", "new"),
        "created_at": as_utc(doc["created_at"]).isoformat(),
        "replies": [reply_out(r) for r in doc.get("replies", [])],
    }


def reply_out(reply: dict) -> dict:
    return {
        "id": reply["id"],
        "body": reply["body"],
        "by_name": reply["by_name"],
        "at": as_utc(reply["at"]).isoformat(),
    }


def new_reply(body: str, user: dict) -> dict:
    return {
        "id": str(uuid.uuid4()),
        "body": body.strip(),
        "by_id": user["id"],
        "by_name": user["name"],
        "at": datetime.now(timezone.utc),
    }
