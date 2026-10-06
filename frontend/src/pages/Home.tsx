import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Flame, Trophy } from "lucide-react";
import { apiGet } from "@/lib/api";
import { useMe } from "@/lib/session";
import {eraDef, ERAS } from "@/lib/fan";
import { cn } from "@/lib/utils";
import type { ArtistData, Post, UserPublic } from "@/lib/types";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const HERO_PHOTO =
  "https://customer-assets-jai6qajn.emergentagent.net/job_da37de10-00f3-470b-9da9-c7c5eec4413e/artifacts/gyzhu123_IMG_1505.jpeg";

const TRENDING = ["#MemóriasPóstumas", "#Supernova", "#SuperTurnê", "#Catedral", "#MeLambe", "#MatilhaDoJão", "#AllianzEmOutubro"];
function chipClass(active: boolean): string {
  return cn(
    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-primary bg-primary/15 text-primary"
      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
  );
}

export default function Feed() {
  const { data: me } = useMe();
  const [era, setEra] = useState<string | null>(null);

  const postsQ = useQuery({
    queryKey: ["posts", era],
    queryFn: () => apiGet<Post[]>(era ? `/posts?era=${era}` : "/posts"),
  });
  const rankingQ = useQuery({
    queryKey: ["ranking"],
    queryFn: () => apiGet<UserPublic[]>("/users/ranking"),
  });
  const artistQ = useQuery({
    queryKey: ["artist"],
    queryFn: () => apiGet<ArtistData>("/artist"),
  });

  return (
    <div>
      {me === null && <GuestHero />}

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            <PostComposer />

            <div className="flex flex-wrap gap-2" data-testid="era-filter">
              <button
                type="button"
                data-testid="era-filter-all"
                onClick={() => setEra(null)}
                className={chipClass(era === null)}
              >
                Todas as eras
              </button>
              {ERAS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  data-testid={`era-filter-${e.id}`}
                  onClick={() => setEra(e.id)}
                  className={chipClass(era === e.id)}
                  style={era === e.id ? { borderColor: e.color, color: e.color } : undefined}
                >
                  {e.label}
                </button>
              ))}
            </div>

            {postsQ.isError && !postsQ.data ? (
              <Card className="p-6 text-sm text-muted-foreground">
                Não deu para carregar o feed agora.{" "}
                <button
                  type="button"
                  data-testid="feed-retry-button"
                  onClick={() => postsQ.refetch()}
                  className="text-primary underline"
                >
                  Tentar de novo
                </button>
                .
              </Card>
            ) : postsQ.isLoading ? (
              <div className="space-y-4" data-testid="feed-loading">
                {[0, 1, 2].map((i) => (
                  <Card key={i} className="space-y-3 p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                        <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                  </Card>
                ))}
              </div>
            ) : !postsQ.data || postsQ.data.length === 0 ? (
              <Card className="p-10 text-center" data-testid="feed-empty">
                <p className="font-heading text-lg font-semibold">Nenhum uivo por aqui ainda</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {era ? `Ainda não há posts na era ${eraDef(era)?.label ?? era}.` : "Seja o primeiro a publicar."}
                </p>
              </Card>
            ) : (
              postsQ.data.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>

          <aside className="hidden space-y-4 xl:block">
            <Card className="p-4" data-testid="home-top-fans">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Trophy className="h-4 w-4 text-[#D4AF37]" /> Top fãs da matilha
              </h3>
              <ol className="mt-3 space-y-2.5">
                {(rankingQ.data ?? []).slice(0, 5).map((fan, i) => (
                  <li key={fan.id} className="flex items-center gap-2.5">
                    <span className="w-4 text-center font-heading text-sm font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <Avatar name={fan.name} username={fan.username} avatar_url={fan.avatar_url} size="xs" />
                    <Link to={`/perfil/${fan.username}`} className="min-w-0 flex-1 truncate text-sm hover:text-primary">
                      {fan.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">{fan.points} pts</span>
                  </li>
                ))}
              </ol>
              <Link to="/ranking" data-testid="home-ranking-link" className="mt-3 inline-block text-xs text-primary hover:underline">
                ver ranking completo
              </Link>
            </Card>

            <Card className="p-4" data-testid="home-next-shows">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className="h-4 w-4 text-primary" /> Próximos shows
              </h3>
              <ul className="mt-3 space-y-3">
                {(artistQ.data?.tours ?? []).slice(0, 3).map((tour, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-medium">{tour.city}</p>
                    <p className="text-xs text-muted-foreground">
                      {tour.venue} · {tour.date}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                      {tour.status}
                    </p>
                  </li>
                ))}
              </ul>
              <Link to="/artista" data-testid="home-artist-link" className="mt-3 inline-block text-xs text-primary hover:underline">
                ver agenda completa
              </Link>
            </Card>

            <Card className="p-4" data-testid="home-trending">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Flame className="h-4 w-4 text-primary" /> Em alta na matilha
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {TRENDING.map((tag) => (
                  <span key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

function GuestHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border" data-testid="guest-hero">
      <img
        src={HERO_PHOTO}
        alt="Jão na era Super, correndo em um campo com a estrela vermelha no jeans"
        className="h-[460px] w-full object-cover object-top sm:h-[500px]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,9,10,0.30) 0%, rgba(13,9,10,0.72) 55%, #0D090A 100%)",
        }}
      />
      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-6xl px-4 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7B7B]">
            A rede social da matilha
          </p>
          <h1 className="mt-3 max-w-xl font-heading text-4xl font-bold leading-tight text-[#FFF9F5] sm:text-5xl">
            Aqui, o show nunca acaba: bem-vindo ao QG Jão.
          </h1>
          <p className="mt-3 max-w-lg text-sm text-[#D6C7CA] sm:text-base">
            Feed, fórum, chat, ranking de fãs e o acervo completo do Jão em um só lugar — feito por
            fãs, para fãs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/cadastro" data-testid="hero-join-link" className={buttonVariants({ size: "lg" })}>
              Entrar na matilha
            </Link>
            <Link
              to="/login"
              data-testid="hero-login-link"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Já sou fã
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}