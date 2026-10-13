"""Admin-side routes (mounted under /api/admin): dashboard stats, the message inbox and
staff accounts. Every route needs a signed-in user; staff management needs an admin."""

from datetime import datetime, timedelta, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr, Field
from pymongo.errors import DuplicateKeyError

from lib.auth import create_user, current_user, hash_password, public_user, require_admin
from lib.db import as_utc, db
from lib.inbox import SOURCES, collection, new_reply, to_message
from lib import mailer

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(current_user)])

Source = Literal["contact", "chat"]
Role = Literal["admin", "editor"]


# --- dashboard ---------------------------------------------------------------

@router.get("/stats")
async def stats():
    today = datetime.now(timezone.utc).date()
    days = [today - timedelta(days=13 - i) for i in range(14)]
    series = {d: {"contact": 0, "chat": 0} for d in days}
    totals = {"contact": 0, "chat": 0}
    waiting = answered = 0
    for source in SOURCES:
        docs = await collection(source).find({}, {"_id": 0, "created_at": 1, "status": 1}).to_list(10000)
        totals[source] = len(docs)
        for d in docs:
            if d.get("status", "new") == "answered":
                answered += 1
            else:
                waiting += 1
            day = as_utc(d["created_at"]).date()
            if day in series:
                series[day][source] += 1
    return {
        "waiting": waiting,
        "answered": answered,
        "total": totals["contact"] + totals["chat"],
        "contact": totals["contact"],
        "chat": totals["chat"],
        "staff": await db.users.count_documents({"active": {"$ne": False}}),
        "series": [{"date": d.isoformat(), **series[d]} for d in days],
        "email_alerts": {"enabled": mailer.enabled(), "recipients": mailer.recipients()},
    }


# --- messages ----------------------------------------------------------------

class ReplyIn(BaseModel):
    body: str = Field(min_length=1, max_length=4000)


class StatusIn(BaseModel):
    status: Literal["new", "answered"]


@router.get("/messages")
async def list_messages(
    source: Literal["all", "contact", "chat"] = "all",
    status: Literal["all", "new", "answered"] = "all",
):
    query: dict = {}
    if status == "new":
        query["status"] = {"$ne": "answered"}  # older documents have no status field yet
    elif status == "answered":
        query["status"] = "answered"
    out: list[dict] = []
    for src in SOURCES if source == "all" else [source]:
        docs = await collection(src).find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
        out += [to_message(src, d) for d in docs]
    out.sort(key=lambda m: m["created_at"], reverse=True)
    return out


async def _get(source: Source, message_id: str) -> dict:
    doc = await collection(source).find_one({"id": message_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Message not found")
    return doc


@router.post("/messages/{source}/{message_id}/reply")
async def reply(source: Source, message_id: str, body: ReplyIn, user: dict = Depends(current_user)):
    await _get(source, message_id)
    await collection(source).update_one(
        {"id": message_id},
        {"$push": {"replies": new_reply(body.body, user)}, "$set": {"status": "answered"}},
    )
    return to_message(source, await _get(source, message_id))


@router.patch("/messages/{source}/{message_id}")
async def set_status(source: Source, message_id: str, body: StatusIn):
    await _get(source, message_id)
    await collection(source).update_one({"id": message_id}, {"$set": {"status": body.status}})
    return to_message(source, await _get(source, message_id))


# --- staff accounts (admins only) -------------------------------------------

class UserCreateIn(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=120)
    role: Role = "editor"
    password: str = Field(min_length=10, max_length=200)


class UserUpdateIn(BaseModel):
    role: Role | None = None
    active: bool | None = None


class PasswordResetIn(BaseModel):
    password: str = Field(min_length=10, max_length=200)


async def _other_active_admins(user_id: str) -> int:
    return await db.users.count_documents({"role": "admin", "active": {"$ne": False}, "id": {"$ne": user_id}})


@router.get("/users", dependencies=[Depends(require_admin)])
async def list_users():
    docs = await db.users.find({}, {"_id": 0}).sort("created_at", 1).to_list(500)
    return [public_user(d) for d in docs]


@router.post("/users", status_code=201, dependencies=[Depends(require_admin)])
async def add_user(body: UserCreateIn):
    if await db.users.find_one({"email": body.email.lower()}):
        raise HTTPException(status_code=409, detail="A staff account with that email already exists")
    try:
        user = await create_user(body.email, body.name, body.role, body.password)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="A staff account with that email already exists")
    return public_user(user)


@router.patch("/users/{user_id}")
async def update_user(user_id: str, body: UserUpdateIn, me: dict = Depends(require_admin)):
    target = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not target:
        raise HTTPException(status_code=404, detail="Staff account not found")
    losing_admin = (body.role == "editor" or body.active is False) and target["role"] == "admin"
    if losing_admin and await _other_active_admins(user_id) == 0:
        raise HTTPException(status_code=400, detail="Keep at least one active administrator")
    changes = {k: v for k, v in body.model_dump().items() if v is not None}
    if changes:
        changes["session_version"] = target.get("session_version", 0) + 1  # re-check rights on next request
        await db.users.update_one({"id": user_id}, {"$set": changes})
    return public_user(await db.users.find_one({"id": user_id}, {"_id": 0}))


@router.post("/users/{user_id}/password", dependencies=[Depends(require_admin)])
async def reset_password(user_id: str, body: PasswordResetIn):
    target = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not target:
        raise HTTPException(status_code=404, detail="Staff account not found")
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"password_hash": await hash_password(body.password), "session_version": target.get("session_version", 0) + 1}},
    )
    return {"ok": True}


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, me: dict = Depends(require_admin)):
    if user_id == me["id"]:
        raise HTTPException(status_code=400, detail="You can't delete your own account")
    target = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not target:
        raise HTTPException(status_code=404, detail="Staff account not found")
    if target["role"] == "admin" and await _other_active_admins(user_id) == 0:
        raise HTTPException(status_code=400, detail="Keep at least one active administrator")
    await db.users.delete_one({"id": user_id})
    return {"ok": True}
