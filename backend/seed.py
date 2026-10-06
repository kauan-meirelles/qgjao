"""Idempotent seed for the Jão fan community. Run: cd /app/backend && python seed.py"""

import asyncio
from datetime import timedelta

from lib.db import db, ensure_indexes
from lib.security import hash_password, now_utc

PASSWORD = "jao2026"

IMG = "https://customer-assets-0z36b82j.emergentagent.net/job_jao-fans/artifacts"
PHOTO_LOBOS = f"{IMG}/161jlttd_IMG_1603.jpeg"     # retrato preto e branco deitado
PHOTO_ANTI_HEROI = f"{IMG}/bx3o3paa_IMG_1604.jpeg"  # queda com flecha nas nuvens
PHOTO_PIRATA = f"{IMG}/tnfcv6v7_IMG_1602.jpeg"      # gola vermelha e tapa-olho
PHOTO_SUPER = f"{IMG}/b1ir8ut2_IMG_1508.jpeg"       # estrela vermelha no jeans
PHOTO_SUPERNova = f"{IMG}/a8y9u6hy_IMG_1605.jpeg"   # dragão na noite estrelada
PHOTO_POSTUMAS = f"{IMG}/pkfyyuys_IMG_1606.jpeg"    # a moto MP na estrada
PHOTO_MEMORIAS = f"{IMG}/pkfyyuys_IMG_1606.jpeg"    # Adicionado para evitar o erro

USERS = [
    ("Alice Rocha", "loba_alice", "alice@qgjao.com", "super", 1840,
     "Sobrevivi à SuperTurnê com a voz rouca e o coração inteiro. Se virar um lobo correndo no campo, é a minha essência.",
     "Eu era mais eu perto de você."),
    ("Pedro Nogueira", "coringa_pedro", "pedro@qgjao.com", "anti-heroi", 940,
     "Anti-Herói me ensinou que tristeza também se canta em ré maior. Coleciono vinis e teorias sobre clipes.",
     "Me beija com raiva, que o resto a gente improvisa."),
    ("Mariana Duarte", "pirata_mari", "mari@qgjao.com", "pirata", 620,
     "Pirata é recomeço: cortei tudo, mudei de cidade e zarpei. Chapéu vermelho é assinatura.",
     "Não te amo, resposta pronta."),
    ("Renato Silva", "rex_lobos", "rex@qgjao.com", "lobos", 380,
     "Do interior de SP também. Ouvir 'Vou Morrer Sozinho' no busão é um esporte radical.",
     "Aquele 1% mora em mim."),
    ("Júlia Castro", "catedral_ju", "ju@qgjao.com", "memorias-postumas", 160,
     "Memórias Póstumas é literatura em forma de pop. Escrevo resenhas de cada show.",
     "Catedral de mim é feita de você."),
    ("Téo Almeida", "filhote_teo", "teo@qgjao.com", "super", 40,
     "Fã novinho: vim pelo 'Me Lambe' e fiquei pela matilha.",
     "Alinhamento milenar dos meus planos."),
]

POSTS = [
    ("loba_alice", "Corri no campo, gritei 'Alinhamento Milenar' e voltei pessoa nova. Essa era vive em mim o ano inteiro.", "super", PHOTO_SUPER, "Alinhamento milenar dos meus planos.", 2),
    ("coringa_pedro", "Relembrei Anti-Herói inteiro ontem. Toda tracks cortam na mesma ferida e eu volto sempre.", "anti-heroi", PHOTO_ANTI_HEROI, "Enquanto me beija, eu finjo que esqueci.", 2),
    ("pirata_mari", "Meu look da era Pirata tá pronto pro show: chapéu vermelho e zero medo. Quem mais vai?", "pirata", PHOTO_PIRATA, "Zarpei e nunca mais voltei pra beira.", 1),
    ("catedral_ju", "Catedral ao vivo foi o momento mais lindo que já vi num palco. Chorei na frente de 40 mil pessoas e faria de novo.", "memorias-postumas", PHOTO_MEMORIAS, None, 0),
    ("rex_lobos", "Lobos faz 8 anos e eu ainda odeio amar você do jeito que o álbum ensinou.", "lobos", PHOTO_LOBOS, "Vou morrer sozinho, mas hoje eu só quero você.", 4),
    ("loba_alice", "Quem vai na Allianz em outubro? A matilha vai ocupar o anel superior inteiro. Caravana confirmada!", "super", None, None, 2),
    ("pirata_mari", "Playlist da caravana de Curitiba pronta: começa em Fugitivos e termina em Catedral. Roteiro emocional calculado.", "pirata", None, "Fugitivos é a gente no banco de trás cantando até perder a voz.", 1),
    ("filhote_teo", "Semana que vem completo 3 meses de fã. Comecei pelo Me Lambe e já ouvi os seis álbuns. Fui abraçado por vocês.", "super", None, None, 5),
    ("coringa_pedro", "Coringa não é sobre palhaço: é sobre virar piada e aprender a dar risada junto. Mudou minha cabeça.", "anti-heroi", None, "Not he amo, mas te amo de um jeito que não tem reflexo.", 0),
]

COMMENTS = [
    ("loba_alice", 0, "Esse refrão mora em mim de aluguel."),
    ("pirata_mari", 0, "A energia dessa era é insubstituível!"),
    ("filhote_teo", 0, "Ainda vou viver isso um dia, quem sabe."),
    ("rex_lobos", 1, "Esse álbum é um corte profundo, sem anestesia."),
    ("catedral_ju", 1, "Concordo em tudo, especialmente na ferida."),
    ("loba_alice", 2, "Chapéu vermelho ou nada. Combinado!"),
    ("coringa_pedro", 2, "Caravana de SP confirma presença."),
    ("pirata_mari", 3, "Catedral ao vivo é outro plano dimensional."),
    ("filhote_teo", 4, "Bem-vinda ao clube, essa matilha abraça mesmo."),
    ("catedral_ju", 7, "Três meses e cinco álbuns? Respeito de veterana."),
]

TOPICS = [
    ("loba_alice", "geral", "Bem-vindos ao QG Jão! Apresentem-se aqui", "Regras da matilha: respeito acima de tudo, spoiler de setlist só com aviso, e todo mundo começa se apresentando: de onde você é, sua era favorita e a música que te trouxe pra cá.", True),
    ("coringa_pedro", "albuns", "Qual o melhor primeiro álbum para apresentar o Jão a alguém?", "Minha mãe pediu uma playlist e eu travei. Lobos pela cronologia? Anti-Herói pela dor bonita? Pirata pela energia? Combinar umas 5 músicas de cada era e deixar ela escolher o caminho?", False),
    ("pirata_mari", "shows", "Caravana oficial SP — Allianz Parque, 24/10", "Fechamos o bloco do anel superior! Vou criar um grupo pra combinar horário, metrô e a tradicional foto da matilha com a estrela vermelha desenhada na bochecha. Quem quiser, responde aqui com o nome.", False),
    ("catedral_ju", "letras", "Teoria: Catedral conta a mesma história de Fugindo de Casa", "Ouçam as duas em sequência: a arquitetura emocional é a mesma, só muda o ponto de vista — quem fica e quem vai. A 'catedral' seria justamente a casa que ele reencontra no final. O que vocês acham?", False),
    ("rex_lobos", "letras", "O lobo como personagem: uma linha do tempo escondida", "O lobo aparece no primeiro álbum, some no segundo (anti-herói é a pele que sobrou do lobo?), volta domesticado no terceiro e finalmente corre livre no clipe do campo. Alguém mais caçou essa linha?", False),
    ("filhote_teo", "ingressos", "Troco par de ingresso Curitiba por BH", "Comprei Curitiba por conta de um imprevisto e agora só consigo ir em BH. Troco par por par, mesmos valores, sem TAXA de ninguém. Combinamos na DM.", False),
]

REPLIES = [
    ("pirata_mari", 0, "Pirata Mari, de Recife, era Pirata, música que me trouxe: Coringa."),
    ("filhote_teo", 0, "Téo, do RJ, era Super, e foi Me Lambe no rádio do trabalho."),
    ("loba_alice", 1, "Começa por Lobos, sempre. É a porta da casa."),
    ("catedral_ju", 1, "Anti-Herói. Se a pessoa aguentar a dor bonita, fica pra sempre."),
    ("filhote_teo", 2, "Presença confirmada! Primeiro show da minha vida."),
    ("rex_lobos", 3, "Essa teoria me quebrou. Faz sentido DEMAIS com o final do clipe."),
    ("loba_alice", 4, "A linha do lobo é real e você expressou em palavras o que eu sentia há anos."),
    ("pirata_mari", 5, "Chamou no privado, sem pressa — boa sorte com o imprevisto!"),
]

CHAT = [
    ("loba_alice", "Boa noite, matilha! Quem aí já garantiu ingresso pro Allianz?"),
    ("coringa_pedro", "Garanti! Setor 112, coração preparado pra Catedral."),
    ("pirata_mari", "Vou de caravana de Recife, quem tá dentro?"),
    ("rex_lobos", "Eu!!! Só preciso resolver o sábado, mas tá quase."),
    ("filhote_teo", "Primeiro show da minha vida e já vai ser do Jão, imagina."),
    ("catedral_ju", "Vão chorar no mesmo refrão que eu, é um ritual."),
    ("loba_alice", "A praça de comida do Allianz é cara, comam antes, aviso de veterana."),
    ("pirata_mari", "Notado kkkk lanche na rodoviária então."),
    ("coringa_pedro", "Alguém sabe se abre porta 15h?"),
    ("catedral_ju", "No último foi 16h, mas chega cedo que a fila da loja é gigante."),
    ("loba_alice", "A loja! Preciso do windbreaker novo da turnê."),
    ("filhote_teo", "Sonho em ter qualquer coisa da era Memórias."),
]


async def seed() -> None:
    await ensure_indexes()

    if await db.posts.count_documents({}) > 0:
        print("seed: banco já tem posts — nada a fazer")
        return

    now = now_utc()
    users: dict[str, dict] = {}
    
    # Se os utilizadores já existirem na base de dados, reutiliza-os para evitar duplicação de chave
    async for existing_user in db.users.find({}):
        users[existing_user["username"]] = existing_user

    for i, (name, username, email, era, points, bio, quote) in enumerate(USERS):
        if username in users:
            continue
        doc = {
            "id": f"seed-user-{username}",
            "name": name,
            "username": username,
            "email": email,
            "favorite_era": era,
            "bio": bio,
            "quote": quote,
            "avatar_url": None,
            "banner_url": None,
            "points": points,
            "created_at": now - timedelta(days=60 - i * 7),
            "password_hash": hash_password(PASSWORD),
        }
        users[username] = doc
        await db.users.insert_one(doc)

    for i, (username, text, era, image, lyric, n_likes) in enumerate(POSTS):
        author = users[username]
        likers = list(users.values())[: n_likes + 1]
        created = now - timedelta(hours=len(POSTS) * 3 - i * 5)
        post = {
            "id": f"seed-post-{i}",
            "user_id": author["id"],
            "text": text,
            "image_url": image,
            "lyric": lyric,
            "era": era,
            "like_count": len(likers),
            "comment_count": 0,
            "created_at": created,
        }
        await db.posts.insert_one(post)
        for liker in likers:
            await db.post_likes.insert_one(
                {
                    "id": f"seed-like-{i}-{liker['username']}",
                    "post_id": post["id"],
                    "user_id": liker["id"],
                    "created_at": created,
                }
            )

    post_ids = [f"seed-post-{i}" for i in range(len(POSTS))]
    for i, (username, post_index, text) in enumerate(COMMENTS):
        author = users[username]
        created = now - timedelta(hours=len(POSTS) * 3 - post_index * 5 - 1 + i // 3)
        await db.comments.insert_one(
            {
                "id": f"seed-comment-{i}",
                "post_id": post_ids[post_index],
                "user_id": author["id"],
                "text": text,
                "created_at": created,
            }
        )
        await db.posts.update_one({"id": post_ids[post_index]}, {"$inc": {"comment_count": 1}})

    topic_ids: list[str] = []
    for i, (username, category, title, content, pinned) in enumerate(TOPICS):
        author = users[username]
        topic = {
            "id": f"seed-topic-{i}",
            "user_id": author["id"],
            "category": category,
            "title": title,
            "content": content,
            "pinned": pinned,
            "reply_count": 0,
            "like_count": 3 + i,
            "view_count": 40 + i * 17,
            "liked_by": [],
            "created_at": now - timedelta(days=10 - i),
        }
        topic_ids.append(topic["id"])
        await db.forum_topics.insert_one(topic)

    for i, (username, topic_index, content) in enumerate(REPLIES):
        author = users[username]
        created = now - timedelta(days=10 - topic_index, hours=-i)
        await db.forum_replies.insert_one(
            {
                "id": f"seed-reply-{i}",
                "topic_id": topic_ids[topic_index],
                "user_id": author["id"],
                "content": content,
                "created_at": created,
            }
        )
        await db.forum_topics.update_one({"id": topic_ids[topic_index]}, {"$inc": {"reply_count": 1}})

    for i, (username, text) in enumerate(CHAT):
        author = users[username]
        await db.chat_messages.insert_one(
            {
                "id": f"seed-chat-{i}",
                "channel": "geral",
                "user_id": author["id"],
                "text": text,
                "created_at": now - timedelta(minutes=len(CHAT) - i),
            }
        )

    print(f"seed: {len(USERS)} fãs, {len(POSTS)} posts, {len(TOPICS)} tópicos, {len(CHAT)} mensagens")


if __name__ == "__main__":
    asyncio.run(seed())