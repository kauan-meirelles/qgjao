import { Badge } from "@/components/ui/badge";
import { fanLevel } from "@/lib/fan";
import { cn } from "@/lib/utils";

// Fan level badge (Filhote de Lobo -> Lobo Alpha), tinted by tier color.
export function FanBadge({ points, className }: { points: number; className?: string }) {
  const level = fanLevel(points);
  return (
    <Badge
      variant="outline"
      data-testid={`fan-badge-${level.label.toLowerCase().replace(/\s+/g, "-")}`}
      className={cn("font-medium", className)}
      style={{ color: level.color, borderColor: `${level.color}55`, backgroundColor: `${level.color}14` }}
    >
      {level.label}
    </Badge>
  );
}