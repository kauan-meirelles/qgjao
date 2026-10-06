import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  LogOut,
  MessageCircle,
  MessagesSquare,
  MicVocal,
  Newspaper,
  Star,
  Trophy,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { useMe, endSession } from "@/lib/session";
import { buttonVariants } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Feed", icon: Newspaper, testid: "nav-link-feed", end: true },
  { to: "/artista", label: "Artista", icon: MicVocal, testid: "nav-link-artista", end: false },
  { to: "/forum", label: "Fórum", icon: MessagesSquare, testid: "nav-link-forum", end: false },
  { to: "/ranking", label: "Ranking", icon: Trophy, testid: "nav-link-ranking", end: false },
  { to: "/chat", label: "Chat", icon: MessageCircle, testid: "nav-link-chat", end: false },
];

const MOBILE_NAV = [
  ...NAV,
];

function navClass(isActive: boolean): string {
  return cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-primary/15 text-primary"
      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  );
}

export default function AppShell() {
  const { data: me } = useMe();
  const qc = useQueryClient();
  const navigate = useNavigate();

  async function handleLogout() {
    await endSession(qc);
    toast.success("Até já — a matilha sente sua falta.");
    navigate("/");
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div aria-hidden className="film-grain" />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-sidebar px-3 py-5 lg:flex">
        <Link
          to="/"
          data-testid="sidebar-logo-link"
          className="mb-8 flex items-center gap-2 px-2"
        >
          <Star className="h-5 w-5 fill-primary text-primary" />
          <span className="font-heading text-xl font-bold tracking-tight">QG Jão</span>
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, testid, end }) => (
            <NavLink key={to} to={to} end={end} data-testid={testid} className={({ isActive }) => navClass(isActive)}>
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          {me?.username && (
            <NavLink
              to={`/perfil/${me.username}`}
              data-testid="nav-link-perfil"
              className={({ isActive }) => navClass(isActive)}
            >
              <UserRound className="h-4 w-4" />
              Meu Perfil
            </NavLink>
          )}
        </nav>

        <div className="mt-auto">
          {me ? (
            <div className="rounded-xl border border-border bg-card p-3" data-testid="sidebar-user-card">
              <div className="flex items-center gap-2">
                <Avatar name={me.name} username={me.username} avatar_url={me.avatar_url} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{me.name}</p>
                  <p className="truncate text-xs text-muted-foreground">@{me.username}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {me.points} pts · <span className="font-medium text-primary">{me.level}</span>
              </p>
              <button
                data-testid="sidebar-logout-button"
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" /> Sair da conta
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-3" data-testid="sidebar-guest-card">
              <p className="text-sm font-semibold">Faça parte da matilha</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Crie sua conta de fã, poste e pontue no ranking.
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <Link to="/cadastro" data-testid="sidebar-join-link" className={buttonVariants({ size: "sm" })}>
                  Criar conta
                </Link>
                <Link to="/login" data-testid="sidebar-login-link" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  Entrar
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar (glass) */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/85 px-4 py-2.5 backdrop-blur-xl lg:hidden">
        <Link to="/" data-testid="mobile-logo-link" className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-primary text-primary" />
          <span className="font-heading text-lg font-bold tracking-tight">QG Jão</span>
        </Link>
        {me ? (
          <div className="flex items-center gap-2">
            <span data-testid="header-points-badge" className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              {me.points} pts
            </span>
            <Link to={`/perfil/${me.username}`} data-testid="header-avatar-link">
              <Avatar name={me.name} username={me.username} avatar_url={me.avatar_url} size="sm" />
            </Link>
          </div>
        ) : (
          <Link to="/login" data-testid="mobile-login-link" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Entrar
          </Link>
        )}
      </header>

      <main className="pb-24 lg:pb-10 lg:pl-60">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-border bg-background/95 py-1.5 backdrop-blur-xl lg:hidden">
        {MOBILE_NAV.map(({ to, label, icon: Icon, testid, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            data-testid={testid}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
          </NavLink>
        ))}
        {me?.username && (
          <NavLink
            to={`/perfil/${me.username}`}
            data-testid="nav-link-perfil-mobile"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <UserRound className="h-4.5 w-4.5" />
            Perfil
          </NavLink>
        )}
      </nav>
    </div>
  );
}