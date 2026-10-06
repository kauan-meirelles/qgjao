"""Shared query helpers: author joins for posts and topics."""
from __future__ import annotations

from datetime import datetime

from lib.db import db
from models.social import Post
from models.users import UserBrief, UserPublic
from lib.security import strip_doc


def brief(doc: dict) -> UserBrief:
    return UserBrief(**strip_doc(doc))


def public_user(doc: dict) -> UserPublic:
    return UserPublic(**strip_doc(doc))


async def fetch_posts(query: dict, me: dict | None, limit: int = 50) -> list[Post]:
    """Posts newest-first with author joined and liked_by_me resolved for the viewer."""
    docs = await db.posts.find(query).sort("created_at", -1).limit(limit).to_list(limit)
    if not docs:
        return []

    user_ids = list({d["user_id"] for d in docs})
    authors = {
        u["id"]: brief(u)
        for u in await db.users.find({"id": {"$in": user_ids}}).to_list(len(user_ids) + 1)
    }

    liked_ids: set[str] = set()
    if me is not None:
        liked = await db.post_likes.find(
            {"user_id": me["id"], "post_id": {"$in": [d["id"] for d in docs]}}
        ).to_list(1000)
        liked_ids = {l["post_id"] for l in liked}

    posts: list[Post] = []
    for d in docs:
        author = authors.get(d["user_id"]) or UserBrief(
            id=d["user_id"], name="Fã sumido", username="desconhecido"
        )
        posts.append(
            Post(
                id=d["id"],
                author=author,
                text=d["text"],
                image_url=d.get("image_url"),
                lyric=d.get("lyric"),
                era=d.get("era"),
                like_count=d.get("like_count", 0),
                comment_count=d.get("comment_count", 0),
                liked_by_me=d["id"] in liked_ids,
                created_at=d["created_at"],
            )
        )
    return posts


async def fetch_post_by_id(post_id: str) -> dict | None:
    return await db.posts.find_one({"id": post_id})


def valid_era(era: str | None) -> bool:
    return era in (None, "lobos", "anti-heroi", "pirata", "super", "supernova", "memorias-postumas")


def iso(dt: datetime) -> str:
    return dt.isoformat()