"""Fan profiles and the community ranking."""

from fastapi import APIRouter, Depends, HTTPException, Request

from lib.db import db
from lib.security import strip_doc, user_from_request, require_user
from lib.social import fetch_posts, public_user
from models.social import ProfileOut
from models.users import ProfileUpdate, UserPublic

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/ranking", response_model=list[UserPublic])
async def ranking():
    docs = await db.users.find().sort("points", -1).limit(50).to_list(50)
    return [public_user(d) for d in docs]


@router.patch("/me", response_model=UserPublic)
async def update_me(payload: ProfileUpdate, user: dict = Depends(require_user)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        await db.users.update_one({"id": user["id"]}, {"$set": updates})
    doc = await db.users.find_one({"id": user["id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Conta não encontrada.")
    return UserPublic(**strip_doc(doc))


@router.get("/{username}", response_model=ProfileOut)
async def profile(username: str, request: Request):
    doc = await db.users.find_one({"username": username.strip().lstrip("@").lower()})
    if not doc:
        raise HTTPException(status_code=404, detail="Fã não encontrado na matilha.")
    me = await user_from_request(request)
    posts = await fetch_posts({"user_id": doc["id"]}, me, limit=50)
    return ProfileOut(user=public_user(doc), posts=posts)