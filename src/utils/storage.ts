import type { AppSettings } from "../types/game";
import { DEFAULT_SETTINGS } from "../types/game";
import type {
  AppStatistics,
  DailyChallengeState,
  DailyHistoryEntry,
  DailyStreakState,
  WordProgress,
} from "../types/statistics";
import { DEFAULT_DAILY_STREAK, DEFAULT_STATISTICS } from "../types/statistics";
import { dailyHistoryFromGames } from "./dailyHistory";

const KEYS = {
  settings: "ewc.settings",
  statistics: "ewc.statistics",
  wordProgress: "ewc.wordProgress",
  dailyChallenge: "ewc.dailyChallenge",
  dailyStreak: "ewc.dailyStreak",
  dailyHistory: "ewc.dailyHistory",
} as const;

function canUseStorage(): boolean {
  try {
    const key = "__ewc_test__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function readJson<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!isValid(parsed)) {
      window.localStorage.removeItem(key);
      return fallback;
    }
    return parsed;
  } catch {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

function isSettings(value: unknown): value is AppSettings {
  if (!value || typeof value !== "object") return false;
  const v = value as AppSettings;
  return (
    [3, 5, 10, 15].includes(v.countdownSec) &&
    [10, 20, 30, 40, 50].includes(v.questionCount) &&
    typeof v.sound === "boolean" &&
    typeof v.speech === "boolean" &&
    (v.voice === "en-US" || v.voice === "en-GB") &&
    (v.theme === "light" || v.theme === "dark" || v.theme === "system")
  );
}

function isStatistics(value: unknown): value is AppStatistics {
  if (!value || typeof value !== "object") return false;
  const v = value as AppStatistics;
  return typeof v.totalQuestions === "number" && Array.isArray(v.gameHistory);
}

function isProgressMap(value: unknown): value is Record<string, WordProgress> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function loadSettings(): AppSettings {
  const stored = readJson<AppSettings>(KEYS.settings, DEFAULT_SETTINGS, isSettings);
  const merged = { ...DEFAULT_SETTINGS, ...stored };
  if (merged.quizSpeakLang !== "en" && merged.quizSpeakLang !== "th") {
    merged.quizSpeakLang = DEFAULT_SETTINGS.quizSpeakLang;
  }
  return merged;
}

export function saveSettings(settings: AppSettings): void {
  writeJson(KEYS.settings, settings);
}

export function loadStatistics(): AppStatistics {
  const stored = readJson(KEYS.statistics, DEFAULT_STATISTICS, isStatistics);
  return { ...DEFAULT_STATISTICS, ...stored, gameHistory: stored.gameHistory ?? [] };
}

export function saveStatistics(stats: AppStatistics): void {
  writeJson(KEYS.statistics, {
    ...stats,
    gameHistory: stats.gameHistory.slice(0, 50),
  });
}

export function loadWordProgress(): Record<string, WordProgress> {
  return readJson(KEYS.wordProgress, {}, isProgressMap);
}

export function saveWordProgress(map: Record<string, WordProgress>): void {
  writeJson(KEYS.wordProgress, map);
}

export function loadDailyChallenge(): DailyChallengeState | null {
  return readJson(
    KEYS.dailyChallenge,
    null,
    (value): value is DailyChallengeState =>
      Boolean(value) &&
      typeof value === "object" &&
      typeof (value as DailyChallengeState).date === "string",
  );
}

export function saveDailyChallenge(state: DailyChallengeState): void {
  writeJson(KEYS.dailyChallenge, state);
}

export function loadDailyStreak(): DailyStreakState {
  return readJson(
    KEYS.dailyStreak,
    DEFAULT_DAILY_STREAK,
    (value): value is DailyStreakState =>
      Boolean(value) && typeof value === "object" && typeof (value as DailyStreakState).current === "number",
  );
}

export function saveDailyStreak(state: DailyStreakState): void {
  writeJson(KEYS.dailyStreak, state);
}

function isDailyHistory(value: unknown): value is DailyHistoryEntry[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as DailyHistoryEntry).date === "string" &&
        typeof (item as DailyHistoryEntry).bestScore === "number",
    )
  );
}

export function loadDailyHistory(): DailyHistoryEntry[] {
  const stored = readJson<DailyHistoryEntry[]>(KEYS.dailyHistory, [], isDailyHistory);
  if (stored.length) return stored;
  return dailyHistoryFromGames(loadStatistics().gameHistory);
}

export function saveDailyHistory(history: DailyHistoryEntry[]): void {
  writeJson(KEYS.dailyHistory, history.slice(0, 60));
}

export function resetAllProgress(): void {
  if (!canUseStorage()) return;
  Object.values(KEYS).forEach((key) => {
    if (key !== KEYS.settings) window.localStorage.removeItem(key);
  });
}

export function resetLocalStorage(): void {
  if (!canUseStorage()) return;
  Object.values(KEYS).forEach((key) => window.localStorage.removeItem(key));
}
