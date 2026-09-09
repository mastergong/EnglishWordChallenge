import { useMemo, useState } from "react";
import type { GameMode, GameResult, QuestionResult, QuizQuestion } from "../types/game";
import type { CEFRLevel } from "../types/word";
import { generateQuestions } from "../utils/questionGenerator";
import { calcQuestionScore } from "../utils/scoring";
import { applyAnswerToProgress } from "../utils/adaptiveLearning";
import { nextReviewAfterAnswer } from "../utils/spacedRepetition";
import {
  loadSettings,
  loadStatistics,
  loadWordProgress,
  saveStatistics,
  saveWordProgress,
} from "../utils/storage";
import { loadWords } from "../utils/loadWords";
import { calcAccuracy } from "../utils/scoring";

export function useQuiz(options: {
  mode: GameMode;
  level: CEFRLevel | "adaptive";
  questions?: QuizQuestion[];
  preferWeak?: boolean;
}) {
  const settings = loadSettings();
  const words = loadWords();
  const questionCount =
    options.mode === "daily"
      ? 10
      : options.mode === "endless"
        ? Math.min(50, words.length)
        : settings.questionCount;

  const initialQuestions = useMemo(() => {
    if (options.questions) return options.questions;
    return generateQuestions({
      words,
      count: questionCount,
      level: options.level,
      progress: loadWordProgress(),
      adaptive: settings.adaptiveLearning || options.mode === "adaptive",
      preferWeak: options.preferWeak || options.mode === "adaptive",
    });
  }, [options.level, options.mode, options.preferWeak, options.questions, questionCount, words]);

  const [questions] = useState(initialQuestions);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [finished, setFinished] = useState(false);

  const current = questions[index] ?? null;
  const timed = options.mode !== "practice";
  const totalTimeMs =
    options.mode === "timeAttack" ? 60_000 : settings.questionTimeSec * 1000;

  function answer(choiceId: string | null, remainingMs: number, timeout = false) {
    if (!current || finished) return null;
    const selected = current.choices.find((choice) => choice.id === choiceId) ?? null;
    const correct = Boolean(selected?.isCorrect) && !timeout;
    const outcome = timeout ? "timeout" : correct ? "correct" : "wrong";
    const usedMs = Math.max(0, totalTimeMs - remainingMs);
    const scored = calcQuestionScore({
      correct,
      remainingMs,
      totalMs: totalTimeMs,
      streakBeforeAnswer: streak,
      timed: timed && options.mode !== "practice",
    });
    const nextStreak = correct ? streak + 1 : 0;
    const result: QuestionResult = {
      question: current,
      selectedChoiceId: choiceId,
      outcome,
      timeMs: usedMs,
      ...scored,
    };

    const progress = loadWordProgress();
    const prev = progress[String(current.wordId)];
    const consecutive = correct ? (prev?.consecutiveCorrect ?? 0) + 1 : 0;
    progress[String(current.wordId)] = applyAnswerToProgress(
      prev,
      current.wordId,
      correct,
      usedMs,
      nextReviewAfterAnswer(consecutive, correct),
    );
    saveWordProgress(progress);

    const nextResults = [...results, result];
    const nextScore = score + scored.points;
    const nextBest = Math.max(bestStreak, nextStreak);
    setResults(nextResults);
    setScore(nextScore);
    setStreak(nextStreak);
    setBestStreak(nextBest);

    const shouldEnd =
      options.mode === "endless"
        ? !correct
        : options.mode === "timeAttack" && timeout
          ? true
          : index + 1 >= questions.length;

    if (shouldEnd) {
      const summary = finishGame(nextResults, nextScore, nextBest, options.mode, options.level);
      setFinished(true);
      return { result, summary, done: true };
    }

    return { result, summary: null, done: false };
  }

  function next() {
    if (finished || index + 1 >= questions.length) return;
    setIndex((currentIndex) => currentIndex + 1);
  }

  return {
    questions,
    current,
    index,
    score,
    streak,
    bestStreak,
    results,
    finished,
    timed,
    totalTimeMs,
    questionTimeSec: settings.questionTimeSec,
    answer,
    next,
  };
}

function finishGame(
  results: QuestionResult[],
  score: number,
  bestStreak: number,
  mode: GameMode,
  level: CEFRLevel | "adaptive",
): GameResult {
  const correct = results.filter((item) => item.outcome === "correct").length;
  const wrong = results.filter((item) => item.outcome === "wrong").length;
  const timeout = results.filter((item) => item.outcome === "timeout").length;
  const total = results.length;
  const averageTimeMs = total
    ? Math.round(results.reduce((sum, item) => sum + item.timeMs, 0) / total)
    : 0;
  const summary: GameResult = {
    mode,
    level,
    score,
    correct,
    wrong,
    timeout,
    total,
    accuracy: calcAccuracy(correct, total),
    averageTimeMs,
    bestStreak,
    results,
    completedAt: new Date().toISOString(),
  };

  const stats = loadStatistics();
  const progress = loadWordProgress();
  const learned = Object.values(progress).filter((item) => item.seenCount > 0).length;
  const mastered = Object.values(progress).filter((item) => item.mastery >= 86).length;
  saveStatistics({
    totalQuestions: stats.totalQuestions + total,
    correct: stats.correct + correct,
    wrong: stats.wrong + wrong,
    timeout: stats.timeout + timeout,
    bestScore: Math.max(stats.bestScore, score),
    bestStreak: Math.max(stats.bestStreak, bestStreak),
    wordsLearned: learned,
    wordsMastered: mastered,
    gameHistory: [
      {
        id: `${Date.now()}`,
        completedAt: summary.completedAt,
        mode,
        level,
        score,
        accuracy: summary.accuracy,
        correct,
        total,
      },
      ...stats.gameHistory,
    ].slice(0, 50),
  });

  return summary;
}

export function persistLastResult(result: GameResult): void {
  sessionStorage.setItem("ewc.lastResult", JSON.stringify(result));
}

export function readLastResult(): GameResult | null {
  try {
    const raw = sessionStorage.getItem("ewc.lastResult");
    return raw ? (JSON.parse(raw) as GameResult) : null;
  } catch {
    return null;
  }
}
