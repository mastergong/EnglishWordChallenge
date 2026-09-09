import { describe, expect, it } from "vitest";
import { isLevelUnlocked, playStatsFromHistory, emptyLevelPlayStats, UNLOCK_MIN_ANSWERS } from "./levels";
import type { GameHistoryEntry } from "../types/statistics";

function entry(level: string, mode: string, correct: number, total: number): GameHistoryEntry {
  return { id: `${level}-${mode}-${total}`, completedAt: "", mode, level, score: 0, accuracy: 0, correct, total };
}

describe("playStatsFromHistory", () => {
  it("counts classic A1 games and ignores daily/adaptive", () => {
    const stats = playStatsFromHistory([
      entry("A1", "classic", 10, 10),
      entry("A1", "classic", 9, 10),
      entry("A2", "daily", 10, 10),
      entry("adaptive", "adaptive", 9, 10),
      entry("C1", "daily", 10, 10),
    ]);
    expect(stats.A1).toEqual({ correct: 19, total: 20, accuracy: 95 });
    expect(stats.A2.total).toBe(0);
    expect(stats.C1.total).toBe(0);
  });
});

describe("isLevelUnlocked", () => {
  it("always allows A1", () => {
    expect(isLevelUnlocked("A1", emptyLevelPlayStats(), true)).toBe(true);
  });

  it("keeps A2 locked until A1 has enough accurate answers", () => {
    const none = emptyLevelPlayStats();
    expect(isLevelUnlocked("A2", none, true)).toBe(false);
    none.A1 = { correct: 6, total: 10, accuracy: 60 };
    expect(isLevelUnlocked("A2", none, true)).toBe(false);
    none.A1 = { correct: 9, total: 10, accuracy: 90 };
    expect(isLevelUnlocked("A2", none, true)).toBe(true);
  });

  it("does not unlock B1 from mixed high-level answers if A2 is still locked", () => {
    const stats = emptyLevelPlayStats();
    stats.A1 = { correct: 10, total: 10, accuracy: 100 };
    stats.B1 = { correct: 10, total: 10, accuracy: 100 };
    stats.C1 = { correct: 10, total: 10, accuracy: 100 };
    expect(isLevelUnlocked("A2", stats, true)).toBe(true);
    expect(isLevelUnlocked("B1", stats, true)).toBe(false);
    expect(isLevelUnlocked("C1", stats, true)).toBe(false);
    stats.A2 = { correct: 8, total: 10, accuracy: 80 };
    expect(isLevelUnlocked("B1", stats, true)).toBe(true);
  });

  it("unlocks everything when lock is off", () => {
    expect(isLevelUnlocked("C2", emptyLevelPlayStats(), false)).toBe(true);
  });

  it("requires at least 10 answers at the previous level", () => {
    const stats = emptyLevelPlayStats();
    stats.A1 = { correct: 5, total: 5, accuracy: 100 };
    expect(UNLOCK_MIN_ANSWERS).toBe(10);
    expect(isLevelUnlocked("A2", stats, true)).toBe(false);
  });
});
