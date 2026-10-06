import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Heart, Pencil, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPatch } from "@/lib/api";
import { useMe } from "@/lib/session";
import { apiErrorMessage, eraDef, eraLabel, ERAS } from "@/lib/fan";
import type { ProfileOut } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { FanBadge } from "@/components/FanBadge";
import PostCard from "@/components/PostCard";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Profile() {
  const { username } = useParams<{ username?: string }>();
  const { data: me, isLoading: meLoading } = useMe();

  const effective = username ?? me?.username;
  const isOwn = Boolean(me && effective && me.username === effective);

  const userQ = useQuery({
    queryKey: ["user", effective],
    queryFn: () => apiGet<ProfileOut>(`/users/${effective}`),
    enabled: Boolean(effective && effective !== "undefined"),
  });

  if (!username && meLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground animate-pulse">A carregar perfil da matilha...</p>
      </div>
    );
  }

  if (!username && (me === null || me === undefined)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Card className="p-10 text-center" data-testid="profile-login-cta">
          <p className="font-heading text-lg font-semibold">Esse canto é dos logados.</p>
          <p className="mt-1 text-sm text-muted-foreground">Entre para ver e editar seu perfil de fã.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Link to="/login" data-testid="profile-login-link" className={buttonVariants()}>
              Entrar
            </Link>
            <Link to="/cadastro" data-testid="profile-join-link" className={buttonVariants("outline")}>
              Criar conta
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const data = userQ.data;

  return (
    <div className="pb-16">
      {/* Banner corrigido sem cortes */}
      <div className="relative h-48 w-full overflow-hidden sm:h-60 rounded-b-2xl" data-testid="profile-banner">
        {data?.user.banner_url ? (
          <img src={data.user.banner_url} alt="Banner do fã" className="h-full w-full object-cover" />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(120deg, ${eraDef(data?.user.favorite_era)?.color ?? "#8B263E"} 0%, #171012 90%)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D090A]/90 via-[#0D090A]/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-3xl px-4">
        <div className="-mt-12 flex flex-wrap items-end justify-between gap-3 relative z-10">
          <div className="flex items-end gap-3">
            <span className="rounded-full border-4 border-background bg-background shadow-md">
              <Avatar
                name={data?.user.name ?? me?.name ?? "Fã"}
                username={data?.user.username ?? me?.username ?? "fa"}
                avatar_url={data?.user.avatar_url ?? me?.avatar_url}
                size="lg"
              />
            </span>
            <div className="pb-1">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground" data-testid="profile-name">
                {data?.user.name ?? <span className="block h-7 w-40 animate-pulse rounded bg-muted" />}
              </h1>
              <p className="text-sm text-muted-foreground" data-testid="profile-username">
                {data ? `@${data.user.username}` : ""}
              </p>
            </div>
          </div>
          {isOwn && data && (
            <EditProfileDialog user={data.user} />
          )}
        </div>

        {data && (
          <div className="mt-4 flex flex-wrap items-center gap-2" data-testid="profile-badges">
            <FanBadge points={data.user.points} />
            <span
              className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
              style={{
                color: eraDef(data.user.favorite_era)?.color,
                borderColor: `${eraDef(data.user.favorite_era)?.color}55`,
                backgroundColor: `${eraDef(data.user.favorite_era)?.color}15`,
              }}
              data-testid="profile-era"
            >
              Era {eraLabel(data.user.favorite_era)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground bg-card">
              <Sparkles className="h-3 w-3 text-primary" /> {data.user.points} pontos
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground bg-card">
              <CalendarDays className="h-3 w-3" /> desde{" "}
              {new Date(data.user.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
            </span>
          </div>
        )}

        {data && (data.user.bio || data.user.quote) && (
          <Card className="mt-4 p-4 bg-card/50 backdrop-blur-sm border-border" data-testid="profile-about">
            {data.user.bio && <p className="text-sm leading-relaxed text-foreground/90">{data.user.bio}</p>}
            {data.user.quote && (
              <p className="mt-2 border-l-2 border-primary pl-3 font-heading text-sm italic text-primary/90">
                “{data.user.quote}”
              </p>
            )}
          </Card>
        )}

        {data && (
          <div className="mt-4 grid grid-cols-3 gap-3" data-testid="profile-stats">
            <StatBox label="Posts" value={String(data.posts.length)} />
            <StatBox
              label="Curtidas recebidas"
              value={String(data.posts.reduce((sum, p) => sum + p.like_count, 0))}
              icon={<Heart className="h-3.5 w-3.5 text-primary" />}
            />
            <StatBox label="Nível" value={data.user.level} />
          </div>
        )}

        <h2 className="mt-8 font-heading text-lg font-bold">Publicações</h2>
        <div className="mt-3 space-y-4 pb-10" data-testid="profile-posts">
          {userQ.isLoading ? (
            [0, 1].map((i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />)
          ) : data && data.posts.length > 0 ? (
            data.posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : data ? (
            <p className="text-sm text-muted-foreground">Nenhuma publicação ainda — o primeiro passo é no feed.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
      <p className="flex items-center justify-center gap-1 font-heading text-lg font-bold text-foreground" data-testid="profile-stat-value">
        {icon}
        {value}
      </p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function EditProfileDialog({ user }: { user: ProfileOut["user"] }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [quote, setQuote] = useState(user.quote);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url ?? "");
  const [bannerUrl, setBannerUrl] = useState(user.banner_url ?? "");
  const [era, setEra] = useState(user.favorite_era);

  const save = useMutation({
    mutationFn: () =>
      apiPatch("/users/me", {
        bio,
        quote,
        avatar_url: avatarUrl.trim() || null,
        banner_url: bannerUrl.trim() || null,
        favorite_era: era,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.invalidateQueries({ queryKey: ["user"] });
      qc.invalidateQueries({ queryKey: ["ranking"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
      setOpen(false);
      toast.success("Perfil atualizado!");
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        data-testid="profile-edit-button" 
        onClick={() => setOpen(!open)}
      >
        <Pencil className="h-4 w-4 mr-1.5" /> {open ? "Fechar edição" : "Editar perfil"}
      </Button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-border bg-card p-5 shadow-2xl text-card-foreground">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
            <div>
              <h3 className="font-heading text-lg font-bold">Editar perfil de fã</h3>
              <p className="text-xs text-muted-foreground">Personalize sua bio, frase, avatar, banner e era.</p>
            </div>
            <button 
              type="button" 
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>

          <form
            className="space-y-4 max-h-[65vh] overflow-y-auto pr-1"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="edit-bio" className="text-xs uppercase tracking-wider text-muted-foreground">Bio</Label>
              <Textarea
                id="edit-bio"
                data-testid="profile-edit-bio-input"
                maxLength={400}
                className="min-h-20 resize-none w-full bg-background border-border text-foreground focus:ring-primary"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-quote" className="text-xs uppercase tracking-wider text-muted-foreground">Frase/letra que define você</Label>
              <Input
                id="edit-quote"
                data-testid="profile-edit-quote-input"
                maxLength={140}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full bg-background border-border text-foreground focus:ring-primary"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-avatar" className="text-xs uppercase tracking-wider text-muted-foreground">URL do avatar</Label>
                <Input
                  id="edit-avatar"
                  data-testid="profile-edit-avatar-input"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-background border-border text-foreground focus:ring-primary text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-banner" className="text-xs uppercase tracking-wider text-muted-foreground">URL do banner</Label>
                <Input
                  id="edit-banner"
                  data-testid="profile-edit-banner-input"
                  placeholder="https://..."
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full bg-background border-border text-foreground focus:ring-primary text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-era" className="text-xs uppercase tracking-wider text-muted-foreground">Era favorita</Label>
              <select
                id="edit-era"
                data-testid="profile-edit-era-select"
                value={era}
                onChange={(e) => setEra(e.target.value)}
                className="w-full h-9 rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {ERAS.map((e) => (
                  <option key={e.id} value={e.id} className="bg-background text-foreground">
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full mt-2" data-testid="profile-edit-submit-button" disabled={save.isPending}>
              {save.isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}