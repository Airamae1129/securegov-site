"""Sign-in, sign-out and own-account routes for the admin side (mounted under /api/auth)."""

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, Field

from lib.auth import (
    clear_session,
    current_user,
    hash_password,
    issue_session,
    public_user,
    verify_password,
)
from lib.db import db

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginIn(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=1, max_length=200)


class PasswordChangeIn(BaseModel):
    current_password: str = Field(min_length=1, max_length=200)
    new_password: str = Field(min_length=10, max_length=200)


@router.post("/login")
async def login(body: LoginIn, response: Response):
    user = await db.users.find_one({"email": body.email.strip().lower()}, {"_id": 0})
    ok = await verify_password(body.password, user["password_hash"] if user else None)
    if not user or not ok or not user.get("active", True):
        # One message for every failure, so the form can't be used to discover staff emails.
        raise HTTPException(status_code=401, detail="Email or password is incorrect")
    issue_session(response, user)
    return public_user(user)


@router.post("/logout")
async def logout(response: Response):
    clear_session(response)
    return {"ok": True}


@router.get("/me")
async def me(user: dict = Depends(current_user)):
    return public_user(user)


@router.post("/password")
async def change_password(body: PasswordChangeIn, response: Response, user: dict = Depends(current_user)):
    if not await verify_password(body.current_password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Your current password is incorrect")
    version = user.get("session_version", 0) + 1
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"password_hash": await hash_password(body.new_password), "session_version": version}},
    )
    # Other devices are signed out; this one gets a fresh cookie for the new version.
    issue_session(response, {**user, "session_version": version})
    return {"ok": True}
