import type { CEFRLevel } from "./word";

export type GameMode =
  | "classic"
  | "challenge"
  | "endless"
  | "timeAttack"
  | "practice"
  | "adaptive"
  | "daily";

export type QuestionType =
  | "enToTh"
  | "thToEn"
  | "exampleMeaning"
  | "pronunciation"
  | "context";

export type QuizChoice = {
  id: string;
  label: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  id: string;
  type: QuestionType;
  wordId: number;
  prompt: string;
  promptSub?: string;
  highlight?: string;
  targetWord: string;
  ipa: string;
  phoneticThai: string;
  meaningTh: string;
  meaningEn: string;
  example: string;
  exampleThai: string;
  speakText: string;
  choices: QuizChoice[];
  level: CEFRLevel;
  category: string;
  partOfSpeech: string;
};

export type AnswerOutcome = "correct" | "wrong" | "timeout";

export type QuestionResult = {
  question: QuizQuestion;
  selectedChoiceId: string | null;
  outcome: AnswerOutcome;
  timeMs: number;
  points: number;
  timeBonus: number;
  comboBonus: number;
};

export type GameSession = {
  mode: GameMode;
  level: CEFRLevel | "adaptive";
  questionCount: number;
  timeLimitSec: number | null;
  questionTimeSec: number;
};

export type GameResult = {
  mode: GameMode;
  level: CEFRLevel | "adaptive";
  score: number;
  correct: number;
  wrong: number;
  timeout: number;
  total: number;
  accuracy: number;
  averageTimeMs: number;
  bestStreak: number;
  results: QuestionResult[];
  completedAt: string;
};

export type ThemePreference = "light" | "dark" | "system";
export type VoiceAccent = "en-US" | "en-GB";
export type QuizSpeakLang = "en" | "th" | "both";

export type AppSettings = {
  countdownSec: 3 | 5 | 10 | 15;
  questionCount: 10 | 20 | 30 | 40 | 50;
  questionTimeSec: 3 | 5 | 10 | 15;
  sound: boolean;
  speech: boolean;
  voice: VoiceAccent;
  quizSpeakLang: QuizSpeakLang;
  autoPronounce: boolean;
  theme: ThemePreference;
  adaptiveLearning: boolean;
  levelLock: boolean;
  autoNext: boolean;
  confirmSubmit: boolean;
  spellLetters: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  countdownSec: 5,
  questionCount: 10,
  questionTimeSec: 10,
  sound: true,
  speech: true,
  voice: "en-US",
  quizSpeakLang: "both",
  autoPronounce: true,
  theme: "system",
  adaptiveLearning: true,
  levelLock: true,
  autoNext: true,
  confirmSubmit: true,
  spellLetters: true,
};
