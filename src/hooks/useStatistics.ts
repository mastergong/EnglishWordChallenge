import { useMemo } from "react";
import type { CEFRLevel } from "../types/word";
import { loadStatistics, loadWordProgress } from "../utils/storage";
import { loadWords } from "../utils/loadWords";
import { CEFR_LEVELS } from "../types/word";

export function useStatistics() {
  const stats = loadStatistics();
  const progress = loadWordProgress();
  const words = useMemo(() => loadWords(), []);

  const accuracy = stats.totalQuestions
    ? Math.round((stats.correct / stats.totalQuestions) * 100)
    : 0;

  const cefrProgress = CEFR_LEVELS.reduce(
    (acc, level) => {
      const levelWords = words.filter((word) => word.level === level);
      const seen = levelWords.filter((word) => progress[String(word.id)]?.seenCount);
      const correctish = seen.filter((word) => (progress[String(word.id)]?.mastery ?? 0) >= 70);
      acc[level] = levelWords.length
        ? Math.round((correctish.length / levelWords.length) * 100)
        : 0;
      return acc;
    },
    {} as Record<CEFRLevel, number>,
  );

  const accuracyByLevel = CEFR_LEVELS.reduce(
    (acc, level) => {
      const levelWords = words.filter((word) => word.level === level);
      let seen = 0;
      let correct = 0;
      for (const word of levelWords) {
        const item = progress[String(word.id)];
        if (!item?.seenCount) continue;
        seen += item.seenCount;
        correct += item.correctCount;
      }
      acc[level] = seen ? Math.round((correct / seen) * 100) : 0;
      return acc;
    },
    {} as Record<CEFRLevel, number>,
  );

  const weakWords = words
    .map((word) => ({ word, progress: progress[String(word.id)] }))
    .filter((item) => (item.progress?.wrongCount ?? 0) >= 2)
    .sort((a, b) => (b.progress?.wrongCount ?? 0) - (a.progress?.wrongCount ?? 0));

  const strongWords = words
    .map((word) => ({ word, progress: progress[String(word.id)] }))
    .filter((item) => (item.progress?.mastery ?? 0) >= 86)
    .sort((a, b) => (b.progress?.mastery ?? 0) - (a.progress?.mastery ?? 0));

  return { stats, progress, accuracy, cefrProgress, accuracyByLevel, weakWords, strongWords, words };
}
