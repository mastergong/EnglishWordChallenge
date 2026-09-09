import type { CEFRLevel } from "../types/word";
import { CEFR_LEVELS } from "../types/word";
import type { GameHistoryEntry } from "../types/statistics";

export const UNLOCK_THRESHOLDS: Record<CEFRLevel, number> = {
  A1: 0,
  A2: 70,
  B1: 75,
  B2: 80,
  C1: 80,
  C2: 80,
};

/** Need at least one full daily-sized set at the previous level before unlocking the next. */
export const UNLOCK_MIN_ANSWERS = 10;

const ORDER: CEFRLevel[] = [...CEFR_LEVELS];

export type LevelPlayStat = {
  correct: number;
  total: number;
  accuracy: number;
};

export function emptyLevelPlayStats(): Record<CEFRLevel, LevelPlayStat> {
  return {
    A1: { correct: 0, total: 0, accuracy: 0 },
    A2: { correct: 0, total: 0, accuracy: 0 },
    B1: { correct: 0, total: 0, accuracy: 0 },
    B2: { correct: 0, total: 0, accuracy: 0 },
    C1: { correct: 0, total: 0, accuracy: 0 },
    C2: { correct: 0, total: 0, accuracy: 0 },
  };
}

function isCefrLevel(value: string): value is CEFRLevel {
  return (CEFR_LEVELS as string[]).includes(value);
}

/** Accuracy from games played at that CEFR level. Daily / Adaptive do not count. */
export function playStatsFromHistory(history: GameHistoryEntry[]): Record<CEFRLevel, LevelPlayStat> {
  const stats = emptyLevelPlayStats();
  for (const item of history) {
    if (!isCefrLevel(item.level)) continue;
    if (item.mode === "daily" || item.mode === "adaptive") continue;
    stats[item.level].correct += item.correct;
    stats[item.level].total += item.total;
  }
  for (const level of CEFR_LEVELS) {
    const row = stats[level];
    row.accuracy = row.total ? Math.round((row.correct / row.total) * 100) : 0;
  }
  return stats;
}

export function isLevelUnlocked(
  level: CEFRLevel,
  playByLevel: Record<CEFRLevel, LevelPlayStat>,
  lockEnabled: boolean,
): boolean {
  if (!lockEnabled) return true;
  if (level === "A1") return true;
  const index = ORDER.indexOf(level);
  const previous = ORDER[index - 1];
  if (!previous) return true;
  if (!isLevelUnlocked(previous, playByLevel, lockEnabled)) return false;
  const prevStat = playByLevel[previous];
  if (prevStat.total < UNLOCK_MIN_ANSWERS) return false;
  return prevStat.accuracy >= UNLOCK_THRESHOLDS[level];
}

export function levelMeta(level: CEFRLevel): { en: string; th: string } {
  const map: Record<CEFRLevel, { en: string; th: string }> = {
    A1: { en: "Beginner", th: "เริ่มต้น" },
    A2: { en: "Elementary", th: "พื้นฐาน" },
    B1: { en: "Intermediate", th: "สื่อสารได้" },
    B2: { en: "Upper Intermediate", th: "คล่องขึ้น" },
    C1: { en: "Advanced", th: "ระดับสูง" },
    C2: { en: "Proficiency", th: "ขั้นเชี่ยวชาญ" },
  };
  return map[level];
}
