"""Database connection and index configuration using Motor (MongoDB)."""

import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING, DESCENDING
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "qgjao")

# Passando o certifi.where() para garantir os certificados SSL corretos no Python moderno
client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
db = client[DB_NAME]

# One entry per collection: every field a route filters, sorts, or dedupes on. Applied by ensure_indexes() at startup.
INDEXES: dict[str, list[IndexModel]] = {
    "status_checks": [IndexModel([("timestamp", DESCENDING)], name="timestamp_desc")],
    "users": [
        IndexModel([("email", ASCENDING)], name="email_unique", unique=True),
        IndexModel([("username", ASCENDING)], name="username_unique", unique=True),
        IndexModel([("points", DESCENDING)], name="points_desc"),
    ],
    "sessions": [
        IndexModel([("token", ASCENDING)], name="token_unique", unique=True),
        IndexModel([("user_id", ASCENDING)], name="session_user_id"),
    ],
    "posts": [
        IndexModel([("id", ASCENDING)], name="id_unique", unique=True),
        IndexModel([("created_at", DESCENDING)], name="created_desc"),
        IndexModel([("era", ASCENDING), ("created_at", DESCENDING)], name="era_created"),
        IndexModel([("user_id", ASCENDING), ("created_at", DESCENDING)], name="user_created"),
    ],
    "post_likes": [
        IndexModel([("post_id", ASCENDING), ("user_id", ASCENDING)], name="post_user_unique", unique=True),
    ],
    "comments": [
        IndexModel([("post_id", ASCENDING), ("created_at", ASCENDING)], name="post_created"),
    ],
    "forum_topics": [
        IndexModel([("id", ASCENDING)], name="id_unique", unique=True),
        IndexModel([("category", ASCENDING), ("created_at", DESCENDING)], name="cat_created"),
        IndexModel([("created_at", DESCENDING)], name="topic_created_desc"),
    ],
    "forum_replies": [
        IndexModel([("topic_id", ASCENDING), ("created_at", ASCENDING)], name="topic_created"),
    ],
    "chat_messages": [
        IndexModel([("channel", ASCENDING), ("created_at", ASCENDING)], name="channel_created"),
    ],
}

async def ensure_indexes():
    """Garante a criação de índices necessários para otimizar as consultas."""
    try:
        for collection_name, indexes in INDEXES.items():
            if indexes:
                await db[collection_name].create_indexes(indexes)
    except Exception as e:
        print(f"Aviso ao criar índices: {e}")