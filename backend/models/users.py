"""User models."""
from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    username: str = Field(min_length=3, max_length=30)
    email: str
    password: str = Field(min_length=6)
    favorite_era: str | None = Field(default=None, max_length=50)


class LoginIn(BaseModel):
    email: str
    password: str


class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    bio: str | None = Field(default=None, max_length=300)
    quote: str | None = Field(default=None, max_length=150)
    favorite_era: str | None = Field(default=None, max_length=50)
    avatar_url: str | None = Field(default=None, max_length=500)
    banner_url: str | None = Field(default=None, max_length=500)


class UserBrief(BaseModel):
    id: str
    name: str
    username: str
    avatar_url: str | None = None


class UserPublic(BaseModel):
    id: str
    name: str
    username: str
    email: str
    favorite_era: str | None = None
    bio: str | None = None
    quote: str | None = None
    avatar_url: str | None = None
    banner_url: str | None = None
    points: int = 0
    created_at: datetime


class MeOut(BaseModel):
    user: UserPublic | None = None
    token: str | None = None