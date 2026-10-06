"""Community chat: channel-scoped messages, polled by the frontend. Points: message +1."""

import uuid

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException

from lib.db import db
from lib.security import now_utc, require_user
from lib.social import brief
from models.chat import CHANNELS, ChatMessage, ChatMessageIn

router = APIRouter(prefix="/chat", tags=["chat"])


def _check_channel(channel: str) -> None:
    if channel not in CHANNELS:
        raise HTTPException(status_code=404, detail="Canal inválido.")

async def _render(docs: list[dict], channel: str) -> list[ChatMessage]:
    if not docs:
        return []
    user_ids = list({d["user_id"] for d in docs})
    authors = {
        u["id"]: brief(u)
        for u in await db.users.find({"id": {"$in": user_ids}}).to_list(len(user_ids) + 1)
    }
    return [
        ChatMessage(
            id=d["id"],
            channel=channel,
            author=authors.get(d["user_id"])
            or brief({"id": d["user_id"], "name": "Fã sumido", "username": "desconhecido"}),
            text=d["text"],
            created_at=d["created_at"],
        )
        for d in docs
    ]


@router.get("/{channel}", response_model=list[ChatMessage])
async def get_messages(channel: str, after: datetime | None = None):
    _check_channel(channel)
    query: dict = {"channel": channel}
    if after is not None:
        query["created_at"] = {"$gt": after}
    docs = (
        await db.chat_messages.find(query)
        .sort("created_at", 1)
        .limit(200)
        .to_list(200)
    )
    return await _render(docs, channel)


@router.post("/{channel}", response_model=ChatMessage, status_code=201)
async def send_message(channel: str, payload: ChatMessageIn, user: dict = Depends(require_user)):
    _check_channel(channel)
    doc = {
        "id": str(uuid.uuid4()),
        "channel": channel,
        "user_id": user["id"],
        "text": payload.text.strip(),
        "created_at": now_utc(),
    }
    await db.chat_messages.insert_one(doc)
    await db.users.update_one({"id": user["id"]}, {"$inc": {"points": 1}})
    return ChatMessage(**doc, author=brief(user))
