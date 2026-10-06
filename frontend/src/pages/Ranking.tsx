import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Crown } from "lucide-react";
import { apiGet } from "@/lib/api";
import { eraDef } from "@/lib/fan";
import type { UserPublic } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { FanBadge } from "@/components/FanBadge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Ranking() {
  const rankingQ = useQuery({
    queryKey: ["ranking"],
    queryFn: () => apiGet<UserPublic[]>("/users/ranking"),
  });

  const fans = rankingQ.data ?? [];
  const podium = [fans[1], fans[0], fans[2]].filter(Boolean) as UserPublic[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight">Ranking da Matilha</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Posts valem +10, comentários +5, curtidas +2 e mensagens no chat +1. Suba de nível:
        Filhote de Lobo → Anti-Herói → Tripulante Pirata → Super Fã → Lobo Alpha.
      </p>

      {/* Podium */}
      <div className="mt-8 grid grid-cols-3 items-end gap-3" data-testid="ranking-podium">
        {rankingQ.isLoading ? (
          [0, 1, 2].map((i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />)
        ) : podium.length === 0 ? (
          <p className="col-span-3 text-sm text-muted-foreground">Ainda sem fãs pontuando.</p>
        ) : (
          podium.map((fan) => {
            const rank = fans.findIndex((f) => f.id === fan.id) + 1;
            const heights = ["h-32", "h-44", "h-28"];
            return (
              <div key={fan.id} className="flex flex-col items-center gap-2">
                {rank === 1 && <Crown className="h-5 w-5 text-[#D4AF37]" />}
                <Link to={`/perfil/${fan.username}`} data-testid={`podium-fan-${rank}`}>
                  <Avatar name={fan.name} username={fan.username} avatar_url={fan.avatar_url} size={rank === 1 ? "lg" : "md"} />
                </Link>
                <p className="max-w-full truncate text-sm font-semibold">{fan.name}</p>
                <FanBadge points={fan.points} />
                <div
                  className={`flex w-full ${heights[rank === 1 ? 1 : rank === 2 ? 0 : 2]} items-start justify-center rounded-t-xl border border-border bg-card p-3`}
                  style={{ opacity: rank === 1 ? 1 : 0.75 }}
                >
                  <span className="font-heading text-2xl font-bold text-primary">{rank}º</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Full table */}
      <Card className="mt-10 p-2" data-testid="ranking-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">#</TableHead>
              <TableHead>Fã</TableHead>
              <TableHead className="hidden sm:table-cell">Era favorita</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead className="text-right">Pontos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fans.map((fan, i) => (
              <TableRow key={fan.id} data-testid={`ranking-row-${fan.username}`}>
                <TableCell className="font-heading font-bold">{i + 1}º</TableCell>
                <TableCell>
                  <Link to={`/perfil/${fan.username}`} className="flex items-center gap-2.5 hover:text-primary">
                    <Avatar name={fan.name} username={fan.username} avatar_url={fan.avatar_url} size="xs" />
                    <span>
                      <span className="block text-sm font-medium">{fan.name}</span>
                      <span className="block text-xs text-muted-foreground">@{fan.username}</span>
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span
                    className="rounded-full border px-2 py-0.5 text-xs"
                    style={{
                      color: eraDef(fan.favorite_era)?.color,
                      borderColor: `${eraDef(fan.favorite_era)?.color}55`,
                    }}
                  >
                    {eraDef(fan.favorite_era)?.label ?? "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <FanBadge points={fan.points} />
                </TableCell>
                <TableCell className="text-right font-semibold" data-testid={`ranking-points-${fan.username}`}>
                  {fan.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}