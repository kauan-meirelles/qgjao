"""Community chat models."""

from datetime import datetime

from pydantic import BaseModel, Field

from models.users import UserBrief

CHANNELS = ("geral", "memorias-postumas", "turnes-e-caravanas", "letras-e-teorias")


class ChatMessageIn(BaseModel):
    text: str = Field(min_length=1, max_length=500)


class ChatMessage(BaseModel):
    id: str
    channel: str
    author: UserBrief
    text: str
    created_at: datetime
