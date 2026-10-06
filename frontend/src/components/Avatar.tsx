import { cn } from "@/lib/utils";

const PALETTE = ["#C41E3A", "#8B263E", "#1A5276", "#D4AF37", "#4EBA6F", "#B22222"];

const SIZES = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
} as const;

function hueFor(username: string): string {
  let hash = 0;
  for (const ch of username) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return PALETTE[hash % PALETTE.length];
}

interface AvatarProps {
  name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}

export function Avatar({ name, username, avatar_url, size = "md", className }: AvatarProps) {
  const safeUsername = username || "fa";
  const safeName = name || safeUsername;

  const initials = safeName
    .replace(/^@/, "")
    .split(/[\s_]+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "Q";

  return (
    <span
      data-testid={`avatar-${safeUsername}`}
      className={cn(
        "inline-flex select-none items-center justify-center overflow-hidden rounded-full border border-border font-heading font-semibold text-white",
        SIZES[size],
        className,
      )}
      style={{ background: `linear-gradient(135deg, ${hueFor(safeUsername)}, #2E2024)` }}
    >
      {avatar_url ? (
        <img src={avatar_url} alt={safeName} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}