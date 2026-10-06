"""AI caption generator — OpenAI integration.

Falls back to curated Jão-flavored verses if the API is unavailable, so the
button never dead-ends for a fan.
"""

import asyncio
import logging
import os
import uuid

from fastapi import APIRouter, Depends
from openai import OpenAI
from pydantic import BaseModel, Field

from lib.security import require_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["ai"])

SYSTEM_PROMPT = (
    "Você é o ghostwriter poético da comunidade de fãs do cantor brasileiro Jão. "
    "Escreva legendas curtas (uma ou duas frases), em português do Brasil, com "
    "romantismo dramático e imagens poéticas — lobos, piratas, corações partidos, "
    "neon, estrada, chuva, mar. Nada de celebridades reais além de referências "
    "sutis ao universo do Jão. Devolva EXATAMENTE 3 legendas, uma por linha, "
    "sem numeração, sem aspas e sem qualquer explicação."
)

FALLBACKS: dict[str, list[str]] = {
    "Saudade": [
        "Saudade é o nome que dá para o silêncio entre uma música e outra.",
        "Se me perguntarem, eu moro no refrão que a gente cantava juntos.",
        "Tem saudade que nem dói mais: virou trilha sonora.",
    ],
    "Amor Intenso": [
        "Amar assim é morar num estádio só de coração aceso.",
        "Se o amor tem trilha, a nossa é inteira em tom maior.",
        "Meu peito virou palco e só toca você.",
    ],
    "Deboche/Coringa": [
        "Sorri de volta pro azar: agora quem dança sou eu.",
        "Não choro mais no chuveiro — ensaio o refrão em vez disso.",
        "Coringa de baralho novo: quem perde é quem duvidou.",
    ],
    "Superação": [
        "Apaguei seu nome da lista de reprodução e da minha vida.",
        "Cresci na direção que a dor apontava: pra frente.",
        "Hoje o espelho aplaude de pé.",
    ],
    "Melancolia": [
        "Chove dentro aqui faz tempo, e eu aprendi a gostar do barulho.",
        "As ruas ficam mais bonitas quando a tristeza poetiza tudo.",
        "Guardo a chuva num vidro pra dias em que a saudade aperta.",
    ],
}


class CaptionIn(BaseModel):
    emotion: str = Field(default="Saudade", max_length=40)
    topic: str | None = Field(default=None, max_length=300)


class CaptionsOut(BaseModel):
    captions: list[str]
    source: str  # "ai" | "curated"


@router.post("/captions", response_model=CaptionsOut)
async def captions(payload: CaptionIn, user: dict = Depends(require_user)):
    emotion = payload.emotion if payload.emotion in FALLBACKS else "Saudade"
    api_key = os.environ.get("OPENAI_API_KEY", "") or os.environ.get("EMERGENT_LLM_KEY", "")

    if api_key:
        try:
            text = await asyncio.wait_for(_generate(payload, emotion, api_key), timeout=40)
            lines = [line.strip(" \t\"'•-") for line in text.splitlines()]
            lines = [line for line in lines if len(line) > 3][:3]
            if len(lines) == 3:
                return CaptionsOut(captions=lines, source="ai")
            logger.warning("ai captions: modelo devolveu %s linhas, usando fallback", len(lines))
        except Exception as exc:
            logger.warning("ai captions: %s — usando versos curados", exc)
    else:
        logger.warning("ai captions: Chave de API ausente — versos curados")

    return CaptionsOut(captions=FALLBACKS[emotion], source="curated")


async def _generate(payload: CaptionIn, emotion: str, api_key: str) -> str:
    client = OpenAI(api_key=api_key)
    prompt = f"Emoção: {emotion}"
    if payload.topic and payload.topic.strip():
        prompt += f"\nTema do fã: {payload.topic.strip()}"
    else:
        prompt += "\nTema: livre inspiração do dia."

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        max_tokens=150,
    )
    return response.choices[0].message.content or ""