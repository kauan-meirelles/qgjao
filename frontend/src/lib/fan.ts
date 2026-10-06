// Shared fan-club domain constants + tiny formatting helpers.

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface EraDef {
  id: string;
  label: string;
  year: string;
  color: string;
}

export const ERAS: EraDef[] = [
  { id: "lobos", label: "Lobos", year: "2018", color: "#8B263E" },
  { id: "anti-heroi", label: "Anti-Herói", year: "2019", color: "#B22222" },
  { id: "pirata", label: "Pirata", year: "2021", color: "#1A5276" },
  { id: "super", label: "Super", year: "2023", color: "#C0392B" },
  { id: "supernova", label: "Supernova", year: "2025", color: "#39417C" },
  { id: "memorias-postumas", label: "Memórias Póstumas", year: "2026", color: "#4A1521" },
];

export function eraDef(id: string | null | undefined): EraDef | undefined {
  return ERAS.find((e) => e.id === id);
}

export function eraLabel(id: string | null | undefined): string {
  const era = eraDef(id);
  return era ? era.label : "Sem era";
}

export function eraOrNone(v: string | null | undefined): string {
  if (!v || v === "none") return "Sem era";
  return eraLabel(v);
}

export interface LevelDef {
  min: number;
  label: string;
  color: string;
}

export const LEVELS: LevelDef[] = [
  { min: 1500, label: "Lobo Alpha", color: "#D4AF37" },
  { min: 700, label: "Super Fã", color: "#E24A4A" },
  { min: 300, label: "Tripulante Pirata", color: "#3E7CA8" },
  { min: 100, label: "Anti-Herói", color: "#C05A72" },
  { min: 0, label: "Filhote de Lobo", color: "#9B8B8E" },
];

export function fanLevel(points: number): LevelDef {
  return LEVELS.find((l) => points >= l.min) ?? LEVELS[LEVELS.length - 1];
}

export const CATEGORIES = [
  { id: "geral", label: "Geral" },
  { id: "albuns", label: "Álbuns & Músicas" },
  { id: "shows", label: "Shows & Turnês" },
  { id: "letras", label: "Letras & Teorias" },
  { id: "ingressos", label: "Troca de Ingressos" },
];

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export const CHANNELS = [
  { id: "geral", label: "geral", description: "Papo livre da matilha" },
  { id: "memorias-postumas", label: "memorias-postumas", description: "A era nova, faixa a faixa" },
  { id: "turnes-e-caravanas", label: "turnes-e-caravanas", description: "Ingressos, encontros e caronas" },
  { id: "letras-e-teorias", label: "letras-e-teorias", description: "Versos, clipes e teorias" },
];

export const EMOTIONS = ["Saudade", "Amor Intenso", "Deboche/Coringa", "Superação", "Melancolia"];

export function timeAgo(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR });
  } catch {
    return "agora";
  }
}

export function apiErrorMessage(err: unknown): string {
  const errorObj = err as Record<string, any> | null;
  
  if (errorObj) {
    const detail = errorObj.body?.detail || errorObj.detail;
    if (typeof detail === "string") return detail;
    
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: string };
      return first?.msg ? `Dados inválidos: ${first.msg}` : "Dados inválidos.";
    }
    
    if (errorObj.status === 401) return "Entre com sua conta para continuar.";
    if (errorObj.status === 403) return "Essa ação não é sua pra fazer.";
    if (errorObj.status >= 500) return "O palco pegou fogo por aqui. Tente de novo em instantes.";
  }
  
  return "Sem conexão com o palco. Tente novamente.";
}