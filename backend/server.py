import asyncio
import hashlib
import hmac
import secrets
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, BackgroundTasks, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from lib.db import as_utc, client, db, ensure_indexes
from lib.auth import seed_first_admin
from lib.inbox import reply_out
from lib.mailer import send_inquiry_alert
from routers import admin as admin_routes
from routers import auth as auth_routes


async def _startup() -> None:
    await ensure_indexes()
    await seed_first_admin()


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.startup_task = asyncio.create_task(_startup())
    yield
    client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class DemoRequestCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    work_email: EmailStr
    company: str = Field(min_length=1, max_length=160)
    company_size: str = Field(min_length=1, max_length=40)
    frameworks: List[str] = Field(default_factory=list)
    consent: bool

class DemoRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    work_email: EmailStr
    company: str
    company_size: str
    frameworks: List[str]
    status: str = "new"
    replies: List[dict] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DemoRequestResponse(BaseModel):
    id: str
    message: str


class SupportMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=2000)
    consent: bool

class SupportMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    status: str = "new"
    replies: List[dict] = Field(default_factory=list)
    thread_token_hash: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SupportMessageResponse(BaseModel):
    id: str
    message: str
    # Shown only to the visitor who sent the message; lets their chat window fetch staff replies.
    thread_token: str


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


@api_router.get("/")
async def root():
    return {"message": "SecureGov demo API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    _ = await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**sc) for sc in status_checks]


# Listing demo requests and support messages lives on the admin side (/api/admin/messages),
# behind a staff login — visitors can only create them.

@api_router.post("/demo-requests", response_model=DemoRequestResponse, status_code=201)
async def create_demo_request(input: DemoRequestCreate, background: BackgroundTasks):
    if not input.consent:
        raise HTTPException(status_code=422, detail="GDPR consent is required")
    req = DemoRequest(**input.model_dump(exclude={"consent"}))
    await db.demo_requests.insert_one(req.model_dump())
    background.add_task(
        send_inquiry_alert,
        kind="demo request (contact form)",
        name=req.name,
        email=req.work_email,
        fields=[
            ("Company", req.company),
            ("Company size", f"{req.company_size} staff"),
            ("Frameworks", ", ".join(req.frameworks) or "None selected"),
        ],
    )
    return DemoRequestResponse(id=req.id, message="Thanks — the CyberHealth team will be in touch within one business day.")


@api_router.post("/support-messages", response_model=SupportMessageResponse, status_code=201)
async def create_support_message(input: SupportMessageCreate, background: BackgroundTasks):
    if not input.consent:
        raise HTTPException(status_code=422, detail="GDPR consent is required")
    token = secrets.token_urlsafe(24)
    msg = SupportMessage(**input.model_dump(exclude={"consent"}), thread_token_hash=_token_hash(token))
    await db.support_messages.insert_one(msg.model_dump())
    background.add_task(
        send_inquiry_alert,
        kind="SecureGov Assistant chat message",
        name=msg.name,
        email=msg.email,
        fields=[],
        body=msg.message,
    )
    first = msg.name.split()[0]
    return SupportMessageResponse(
        id=msg.id,
        message=f"Thanks {first} — your message is with the CyberHealth team. Someone will reply here and to {msg.email} within one working day.",
        thread_token=token,
    )


@api_router.get("/support-messages/{message_id}/thread")
async def support_thread(message_id: str, token: str):
    """The visitor's own conversation: their message plus staff replies. Needs the token issued at send time."""
    doc = await db.support_messages.find_one({"id": message_id}, {"_id": 0})
    stored = (doc or {}).get("thread_token_hash", "")
    if not doc or not stored or not hmac.compare_digest(stored, _token_hash(token)):
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {
        "id": doc["id"],
        "message": doc["message"],
        "created_at": as_utc(doc["created_at"]).isoformat(),
        "replies": [reply_out(r) for r in doc.get("replies", [])],
    }


api_router.include_router(auth_routes.router)
api_router.include_router(admin_routes.router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
