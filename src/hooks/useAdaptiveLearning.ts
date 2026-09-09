import { loadWordProgress } from "../utils/storage";
import { loadWords } from "../utils/loadWords";
import { generateQuestions } from "../utils/questionGenerator";
import type { CEFRLevel } from "../types/word";

export function useAdaptiveLearning() {
  const words = loadWords();
  const progress = loadWordProgress();

  function nextSet(count: number, level?: CEFRLevel | "adaptive") {
    return generateQuestions({
      words,
      count,
      level,
      progress,
      adaptive: true,
      preferWeak: true,
    });
  }

  return { nextSet, progress };
}
