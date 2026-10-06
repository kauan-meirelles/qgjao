from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from lib.db import client, db, ensure_indexes
from routers import ai, artist, auth, chat, forum, posts, users

# Inicialização da aplicação principal
app = FastAPI(title="QG Jão API", version="1.0.0")

# Configuração correta de CORS para aceitar credenciais (cookies de sessão)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router centralizado para a API com prefixo
api_router = APIRouter(prefix="/api")

@api_router.get("/status")
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return status_checks

# Feature routers — mounted with their own prefixes under /api
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(posts.router)
api_router.include_router(forum.router)
api_router.include_router(chat.router)
api_router.include_router(ai.router)
api_router.include_router(artist.router)

# Include the router in the main app
app.include_router(api_router)