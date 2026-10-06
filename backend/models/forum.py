"""Forum models: topics and thread replies."""

from datetime import datetime

from pydantic import BaseModel, Field

from models.users import UserBrief

Category = str


class TopicCreate(BaseModel):
    category: str = Field(pattern=r"^(geral|albuns|shows|letras|ingressos)$")
    title: str = Field(min_length=5, max_length=140)
    content: str = Field(min_length=5, max_length=4000)


class Topic(BaseModel):
    id: str
    author: UserBrief
    category: str
    title: str
    content: str
    pinned: bool = False
    reply_count: int = 0
    like_count: int = 0
    view_count: int = 0
    liked_by_me: bool = False
    created_at: datetime


class ReplyCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000)


class Reply(BaseModel):
    id: str
    topic_id: str
    author: UserBrief
    content: str
    created_at: datetime


class TopicDetail(BaseModel):
    topic: Topic
    replies: list[Reply]