"""Auth: register, login, logout and who-am-I. Sessions are httpOnly cookies."""

import uuid

from fastapi import APIRouter, HTTPException, Request, Response

from lib.db import db
from lib.security import (
    COOKIE_NAME,
    clear_session_cookie,
    create_session,
    delete_session,
    hash_password,
    now_utc,
    set_session_cookie,
    user_from_request,
    verify_password,
)
from lib.social import public_user as social_public_user
from models.users import LoginIn, MeOut, UserCreate, UserPublic

router = APIRouter(prefix="/auth", tags=["auth"])


def strip_doc(doc: dict) -> dict:
    """Remove o _id do MongoDB para evitar conflitos de serialização."""
    if doc and "_id" in doc:
        doc = dict(doc)
        doc.pop("_id", None)
    return doc


def public_user(doc: dict) -> UserPublic:
    payload = strip_doc(doc)
    payload.pop("level", None)  # computed_field: rebuilt from points on serialization
    return UserPublic(**payload)


@router.post("/register", response_model=UserPublic, status_code=201)
async def register(payload: UserCreate, response: Response):
    email = payload.email.strip().lower()
    username = payload.username.strip().lstrip("@").lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Este e-mail já tem conta aqui.")
    if await db.users.find_one({"username": username}):
        raise HTTPException(status_code=409, detail="Esse @ já foi escolhido por outro fã.")

    user = UserPublic(
        id=str(uuid.uuid4()),
        name=payload.name.strip(),
        username=username,
        email=email,
        favorite_era=payload.favorite_era,
        created_at=now_utc(),
    )
    doc = user.model_dump()
    doc.pop("level", None)
    doc["password_hash"] = hash_password(payload.password)
    await db.users.insert_one(doc)

    set_session_cookie(response, await create_session(user.id))
    return user


@router.post("/login", response_model=UserPublic)
async def login(payload: LoginIn, response: Response):
    doc = await db.users.find_one({"email": payload.email.strip().lower()})
    if not doc or not verify_password(payload.password, doc.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")
    set_session_cookie(response, await create_session(doc["id"]))
    return public_user(doc)


@router.post("/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get(COOKIE_NAME)
    if token:
        await delete_session(token)
    clear_session_cookie(response)
    return {"ok": True}


@router.get("/me", response_model=MeOut)
@router.post("/me", response_model=MeOut)
async def me(request: Request):
    doc = await user_from_request(request)
    token = request.cookies.get(COOKIE_NAME)
    
    if not doc:
        return MeOut(user=None, token=token)
    
    return MeOut(user=public_user(doc), token=token)