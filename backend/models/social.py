"""Feed models: posts, likes and comments."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from models.users import UserPublic, UserBrief

ERA_PATTERN = r"^(lobos|anti-heroi|pirata|super|supernova|memorias-postumas)$"


class PostCreate(BaseModel):
    text: str = Field(min_length=1, max_length=1200)
    image_url: str | None = Field(default=None, max_length=500)
    lyric: str | None = Field(default=None, max_length=300)
    era: str | None = Field(default=None, pattern=ERA_PATTERN)


class Post(BaseModel):
    id: str
    author: UserBrief
    text: str
    image_url: str | None = None
    lyric: str | None = None
    era: str | None = None
    like_count: int = 0
    comment_count: int = 0
    liked_by_me: bool = False
    created_at: datetime


class CommentCreate(BaseModel):
    text: str = Field(min_length=1, max_length=500)


class Comment(BaseModel):
    id: str
    post_id: str
    author: UserBrief
    text: str
    created_at: datetime


class LikeOut(BaseModel):
    liked: bool
    like_count: int


class ProfileOut(BaseModel):
    user: UserPublic
    posts: list[Post]