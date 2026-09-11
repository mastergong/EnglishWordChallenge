import type { DailyHistoryEntry, GameHistoryEntry } from "../types/statistics";
import { localDateKey } from "./random";

export function formatDailyDate(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;
  return date.toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short" });
}

export function dateKeyFromIso(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return localDateKey(date);
}

export function dailyHistoryFromGames(history: GameHistoryEntry[]): DailyHistoryEntry[] {
  const byDate = new Map<string, DailyHistoryEntry>();
  for (const item of history) {
    if (item.mode !== "daily") continue;
    const date = dateKeyFromIso(item.completedAt);
    const prev = byDate.get(date);
    if (!prev) {
      byDate.set(date, {
        date,
        bestScore: item.score,
        lastScore: item.score,
        correct: item.correct,
        total: item.total,
        accuracy: item.accuracy,
        plays: 1,
      });
      continue;
    }
    byDate.set(date, {
      ...prev,
      bestScore: Math.max(prev.bestScore, item.score),
      plays: prev.plays + 1,
    });
  }
  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export function upsertDailyHistory(
  history: DailyHistoryEntry[],
  play: { date: string; score: number; correct: number; total: number; accuracy: number },
): DailyHistoryEntry[] {
  const prev = history.find((item) => item.date === play.date);
  const next: DailyHistoryEntry = {
    date: play.date,
    bestScore: Math.max(prev?.bestScore ?? 0, play.score),
    lastScore: play.score,
    correct: play.correct,
    total: play.total,
    accuracy: play.accuracy,
    plays: (prev?.plays ?? 0) + 1,
  };
  return [next, ...history.filter((item) => item.date !== play.date)]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 60);
}
