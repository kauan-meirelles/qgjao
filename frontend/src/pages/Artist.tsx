import { useQuery } from "@tanstack/react-query";
import { MapPin, Music2, Ticket } from "lucide-react";
import { toast } from "sonner";
import { apiGet } from "@/lib/api";
import type { Album, ArtistData, TourDate } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Componente do YouTube integrado para manter o import intacto sem erros
const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

export default function Artist() {
  const artistQ = useQuery({
    queryKey: ["artist"],
    queryFn: () => apiGet<ArtistData>("/artist"),
  });

  const data = artistQ.data;

  return (
    <div>
      {/* Cinematic banner */}
      <section className="relative isolate overflow-hidden border-b border-border" data-testid="artist-hero">
        {data ? (
          <img
            src={data.eras[data.eras.length - 1].photo}
            alt="Jão na era Memórias Póstumas"
            className="h-[320px] w-full object-cover object-top sm:h-[400px]"
          />
        ) : (
          <div className="h-[320px] w-full animate-pulse bg-muted sm:h-[400px]" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,9,10,0.25) 0%, rgba(13,9,10,0.72) 60%, #0D090A 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-5xl px-4 pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7B7B]">
              O universo de
            </p>
            <h1 className="mt-2 font-heading text-5xl font-bold tracking-tight text-[#FFF9F5] sm:text-6xl">
              Jão
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {data ? (
                [data.real_name, data.born, data.voice_type, data.label].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[#3D2B32] bg-[#0D090A]/60 px-3 py-1 text-xs text-[#D6C7CA] backdrop-blur-sm"
                  >
                    {chip}
                  </span>
                ))
              ) : (
                <div className="h-6 w-64 animate-pulse rounded-full bg-muted" />
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        {/* Bio */}
        <section>
          <h2 className="font-heading text-2xl font-bold tracking-tight">O contador de histórias do pop brasileiro</h2>
          {data ? (
            <>
              <p className="mt-3 max-w-3xl leading-relaxed text-foreground/90" data-testid="artist-bio">
                {data.bio}
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="artist-stats">
                {data.stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</dt>
                    <dd className="mt-1 font-heading text-xl font-bold text-primary">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <div className="mt-3 h-20 w-full animate-pulse rounded bg-muted" />
          )}
        </section>

        {/* Discografia */}
        <section>
          <h2 className="font-heading text-2xl font-bold tracking-tight">Discografia</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cinco álbuns, cinco capítulos — ouça no Spotify ou assista no YouTube.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="artist-albums">
            {(data?.albums ?? []).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
            {!data && [0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />)}
          </div>
        </section>

        {/* Eras */}
        <section>
          <h2 className="font-heading text-2xl font-bold tracking-tight">As eras</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cada era é um capítulo do coração do Jão — arraste para o lado.
          </p>
          <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-4" data-testid="artist-eras">
            {(data?.eras ?? []).map((era) => (
              <article
                key={era.id}
                data-testid={`artist-era-card-${era.id}`}
                className="w-64 shrink-0 snap-start overflow-hidden rounded-xl border border-border bg-[#1C1417]"
              >
                <img src={era.photo} alt={era.title} className="h-64 w-full object-cover" loading="lazy" />
                <div className="space-y-1.5 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-bold">{era.title}</h3>
                    <span className="text-xs text-muted-foreground">{era.year}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{era.description}</p>
                </div>
              </article>
            ))}
            {!data && [0, 1, 2].map((i) => <div key={i} className="h-96 w-64 shrink-0 animate-pulse rounded-xl bg-muted" />)}
          </div>
        </section>

        {/* Agenda */}
        <section>
          <h2 className="font-heading text-2xl font-bold tracking-tight">Agenda de shows</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Turnê Memórias Póstumas — garanta seu lugar na matilha.
          </p>
          <ul className="mt-5 space-y-3" data-testid="artist-tours">
            {(data?.tours ?? []).map((tour, i) => (
              <TourRow key={i} tour={tour} index={i} />
            ))}
            {!data && [0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}
          </ul>
        </section>
      </div>
    </div>
  );
}

function AlbumCard({ album }: { album: Album }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0" data-testid={`album-card-${album.id}`}>
      <div className="relative">
        <img src={album.cover} alt={`Capa do álbum ${album.title}`} className="h-56 w-full object-cover" loading="lazy" />
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
          style={{ backgroundColor: `${album.color}CC` }}
        >
          {album.year}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-xl font-bold">{album.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{album.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {album.hits.map((hit) => (
            <span key={hit} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
              <Music2 className="h-3 w-3" /> {hit}
            </span>
          ))}
        </div>
        <div className="mt-auto flex gap-2 pt-4">
          <a
            href={album.spotify_url}
            target="_blank"
            rel="noreferrer"
            data-testid={`album-spotify-${album.id}`}
            className="flex-1"
          >
            <Button size="sm" className="w-full">
              Spotify
            </Button>
          </a>
          <a
            href={album.youtube_url}
            target="_blank"
            rel="noreferrer"
            data-testid={`album-youtube-${album.id}`}
            className="flex-1"
          >
            <Button size="sm" variant="outline" className="w-full gap-1.5">
              <Youtube className="h-4 w-4" /> YouTube
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
}

function statusStyle(status: string): { color: string; bg: string } {
  if (status === "Esgotado") return { color: "#FF6B6B", bg: "rgba(255,107,107,0.12)" };
  if (status === "Últimos Ingressos") return { color: "#FFE299", bg: "rgba(212,175,55,0.12)" };
  return { color: "#4EBA6F", bg: "rgba(78,186,111,0.12)" };
}

function TourRow({ tour, index }: { tour: TourDate; index: number }) {
  const style = statusStyle(tour.status);
  return (
    <li
      className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4"
      data-testid={`tour-row-${index}`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <MapPin className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold" data-testid={`tour-city-${index}`}>
          {tour.city}
        </p>
        <p className="text-xs text-muted-foreground">
          {tour.venue} · {tour.date}
        </p>
      </div>
      <Badge variant="outline" style={{ color: style.color, borderColor: `${style.color}55`, backgroundColor: style.bg }}>
        {tour.status}
      </Badge>
      <Button
        size="sm"
        variant="outline"
        data-testid={`tour-buy-${index}`}
        disabled={tour.status === "Esgotado"}
        onClick={() => toast.info("Venda oficial em breve — link simulado nesta demo.")}
      >
        <Ticket className="h-4 w-4" /> Ingressos
      </Button>
    </li>
  );
}