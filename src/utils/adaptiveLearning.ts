import type { WordProgress } from "../types/statistics";

export type MasteryBand = "veryWeak" | "weak" | "learning" | "good" | "mastered";

export function masteryBand(mastery: number): MasteryBand {
  if (mastery <= 30) return "veryWeak";
  if (mastery <= 50) return "weak";
  if (mastery <= 70) return "learning";
  if (mastery <= 85) return "good";
  return "mastered";
}

export function calcMastery(progress: Pick<
  WordProgress,
  "seenCount" | "correctCount" | "wrongCount" | "averageResponseTime" | "consecutiveCorrect"
>): number {
  const seen = Math.max(progress.seenCount, 1);
  const correctRate = progress.correctCount / seen;
  const recent = Math.min(1, progress.consecutiveCorrect / 5);
  const speed = Math.max(0, 1 - progress.averageResponseTime / 8000);
  const reviews = Math.min(1, progress.consecutiveCorrect / 4);
  const penalty = Math.min(0.4, progress.wrongCount * 0.06);
  const raw = (correctRate * 45 + recent * 25 + speed * 15 + reviews * 15) * (1 - penalty);
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function selectionWeight(progress?: WordProgress, adaptive = true): number {
  if (!adaptive || !progress) return 1;
  const weakBoost = progress.mastery <= 50 ? 3 : progress.mastery <= 70 ? 1.6 : 0.7;
  const dueBoost =
    progress.nextReview && new Date(progress.nextReview).getTime() <= Date.now() ? 2.2 : 1;
  const unseenBoost = progress.seenCount === 0 ? 1.4 : 1;
  return weakBoost * dueBoost * unseenBoost;
}

export function applyAnswerToProgress(
  existing: WordProgress | undefined,
  wordId: number,
  correct: boolean,
  timeMs: number,
  nextReview: string,
): WordProgress {
  const now = new Date().toISOString();
  const prev: WordProgress = existing ?? {
    wordId,
    seenCount: 0,
    correctCount: 0,
    wrongCount: 0,
    lastSeen: null,
    lastCorrect: null,
    lastWrong: null,
    averageResponseTime: 0,
    mastery: 0,
    nextReview: null,
    consecutiveCorrect: 0,
  };

  const seenCount = prev.seenCount + 1;
  const averageResponseTime = Math.round(
    (prev.averageResponseTime * prev.seenCount + timeMs) / seenCount,
  );
  const consecutiveCorrect = correct ? prev.consecutiveCorrect + 1 : 0;
  const updated: WordProgress = {
    ...prev,
    seenCount,
    correctCount: prev.correctCount + (correct ? 1 : 0),
    wrongCount: prev.wrongCount + (correct ? 0 : 1),
    lastSeen: now,
    lastCorrect: correct ? now : prev.lastCorrect,
    lastWrong: correct ? prev.lastWrong : now,
    averageResponseTime,
    consecutiveCorrect,
    nextReview,
    mastery: 0,
  };
  updated.mastery = calcMastery(updated);
  return updated;
}
