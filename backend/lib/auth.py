"""Staff auth for the admin side: bcrypt passwords, a signed JWT in an httpOnly cookie,
and FastAPI dependencies that resolve the signed-in user.

Each user carries a `session_version`; tokens embed it, so bumping it (password reset,
role change, deactivation) signs that user out everywhere at once.
"""

import logging
import os
import secrets
import uuid
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, Request, Response
from passlib.context import CryptContext
from starlette.concurrency import run_in_threadpool

from lib.db import as_utc, db

logger = logging.getLogger(__name__)

COOKIE_NAME = "sg_admin_session"
SESSION_HOURS = 12
ROLES = ("admin", "editor")

_pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
# A hash to verify against when the email is unknown, so a miss costs the same time as a hit.
_DUMMY_HASH = _pwd.hash(secrets.token_urlsafe(16))

_secret = os.environ.get("JWT_SECRET")
if not _secret:
    _secret = secrets.token_urlsafe(48)
    logger.warning("JWT_SECRET is not set — using a random one; admin sessions reset on every restart")

COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "false").lower() == "true"


async def hash_password(password: str) -> str:
    return await run_in_threadpool(_pwd.hash, password)


async def verify_password(password: str, password_hash: str | None) -> bool:
    return await run_in_threadpool(_pwd.verify, password, password_hash or _DUMMY_HASH)


def public_user(user: dict) -> dict:
    """The fields safe to send to the browser — never the hash or session version."""
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "active": user.get("active", True),
        "created_at": as_utc(user["created_at"]).isoformat() if user.get("created_at") else None,
    }


def issue_session(response: Response, user: dict) -> None:
    expires = datetime.now(timezone.utc) + timedelta(hours=SESSION_HOURS)
    token = jwt.encode(
        {"sub": user["id"], "v": user.get("session_version", 0), "exp": expires},
        _secret,
        algorithm="HS256",
    )
    response.set_cookie(
        COOKIE_NAME,
        token,
        max_age=SESSION_HOURS * 3600,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        path="/",
    )


def clear_session(response: Response) -> None:
    response.delete_cookie(COOKIE_NAME, path="/", httponly=True, secure=COOKIE_SECURE, samesite="lax")


async def current_user(request: Request) -> dict:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Not signed in")
    try:
        claims = jwt.decode(token, _secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Your session has expired — please sign in again")
    user = await db.users.find_one({"id": claims.get("sub")}, {"_id": 0})
    if not user or not user.get("active", True) or user.get("session_version", 0) != claims.get("v"):
        raise HTTPException(status_code=401, detail="Your session has expired — please sign in again")
    return user


async def require_admin(user: dict = Depends(current_user)) -> dict:
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only administrators can do that")
    return user


async def create_user(email: str, name: str, role: str, password: str) -> dict:
    user = {
        "id": str(uuid.uuid4()),
        "email": email.strip().lower(),
        "name": name.strip(),
        "role": role,
        "active": True,
        "password_hash": await hash_password(password),
        "session_version": 0,
        "created_at": datetime.now(timezone.utc),
    }
    await db.users.insert_one(dict(user))
    return user


async def seed_first_admin() -> None:
    """Create the first administrator from ADMIN_EMAIL / ADMIN_PASSWORD when no staff exist yet."""
    email = os.environ.get("ADMIN_EMAIL", "").strip()
    password = os.environ.get("ADMIN_PASSWORD", "")
    if await db.users.count_documents({}) > 0:
        return
    if not email or not password:
        logger.warning("No staff accounts and ADMIN_EMAIL/ADMIN_PASSWORD not set — the admin side has no way in yet")
        return
    await create_user(email, os.environ.get("ADMIN_NAME", "Administrator"), "admin", password)
    logger.info("Created the first administrator account for %s", email.lower())
