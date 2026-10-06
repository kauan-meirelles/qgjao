"""Artist page data — bio, discography, eras and tour dates."""

from fastapi import APIRouter

from lib.artist_data import ARTIST
from models.artist import ArtistData

router = APIRouter(prefix="/artist", tags=["artist"])


@router.get("", response_model=ArtistData)
async def get_artist():
    return ARTIST
