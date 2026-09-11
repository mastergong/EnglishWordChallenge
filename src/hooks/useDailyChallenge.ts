import { generateDailyQuestions } from "../utils/questionGenerator";
import { localDateKey } from "../utils/random";
import {
  loadDailyChallenge,
  loadDailyHistory,
  loadDailyStreak,
  saveDailyChallenge,
  saveDailyHistory,
  saveDailyStreak,
} from "../utils/storage";
import { daysBetween } from "../utils/random";
import { loadWords } from "../utils/loadWords";
import { upsertDailyHistory } from "../utils/dailyHistory";

export function useDailyChallenge() {
  const date = localDateKey();
  const words = loadWords();
  const questions = generateDailyQuestions(words, date, 10);
  const state = loadDailyChallenge();
  const todayState = state?.date === date ? state : { date, completed: false, bestScore: 0, lastScore: 0 };
  const streak = loadDailyStreak();
  const history = loadDailyHistory();

  function complete(play: { score: number; correct: number; total: number; accuracy: number }) {
    const bestScore = Math.max(todayState.bestScore, play.score);
    saveDailyChallenge({
      date,
      completed: true,
      bestScore,
      lastScore: play.score,
    });
    saveDailyHistory(
      upsertDailyHistory(loadDailyHistory(), {
        date,
        score: play.score,
        correct: play.correct,
        total: play.total,
        accuracy: play.accuracy,
      }),
    );
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

  return { date, questions, todayState, streak, history, complete };
}
