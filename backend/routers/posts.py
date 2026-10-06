"""Feed: posts with likes and comments. Points: post +10, comment +5, like given +2."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, Response

from lib.db import db
from lib.security import now_utc, require_user, user_from_request
from lib.social import brief, fetch_posts
from models.social import Comment, CommentCreate, LikeOut, Post, PostCreate

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("", response_model=list[Post])
async def list_posts(request: Request, era: str | None = None, limit: int = 50):
    query: dict = {}
    if era:
        query["era"] = era
    me = await user_from_request(request)
    return await fetch_posts(query, me, limit=min(limit, 100))


@router.post("", response_model=Post, status_code=201)
async def create_post(payload: PostCreate, user: dict = Depends(require_user)):
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "text": payload.text.strip(),
        "image_url": payload.image_url,
        "lyric": payload.lyric,
        "era": payload.era,
        "like_count": 0,
        "comment_count": 0,
        "created_at": now_utc(),
    }
    await db.posts.insert_one(doc)
    await db.users.update_one({"id": user["id"]}, {"$inc": {"points": 10}})
    return Post(**doc, author=brief(user))


@router.delete("/{post_id}", status_code=204)
async def delete_post(post_id: str, user: dict = Depends(require_user)):
    doc = await db.posts.find_one({"id": post_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Post não encontrado.")
    if doc["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Só o autor pode apagar o post.")
    await db.posts.delete_one({"id": post_id})
    await db.post_likes.delete_many({"post_id": post_id})
    await db.comments.delete_many({"post_id": post_id})
    return Response(status_code=204)


@router.post("/{post_id}/like", response_model=LikeOut)
async def like_post(post_id: str, user: dict = Depends(require_user)):
    post = await db.posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")

    existing = await db.post_likes.find_one({"post_id": post_id, "user_id": user["id"]})
    if existing:
        await db.post_likes.delete_one({"_id": existing["_id"]})
        await db.posts.update_one({"id": post_id}, {"$inc": {"like_count": -1}})
        return LikeOut(liked=False, like_count=max(0, post.get("like_count", 1) - 1))

    await db.post_likes.insert_one(
        {
            "id": str(uuid.uuid4()),
            "post_id": post_id,
            "user_id": user["id"],
            "created_at": now_utc(),
        }
    )
    await db.posts.update_one({"id": post_id}, {"$inc": {"like_count": 1}})
    await db.users.update_one({"id": user["id"]}, {"$inc": {"points": 2}})
    return LikeOut(liked=True, like_count=post.get("like_count", 0) + 1)


@router.get("/{post_id}/comments", response_model=list[Comment])
async def list_comments(post_id: str):
    docs = await db.comments.find({"post_id": post_id}).sort("created_at", 1).to_list(500)
    if not docs:
        return []
    user_ids = list({d["user_id"] for d in docs})
    authors = {
        u["id"]: brief(u)
        for u in await db.users.find({"id": {"$in": user_ids}}).to_list(len(user_ids) + 1)
    }
    return [
        Comment(
            id=d["id"],
            post_id=d["post_id"],
            author=authors.get(d["user_id"]) or brief({"id": d["user_id"], "name": "Fã sumido", "username": "desconhecido"}),
            text=d["text"],
            created_at=d["created_at"],
        )
        for d in docs
    ]


@router.post("/{post_id}/comments", response_model=Comment, status_code=201)
async def create_comment(post_id: str, payload: CommentCreate, user: dict = Depends(require_user)):
    post = await db.posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post não encontrado.")

    doc = {
        "id": str(uuid.uuid4()),
        "post_id": post_id,
        "user_id": user["id"],
        "text": payload.text.strip(),
        "created_at": now_utc(),
    }
    await db.comments.insert_one(doc)
    await db.posts.update_one({"id": post_id}, {"$inc": {"comment_count": 1}})
    await db.users.update_one({"id": user["id"]}, {"$inc": {"points": 5}})
    return Comment(**doc, author=brief(user))
