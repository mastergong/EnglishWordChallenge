import { generateDailyQuestions } from "../utils/questionGenerator";
import { localDateKey } from "../utils/random";
import { loadDailyChallenge, loadDailyStreak, saveDailyChallenge, saveDailyStreak } from "../utils/storage";
import { daysBetween } from "../utils/random";
import { loadWords } from "../utils/loadWords";

export function useDailyChallenge() {
  const date = localDateKey();
  const words = loadWords();
  const questions = generateDailyQuestions(words, date, 10);
  const state = loadDailyChallenge();
  const todayState = state?.date === date ? state : { date, completed: false, bestScore: 0, lastScore: 0 };
  const streak = loadDailyStreak();

  function complete(score: number) {
    const bestScore = Math.max(todayState.bestScore, score);
    saveDailyChallenge({
      date,
      completed: true,
      bestScore,
      lastScore: score,
    });
    const previous = loadDailyStreak();
    if (previous.lastCompletedDate === date) {
      return { ...previous, bestScore };
    }
    const gap = previous.lastCompletedDate ? daysBetween(previous.lastCompletedDate, date) : 1;
    const current = gap === 1 ? previous.current + 1 : 1;
    const next = {
      current,
      lastCompletedDate: date,
      longest: Math.max(previous.longest, current),
    };
    saveDailyStreak(next);
    return next;
  }

  return { date, questions, todayState, streak, complete };
}
