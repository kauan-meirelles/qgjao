# QG Jão — Especificação viva

Rede social/comunidade de fãs do cantor Jão. Tudo em pt-BR. FastAPI + MongoDB +
React 19 (Vite, TS strict) com tema escuro romântico (carmim #C41E3A, Playfair
Display + Instrument Sans).

## Eras (6, nesta ordem definida pelo usuário)
1. `lobos` — Lobos (2018), retrato P&B
2. `pirata` — Pirata (2021), gola vermelha e tapa-olho
3. `anti-heroi` — Anti-Herói (2019), queda com flecha
4. `super` — Super (2023), estrela vermelha no jeans
5. `supernova` — Supernova (2025), dragão na noite
6. `memorias-postumas` — Memórias Póstumas (2026), moto "MP"

Nota factual: "Pilantra" NÃO pertence ao álbum Super — hit principal do Super é
"Alinhamento Milenar".

## Modelo de dados (MongoDB, ids uuid4 string)
- `users` — name, username (único), email (único), password_hash (pbkdf2_sha256),
  favorite_era, bio, quote, avatar_url, banner_url, points. `level` é computado
  a partir de points.
- `sessions` — token (cookie httpOnly `qgjao_session`, 30 dias), user_id, expires_at
- `posts` — user_id, text, image_url, lyric, era, like_count, comment_count
- `post_likes` — (post_id, user_id) único · `comments` — post_id, user_id, text
- `forum_topics` — category, title, content, pinned, reply_count, like_count,
  view_count, liked_by[] · `forum_replies` — topic_id, content
- `chat_messages` — channel, user_id, text

## Pontuação (ranking)
post +10 · tópico +10 · comentário +5 · resposta no fórum +5 · curtida dada +2 ·
mensagem no chat +1.
Níveis: Filhote de Lobo (0) → Anti-Herói (100) → Tripulante Pirata (300) →
Super Fã (700) → Lobo Alpha (1500).

## Endpoints (todos em api_router, prefixo /api)
- `/auth/register|login|logout|me` — sessão por cookie httpOnly
- `/posts` GET/POST, `/posts/{id}` DELETE, `/posts/{id}/like`,
  `/posts/{id}/comments` GET/POST
- `/forum/topics` GET/POST, `/forum/topics/{id}` GET, `.../replies` POST, `.../like` POST
- `/chat/{channel}` GET/POST — canais: geral, supernova, turnes-e-caravanas, letras-e-teorias
- `/users/ranking`, `/users/me` PATCH, `/users/{username}`
- `/ai/captions` POST — legendas por IA (OpenAI gpt-5.4 via EMERGENT_LLM_KEY),
  com fallback para versos curados se a API falhar
- `/artist` GET — bio, 6 álbuns, 6 eras, 4 datas de turnê (conteúdo estático)

## Rotas do frontend
`/` Feed · `/login` · `/cadastro` · `/artista` · `/forum` · `/forum/:id` ·
`/ranking` · `/chat` · `/perfil` e `/perfil/:username`

## Dados semeados (backend/seed.py, idempotente)
6 fãs, 9 posts, 10 comentários, 6 tópicos, 8 respostas, 12 mensagens no chat.
Credenciais em `memory/test_credentials.md` (senha comum: `jao2026`).

## Histórico de correções
- `routers/auth.py` faltava `from lib.db import db` → cadastro e login davam 500.
  Corrigido; ambos verificados (201/200) pela URL pública.