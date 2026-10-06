"""Password hashing + httpOnly cookie sessions. Import from routers only."""

import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, Request, Response
from passlib.context import CryptContext

from lib.db import db

COOKIE_NAME = "qgjao_session"
SESSION_DAYS = 30

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    try:
        return pwd_context.verify(password, hashed)
    except Exception:
        return False


def now_utc() -> datetime:
    """Aware UTC now — store aware so BSON reads come back comparable and JSON-serializable."""
    return datetime.now(timezone.utc)


def strip_doc(doc: dict) -> dict:
    """Drop Mongo internals and the password hash before handing a doc to Pydantic."""
    return {
        k: v
        for k, v in doc.items()
        if not k.startswith("_") and k != "password_hash"
    }


async def create_session(user_id: str) -> str:
    token = str(uuid.uuid4())
    await db.sessions.insert_one(
        {
            "token": token,
            "user_id": user_id,
            "created_at": now_utc(),
            "expires_at": now_utc() + timedelta(days=SESSION_DAYS),
        }
    )
    return token


async def delete_session(token: str) -> None:
    await db.sessions.delete_one({"token": token})


async def user_from_request(request: Request) -> dict | None:
    """Resolve the logged fan from the session cookie, or None (never raises)."""
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        return None
    session = await db.sessions.find_one({"token": token})
    if not session:
        return None
    expires = session.get("expires_at")
    if isinstance(expires, datetime):
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        if expires < now_utc():
            await delete_session(token)
            return None
    user = await db.users.find_one({"id": session["user_id"]})
    if not user:
        return None
    return user


async def require_user(request: Request) -> dict:
    user = await user_from_request(request)
    if user is None:
        raise HTTPException(status_code=401, detail="Entre com sua conta de fã para continuar.")
    return user


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        COOKIE_NAME,
        token,
        max_age=SESSION_DAYS * 24 * 3600,
        httponly=True,
        samesite="lax",
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(COOKIE_NAME, path="/")