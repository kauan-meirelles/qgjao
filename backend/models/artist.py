"""Artist page models — mirrors the static content in lib/artist_data.py."""

from pydantic import BaseModel


class Stat(BaseModel):
    label: str
    value: str


class Album(BaseModel):
    id: str
    title: str
    year: str
    color: str
    cover: str
    description: str
    hits: list[str]
    spotify_url: str
    youtube_url: str


class EraInfo(BaseModel):
    id: str
    title: str
    year: str
    description: str
    photo: str
    color: str


class TourDate(BaseModel):
    name: str
    city: str
    venue: str
    date: str
    status: str


class ArtistData(BaseModel):
    name: str
    real_name: str
    born: str
    voice_type: str
    label: str
    origin: str
    bio: str
    stats: list[Stat]
    albums: list[Album]
    eras: list[EraInfo]
    tours: list[TourDate]