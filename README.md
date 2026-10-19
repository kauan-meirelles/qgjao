<div align="center">

# 🐺 QG Jão

**A rede social feita por fã, para fãs do Jão.**
Poste sobre a sua era favorita, discuta teorias no fórum, converse no chat e suba no ranking até virar Lobo Alpha.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
<br/>
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

</div>

> [!NOTE]
> Este é um **projeto de estudo**, feito por diversão e para praticar desenvolvimento full-stack. Não é um produto oficial e não tem nenhuma ligação com o Jão ou com a equipe dele.

---

## 💭 Sobre

Eu queria praticar o desenvolvimento de uma rede social completa, de ponta a ponta, e escolhi um tema que me motivasse: o Jão. O resultado é o **QG Jão**, um espaço com feed, fórum, chat e ranking, todo organizado em torno das eras do artista.

Tudo é em português, com um tema escuro e romântico (vermelho carmim, tipografia Playfair Display), inspirado na estética dos álbuns.

## ✨ Funcionalidades

| | Funcionalidade | O que faz |
|---|---|---|
| 📰 | **Feed** | Posts com texto, imagem, trecho de letra e era. Dá para curtir e comentar |
| ✍️ | **Legendas com IA** | Sem inspiração? Escolha uma emoção e a IA sugere 3 legendas no clima do Jão. Se a IA estiver fora do ar, entram versos escolhidos à mão |
| 💬 | **Fórum** | Tópicos por categoria, respostas, curtidas, contador de visualizações e tópicos fixados |
| 🗨️ | **Chat** | Canais temáticos: `#geral`, `#supernova`, `#turnes-e-caravanas` e `#letras-e-teorias` |
| 🏆 | **Ranking** | Cada interação vale pontos, e os pontos definem o seu nível de fã |
| 👤 | **Perfil** | Avatar, banner, bio, citação favorita e a sua era preferida |
| 🎤 | **Página do artista** | Bio, discografia, as 6 eras e as datas da turnê |

### 🐺 Do Filhote ao Lobo Alpha

Todo mundo começa como **Filhote de Lobo** e vai subindo conforme participa da comunidade:

| Nível | Pontos | | Ação | Pontos |
|---|---|---|---|---|
| 🐾 Filhote de Lobo | 0 | | Criar post | +10 |
| 🏹 Anti-Herói | 100 | | Criar tópico no fórum | +10 |
| 🏴‍☠️ Tripulante Pirata | 300 | | Comentar | +5 |
| ⭐ Super Fã | 700 | | Responder no fórum | +5 |
| 🐺 Lobo Alpha | 1500 | | Curtir | +2 |
| | | | Mandar mensagem no chat | +1 |

### 💿 As eras

`Lobos` · `Anti-Herói` · `Pirata` · `Super` · `Supernova` · `Memórias Póstumas`

Cada post pode ser marcado com uma era, e cada fã escolhe a sua era favorita no perfil.

## 🛠️ Tecnologias

**Frontend:** React + TypeScript, Vite, Tailwind CSS 4, shadcn/ui, TanStack Query, React Router

**Backend:** Python, FastAPI, MongoDB (driver assíncrono `motor`), Pydantic, Passlib, OpenAI API

### O que eu pratiquei aqui

- **Autenticação com sessão:** login com senha em hash (`pbkdf2_sha256`) e sessão guardada no banco, enviada num cookie `httpOnly` de 30 dias.
- **Gamificação:** um sistema de pontos que reage às ações do usuário e calcula o nível na hora.
- **Integração com IA e plano B:** a rota de legendas chama a OpenAI com tempo limite e, se der erro, devolve versos pré-definidos. O usuário nunca fica sem resposta.
- **Modelagem no MongoDB:** índices únicos para e-mail, @ e curtidas (ninguém curte o mesmo post duas vezes) e contadores guardados junto do documento para o feed carregar rápido.
- **API REST organizada por domínio:** routers separados para `auth`, `users`, `posts`, `forum`, `chat`, `ai` e `artist`.

## 📂 Estrutura

```
qgjao/
├── backend/
│   ├── server.py        # app FastAPI, CORS e registro das rotas
│   ├── seed.py          # popula o banco com fãs, posts, tópicos e mensagens
│   ├── lib/             # conexão e índices do Mongo, sessão/segurança, dados do artista
│   ├── models/          # schemas Pydantic
│   └── routers/         # auth, users, posts, forum, chat, ai, artist
└── frontend/
    └── src/
        ├── pages/       # Feed, Login, Cadastro, Artista, Fórum, Ranking, Chat, Perfil
        ├── components/  # PostCard, PostComposer, AICaptionDialog, FanBadge... + shadcn/ui
        └── lib/         # cliente da API, sessão, tipos e regras de nível
```

## 🚀 Como rodar

Você precisa de **Python 3.11+**, **Node.js 20+** e um **MongoDB** (local ou [MongoDB Atlas](https://www.mongodb.com/atlas) gratuito).

### 1. Backend

```bash
cd backend
pip install fastapi "uvicorn[standard]" motor pymongo certifi pydantic email-validator python-dotenv passlib openai
```

Crie um arquivo `.env` dentro de `backend/`:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=qgjao
# Opcional: sem a chave, as legendas usam os versos pré-definidos
OPENAI_API_KEY=
```

Popule o banco e suba a API na porta 8000:

```bash
python seed.py
python -m uvicorn server:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abra **http://localhost:5173** 🎉

### 👋 Contas de teste

O `seed.py` cria 6 fãs, todos com a senha `jao2026`. A conta mais completa para testar é a da Alice:

| E-mail | @ | Nível |
|---|---|---|
| `alice@qgjao.com` | loba_alice | 🐺 Lobo Alpha |
| `pedro@qgjao.com` | coringa_pedro | ⭐ Super Fã |
| `mari@qgjao.com` | pirata_mari | 🏴‍☠️ Tripulante Pirata |
| `teo@qgjao.com` | filhote_teo | 🐾 Filhote de Lobo |

## 🔌 API

<details>
<summary><b>Ver todas as rotas</b></summary>

<br/>

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Cria conta |
| `POST` | `/api/auth/login` | Entra e define o cookie de sessão |
| `POST` | `/api/auth/logout` | Sai |
| `GET` | `/api/auth/me` | Usuário logado |
| `GET` `POST` | `/api/posts` | Feed e novo post |
| `DELETE` | `/api/posts/{id}` | Apaga post |
| `POST` | `/api/posts/{id}/like` | Curte / descurte |
| `GET` `POST` | `/api/posts/{id}/comments` | Comentários |
| `GET` `POST` | `/api/forum/topics` | Tópicos do fórum |
| `GET` | `/api/forum/topics/{id}` | Tópico com respostas |
| `POST` | `/api/forum/topics/{id}/replies` | Responde tópico |
| `POST` | `/api/forum/topics/{id}/like` | Curte tópico |
| `GET` `POST` | `/api/chat/{canal}` | Mensagens do canal |
| `GET` | `/api/users/ranking` | Ranking de fãs |
| `GET` | `/api/users/{username}` | Perfil público |
| `PATCH` | `/api/users/me` | Edita o próprio perfil |
| `POST` | `/api/ai/captions` | Gera 3 legendas com IA |
| `GET` | `/api/artist` | Bio, álbuns, eras e turnê |

Com o backend rodando, a documentação interativa fica em **http://localhost:8000/docs**.

</details>

---

<div align="center">

Feito com 🎧 e muito *Supernova* no repeat por **[Kauan Meirelles](https://github.com/kauan-meirelles)**

</div>
