"""Forum: topics by category with replies, views and likes. Points: topic +10, reply +5, like +2."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Request

from lib.db import db
from lib.security import now_utc, require_user, user_from_request
from lib.social import brief
from models.forum import Reply, ReplyCreate, Topic, TopicCreate, TopicDetail
from models.social import LikeOut

router = APIRouter(prefix="/forum", tags=["forum"])


async def _authors(user_ids: list[str]) -> dict[str, object]:
    unique = list(set(user_ids))
    rows = await db.users.find({"id": {"$in": unique}}).to_list(len(unique) + 1)
    return {u["id"]: brief(u) for u in rows}


def _fallback_brief(user_id: str):
    return brief({"id": user_id, "name": "Fã sumido", "username": "desconhecido"})


@router.get("/topics", response_model=list[Topic])
async def list_topics(request: Request, category: str | None = None):
    query: dict = {"category": category} if category else {}
    docs = (
        await db.forum_topics.find(query)
        .sort([("pinned", -1), ("created_at", -1)])
        .limit(100)
        .to_list(100)
    )
    if not docs:
        return []
    me = await user_from_request(request)
    authors = await _authors([d["user_id"] for d in docs])
    return [
        Topic(
            id=d["id"],
            author=authors.get(d["user_id"]) or _fallback_brief(d["user_id"]),
            category=d["category"],
            title=d["title"],
            content=d["content"],
            pinned=d.get("pinned", False),
            reply_count=d.get("reply_count", 0),
            like_count=d.get("like_count", 0),
            view_count=d.get("view_count", 0),
            liked_by_me=bool(me and me["id"] in d.get("liked_by", [])),
            created_at=d["created_at"],
        )
        for d in docs
    ]


@router.post("/topics", response_model=Topic, status_code=201)
async def create_topic(payload: TopicCreate, user: dict = Depends(require_user)):
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "category": payload.category,
        "title": payload.title.strip(),
        "content": payload.content.strip(),
        "pinned": False,
        "reply_count": 0,
        "like_count": 0,
        "view_count": 0,
        "liked_by": [],
        "created_at": now_utc(),
    }
    await db.forum_topics.insert_one(doc)
    await db.users.update_one({"id": user["id"]}, {"$inc": {"points": 10}})
    return Topic(**doc, author=brief(user), liked_by_me=False)


@router.get("/topics/{topic_id}", response_model=TopicDetail)
async def get_topic(topic_id: str, request: Request):
    doc = await db.forum_topics.find_one_and_update(
        {"id": topic_id},
        {"$inc": {"view_count": 1}},
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Tópico não encontrado.")

    me = await user_from_request(request)
    reply_docs = (
        await db.forum_replies.find({"topic_id": topic_id})
        .sort("created_at", 1)
        .limit(300)
        .to_list(300)
    )
    authors = await _authors(
        [doc["user_id"]] + [r["user_id"] for r in reply_docs]
    )

    topic = Topic(
        id=doc["id"],
        author=authors.get(doc["user_id"]) or _fallback_brief(doc["user_id"]),
        category=doc["category"],
        title=doc["title"],
        content=doc["content"],
        pinned=doc.get("pinned", False),
        reply_count=doc.get("reply_count", 0),
        like_count=doc.get("like_count", 0),
        view_count=doc.get("view_count", 0) + 1,
        liked_by_me=bool(me and me["id"] in doc.get("liked_by", [])),
        created_at=doc["created_at"],
    )
    replies = [
        Reply(
            id=r["id"],
            topic_id=r["topic_id"],
            author=authors.get(r["user_id"]) or _fallback_brief(r["user_id"]),
            content=r["content"],
            created_at=r["created_at"],
        )
        for r in reply_docs
    ]
    return TopicDetail(topic=topic, replies=replies)


@router.post("/topics/{topic_id}/replies", response_model=Reply, status_code=201)
async def create_reply(topic_id: str, payload: ReplyCreate, user: dict = Depends(require_user)):
    topic = await db.forum_topics.find_one({"id": topic_id})
    if not topic:
        raise HTTPException(status_code=404, detail="Tópico não encontrado.")

    doc = {
        "id": str(uuid.uuid4()),
        "topic_id": topic_id,
        "user_id": user["id"],
        "content": payload.content.strip(),
        "created_at": now_utc(),
    }
    await db.forum_replies.insert_one(doc)
    await db.forum_topics.update_one({"id": topic_id}, {"$inc": {"reply_count": 1}})
    await db.users.update_one({"id": user["id"]}, {"$inc": {"points": 5}})
    return Reply(**doc, author=brief(user))


@router.post("/topics/{topic_id}/like", response_model=LikeOut)
async def like_topic(topic_id: str, user: dict = Depends(require_user)):
    doc = await db.forum_topics.find_one({"id": topic_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Tópico não encontrado.")

    liked_by: list[str] = doc.get("liked_by", [])
    if user["id"] in liked_by:
        await db.forum_topics.update_one(
            {"id": topic_id},
            {"$pull": {"liked_by": user["id"]}, "$inc": {"like_count": -1}},
        )
        return LikeOut(liked=False, like_count=max(0, doc.get("like_count", 1) - 1))

    await db.forum_topics.update_one(
        {"id": topic_id},
        {"$addToSet": {"liked_by": user["id"]}, "$inc": {"like_count": 1}},
    )
    await db.users.update_one({"id": user["id"]}, {"$inc": {"points": 2}})
    return LikeOut(liked=True, like_count=doc.get("like_count", 0) + 1)
