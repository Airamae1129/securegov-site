"""Shared Mongo handle — import `client`/`db` from here (server.py, routers, seed.py)."""

import logging
import os
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING, IndexModel

load_dotenv(Path(__file__).parent.parent / ".env")

logger = logging.getLogger(__name__)

mongo_url = os.environ["MONGO_URL"]
if mongo_url.startswith("mongomock://"):
    # Local development without a MongoDB server: an in-memory stand-in that is wiped on
    # every restart. Never used in production (Render's MONGO_URL is a real Atlas string).
    from mongomock_motor import AsyncMongoMockClient

    client = AsyncMongoMockClient()
    logger.warning("MONGO_URL=mongomock:// — using an in-memory database; data resets on restart")
else:
    client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# One entry per collection: every field a route filters, sorts, or dedupes on. Applied by ensure_indexes() at startup.
INDEXES: dict[str, list[IndexModel]] = {
    "status_checks": [IndexModel([("timestamp", DESCENDING)], name="timestamp_desc")],
    "users": [
        IndexModel([("id", ASCENDING)], unique=True, name="id_unique"),
        IndexModel([("email", ASCENDING)], unique=True, name="email_unique"),
    ],
    "demo_requests": [
        IndexModel([("id", ASCENDING)], unique=True, name="id_unique"),
        IndexModel([("created_at", DESCENDING)], name="created_at_desc"),
    ],
    "support_messages": [
        IndexModel([("id", ASCENDING)], unique=True, name="id_unique"),
        IndexModel([("created_at", DESCENDING)], name="created_at_desc"),
    ],
}


async def ensure_indexes() -> None:
    for collection, models in INDEXES.items():
        for model in models:  # one at a time so a bad spec skips only itself
            try:
                await db[collection].create_indexes([model])
            except Exception as exc:  # never block boot on an index; the log line names what to fix
                logger.error("ensure_indexes(%s.%s): %s", collection, model.document["name"], exc)


def as_utc(value: datetime) -> datetime:
    """Mongo hands datetimes back naive (UTC); make them explicit so isoformat() carries the offset."""
    return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value
