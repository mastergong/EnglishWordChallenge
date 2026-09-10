import type { WordProgress } from "../types/statistics";

const INTERVALS_MS = [
  10 * 60 * 1000,
  1 * 24 * 60 * 60 * 1000,
  3 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
  14 * 24 * 60 * 60 * 1000,
  30 * 24 * 60 * 60 * 1000,
];

export function nextReviewAfterAnswer(
  consecutiveCorrect: number,
  correct: boolean,
  now = Date.now(),
): string {
  if (!correct) {
    return new Date(now + INTERVALS_MS[0]).toISOString();
  }
  const index = Math.min(consecutiveCorrect, INTERVALS_MS.length - 1);
  return new Date(now + INTERVALS_MS[index]).toISOString();
}

export function isDueForReview(progress: WordProgress | undefined, now = Date.now()): boolean {
  if (!progress?.nextReview) return false;
  return new Date(progress.nextReview).getTime() <= now;
}

export function dueWords<T extends { id: number }>(
  words: T[],
  progress: Record<string, WordProgress>,
  now = Date.now(),
): T[] {
  return words.filter((word) => isDueForReview(progress[String(word.id)], now));
}
