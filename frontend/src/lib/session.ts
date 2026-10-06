// Session ownership: who am I (useMe), session begin (after login/register) and the
// one true sign-out (endSession) that clears the whole react-query cache.

import { useQuery } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";
import type { UserPublic } from "@/lib/types";

// Interface correspondente ao MeOut do backend
interface MeResponse {
  user: UserPublic | null;
  token: string | null;
}

export async function fetchMe(): Promise<UserPublic | null> {
  try {
    // Usamos apiGet e lemos a propriedade .user retornada pela rota /auth/me do backend
    const res = await apiGet<MeResponse>("/auth/me");
    return res.user ?? null;
  } catch {
    return null;
  }
}

export function useMe() {
  return useQuery({ queryKey: ["me"], queryFn: fetchMe, staleTime: 60_000, retry: false });
}

// Call after a successful login/register so every cached query re-reads as the new fan.
export async function beginSession(qc: QueryClient): Promise<void> {
  await qc.invalidateQueries();
}

// The ONLY way to sign out — clears the server session and wipes the client cache,
// so the next login on this browser can't see the previous account's data.
export async function endSession(qc: QueryClient): Promise<void> {
  try {
    await apiPost("/auth/logout", {});
  } catch {
    // Session may already be gone; the cache wipe below still guarantees a clean state.
  }
  qc.clear();
}