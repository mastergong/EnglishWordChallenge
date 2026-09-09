export type WordProgress = {
  wordId: number;
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  lastSeen: string | null;
  lastCorrect: string | null;
  lastWrong: string | null;
  averageResponseTime: number;
  mastery: number;
  nextReview: string | null;
  consecutiveCorrect: number;
};

export type DailyChallengeState = {
  date: string;
  completed: boolean;
  bestScore: number;
  lastScore: number;
};

export type DailyStreakState = {
  current: number;
  lastCompletedDate: string | null;
  longest: number;
};

export type GameHistoryEntry = {
  id: string;
  completedAt: string;
  mode: string;
  level: string;
  score: number;
  accuracy: number;
  correct: number;
  total: number;
};

export type AppStatistics = {
  totalQuestions: number;
  correct: number;
  wrong: number;
  timeout: number;
  bestScore: number;
  bestStreak: number;
  wordsLearned: number;
  wordsMastered: number;
  gameHistory: GameHistoryEntry[];
};

export const DEFAULT_STATISTICS: AppStatistics = {
  totalQuestions: 0,
  correct: 0,
  wrong: 0,
  timeout: 0,
  bestScore: 0,
  bestStreak: 0,
  wordsLearned: 0,
  wordsMastered: 0,
  gameHistory: [],
};

export const DEFAULT_DAILY_STREAK: DailyStreakState = {
  current: 0,
  lastCompletedDate: null,
  longest: 0,
};
