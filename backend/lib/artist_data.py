"""Static content about Jão — bio, discography, eras and tour dates (served via /api/artist)."""

from models.artist import ArtistData

IMG = "https://customer-assets-0z36b82j.emergentagent.net/job_jao-fans/artifacts"
PHOTO_LOBOS = f"{IMG}/161jlttd_IMG_1603.jpeg"      # retrato preto e branco deitado
PHOTO_ANTI_HEROI = f"{IMG}/bx3o3paa_IMG_1604.jpeg"  # queda com flecha nas nuvens
PHOTO_PIRATA = f"{IMG}/tnfcv6v7_IMG_1602.jpeg"      # gola vermelha e tapa-olho
PHOTO_SUPER = f"{IMG}/b1ir8ut2_IMG_1508.jpeg"       # estrela vermelha no jeans
PHOTO_SUPERNova = f"{IMG}/a8y9u6hy_IMG_1605.jpeg"   # dragão na noite estrelada
PHOTO_POSTUMAS = f"{IMG}/pkfyyuys_IMG_1606.jpeg"    # a moto MP na estrada

ARTIST = ArtistData(
    name="Jão",
    real_name="João Vitor Romania Balbino",
    born="3 de novembro de 1994",
    voice_type="Barítono Lírico",
    label="Universal Music Brasil",
    origin="Américo Brasiliense, São Paulo",
    bio=(
        "Jão é um dos maiores nomes do pop brasileiro da sua geração. Descoberto cantando "
        "covers no Instagram, transformou desamores em hinos com um barítono lírico raro e uma "
        "dramaticidade que virou marca registrada. São seis eras, seis capítulos: o lobo "
        "solitário do retrato preto e branco, o pirata de tapa-olho que zarpa, o anti-herói que "
        "cai com a flecha no peito, o Super que incendeia estádios, o Supernova cósmico e o "
        "Memórias Póstumas que consagra o poeta na estrada. Bem-vindo ao QG da matilha."
    ),
    stats=[
        {"label": "Álbuns de estúdio", "value": "6"},
        {"label": "Turnês realizadas", "value": "5"},
        {"label": "Ouvintes no Spotify", "value": "+30 mi/mês"},
        {"label": "Fãs na comunidade", "value": "Você"},
    ],
    albums=[
        {
            "id": "lobos",
            "title": "Lobos",
            "year": "2018",
            "color": "#8B263E",
            "cover": PHOTO_LOBOS,
            "description": "A estreia visceral: o retrato em preto e branco de desamores, juventude e vida no interior.",
            "hits": ["Imaturo", "Vou Morrer Sozinho", "Me Beija com Raiva", "Lindo Demais"],
            "spotify_url": "https://open.spotify.com/search/jao%20lobos",
            "youtube_url": "https://www.youtube.com/results?search_query=jao+album+lobos",
        },
        {
            "id": "anti-heroi",
            "title": "Anti-Herói",
            "year": "2019",
            "color": "#B22222",
            "cover": PHOTO_ANTI_HEROI,
            "description": "A queda com a flecha no peito: dor e término cantados com vulnerabilidade crua e arranjos orquestrados.",
            "hits": ["Enquanto Me Beija", "Essa Eu Fiz pro Nosso Amor", "Triste Pra Sempre", "Barcelona"],
            "spotify_url": "https://open.spotify.com/search/jao%20anti-heroi",
            "youtube_url": "https://www.youtube.com/results?search_query=jao+album+anti-heroi",
        },
        {
            "id": "pirata",
            "title": "Pirata",
            "year": "2021",
            "color": "#1A5276",
            "cover": PHOTO_PIRATA,
            "description": "Gola vermelha, tapa-olho e mar: a celebração do recomeço, da liberdade e dos amores intensos.",
            "hits": ["Coringa", "Não Te Amo", "Fugitivos", "Idiota", "Santo"],
            "spotify_url": "https://open.spotify.com/search/jao%20pirata",
            "youtube_url": "https://www.youtube.com/results?search_query=jao+album+pirata",
        },
        {
            "id": "super",
            "title": "Super",
            "year": "2023",
            "color": "#C0392B",
            "cover": PHOTO_SUPER,
            "description": "A estrela vermelha no jeans e o fogo do elemento final: grandes estádios, paixão inflamada e redenção cósmica.",
            "hits": ["Pilantra", "Me Lambe", "Alinhamento Milenar", "Maria", "Escorpião"],
            "spotify_url": "https://open.spotify.com/search/jao%20super",
            "youtube_url": "https://www.youtube.com/results?search_query=jao+album+super",
        },
        {
            "id": "supernova",
            "title": "Supernova",
            "year": "2025",
            "color": "#39417C",
            "cover": PHOTO_SUPERNova,
            "description": "O capítulo cósmico: noites estreladas e o dragão interior que só a matilha vê de perto.",
            "hits": ["Supernova"],
            "spotify_url": "https://open.spotify.com/search/jao%20supernova",
            "youtube_url": "https://www.youtube.com/results?search_query=jao+supernova",
        },
        {
            "id": "memorias-postumas",
            "title": "Memórias Póstumas",
            "year": "2026",
            "color": "#4A1521",
            "cover": PHOTO_POSTUMAS,
            "description": "A moto MP na estrada: o lirismo brasileiro consagrado — teatro, cartas, flores e despedida em grande estilo.",
            "hits": ["Catedral", "Memórias Póstumas", "Cartas de Amor"],
            "spotify_url": "https://open.spotify.com/search/jao%20memorias%20postumas",
            "youtube_url": "https://www.youtube.com/results?search_query=jao+memorias+postumas",
        },
    ],
    eras=[
        {
            "id": "lobos",
            "title": "Era Lobos",
            "year": "2018",
            "description": "O lobo que uiva sozinho: o retrato cru em preto e branco, romance trágico e o primeiro capítulo da matilha.",
            "photo": PHOTO_LOBOS,
            "color": "#8B263E",
        },
        {
            "id": "pirata",
            "title": "Era Pirata",
            "year": "2021",
            "description": "Gola vermelha, tapa-olho e vento no rosto: a era de zarpar e recomeçar.",
            "photo": PHOTO_PIRATA,
            "color": "#1A5276",
        },
        {
            "id": "anti-heroi",
            "title": "Era Anti-Herói",
            "year": "2019",
            "description": "A queda de costas com a flecha no peito: o coração mais exposto da discografia.",
            "photo": PHOTO_ANTI_HEROI,
            "color": "#B22222",
        },
        {
            "id": "super",
            "title": "Era Super",
            "year": "2023",
            "description": "Estrela vermelha no jeans e fogo nos palcos: o superlativo do Jão.",
            "photo": PHOTO_SUPER,
            "color": "#C0392B",
        },
        {
            "id": "supernova",
            "title": "Era Supernova",
            "year": "2025",
            "description": "O dragão contra a noite estrelada: o capítulo cósmico da matilha.",
            "photo": PHOTO_SUPERNova,
            "color": "#39417C",
        },
        {
            "id": "memorias-postumas",
            "title": "Era Memórias Póstumas",
            "year": "2026",
            "description": "A moto MP na estrada: o lirismo brasileiro consagrado — teatro, cartas, flores e despedida em grande estilo.",
            "photo": PHOTO_POSTUMAS,
            "color": "#4A1521",
        },
    ],
    tours=[
        {
            "name": "Turnê Memórias Póstumas",
            "city": "São Paulo, SP",
            "venue": "Allianz Parque",
            "date": "24 de outubro de 2026",
            "status": "Ingressos Disponíveis",
        },
        {
            "name": "Turnê Memórias Póstumas",
            "city": "Rio de Janeiro, RJ",
            "venue": "Farmasi Arena",
            "date": "7 de novembro de 2026",
            "status": "Últimos Ingressos",
        },
        {
            "name": "Turnê Memórias Póstumas",
            "city": "Curitiba, PR",
            "venue": "Pedreira Paulo Leminski",
            "date": "21 de novembro de 2026",
            "status": "Esgotado",
        },
        {
            "name": "Turnê Memórias Póstumas",
            "city": "Belo Horizonte, MG",
            "venue": "Esplanada do Mineirão",
            "date": "5 de dezembro de 2026",
            "status": "Ingressos Disponíveis",
        },
    ],
)