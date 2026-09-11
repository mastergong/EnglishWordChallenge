import { describe, expect, it } from "vitest";
import { dailyHistoryFromGames, upsertDailyHistory } from "./dailyHistory";
import type { GameHistoryEntry } from "../types/statistics";

function play(id: string, date: string, score: number, correct = 8): GameHistoryEntry {
  return {
    id,
    completedAt: `${date}T12:00:00`,
    mode: "daily",
    level: "adaptive",
    score,
    accuracy: Math.round((correct / 10) * 100),
    correct,
    total: 10,
  };
}

describe("daily history", () => {
  it("keeps the best score per day and counts replays", () => {
    const history = dailyHistoryFromGames([
      play("2", "2026-09-11", 900, 9),
      play("1", "2026-09-11", 700, 7),
      play("0", "2026-09-10", 500, 5),
    ]);
    expect(history[0]?.date).toBe("2026-09-11");
    expect(history[0]?.bestScore).toBe(900);
    expect(history[0]?.plays).toBe(2);
    expect(history[1]?.date).toBe("2026-09-10");
  });

  it("updates last score when the same day is played again", () => {
    const next = upsertDailyHistory(
      [{ date: "2026-09-11", bestScore: 700, lastScore: 700, correct: 7, total: 10, accuracy: 70, plays: 1 }],
      { date: "2026-09-11", score: 850, correct: 9, total: 10, accuracy: 90 },
    );
    expect(next).toHaveLength(1);
    expect(next[0]?.bestScore).toBe(850);
    expect(next[0]?.lastScore).toBe(850);
    expect(next[0]?.plays).toBe(2);
  });
});
