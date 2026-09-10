import type { Word } from "../types/word";
import type { CEFRLevel } from "../types/word";
import type { QuestionType, QuizChoice, QuizQuestion } from "../types/game";
import type { WordProgress } from "../types/statistics";
import { selectionWeight } from "./adaptiveLearning";
import { isDueForReview } from "./spacedRepetition";
import { seededRandom, shuffle, type RNG } from "./random";

function sameish(a: Word, b: Word): boolean {
  return (
    a.level === b.level ||
    a.partOfSpeech === b.partOfSpeech ||
    a.category === b.category ||
    Math.abs(a.difficulty - b.difficulty) <= 1
  );
}

export function pickDistractors(
  target: Word,
  pool: Word[],
  n: number,
  rng: RNG,
  field: "meaningTh" | "word" | "ipa" | "example",
): Word[] {
  const used = new Set<string>([normalize(String(target[field])), normalize(target.word)]);
  const ranked = pool
    .filter((word) => word.id !== target.id)
    .filter((word) => {
      const value = normalize(String(word[field]));
      return value && !used.has(value) && normalize(word.word) !== normalize(target.word);
    })
    .map((word) => {
      let score = 0;
      if (word.level === target.level) score += 4;
      if (word.partOfSpeech === target.partOfSpeech) score += 5;
      if (word.category === target.category) score += 3;
      if (Math.abs(word.difficulty - target.difficulty) <= 1) score += 2;
      if (sameish(word, target)) score += 1;
      return { word, score: score + rng() };
    })
    .sort((a, b) => b.score - a.score);

  const chosen: Word[] = [];
  for (const item of ranked) {
    const value = normalize(String(item.word[field]));
    if (used.has(value)) continue;
    used.add(value);
    chosen.push(item.word);
    if (chosen.length >= n) break;
  }
  return chosen;
}

function quizMeaning(th: string): string {
  return displayMeaning(th);
}

export function displayMeaning(th: string): string {
  const first = th.split("/")[0]?.trim() || th;
  const stripped = first.replace(/^แนวคิดขั้นสูงเกี่ยวกับ\s*/u, "").trim();
  return stripped || first;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function blankExample(word: Word): string {
  const pattern = new RegExp(`\\b${escapeRegExp(word.word)}\\b`, "i");
  if (pattern.test(word.example)) {
    return word.example.replace(pattern, "______");
  }
  return `${word.example.replace(/[.?!]$/, "")} — ______`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function makeChoices(
  correctLabel: string,
  distractorLabels: string[],
  rng: RNG,
): QuizChoice[] {
  const unique = [correctLabel, ...distractorLabels.filter((label) => normalize(label) !== normalize(correctLabel))];
  const shuffled = shuffle(
    unique.map((label, index) => ({
      id: `c${index}-${label.slice(0, 12)}`,
      label,
      isCorrect: normalize(label) === normalize(correctLabel),
    })),
    rng,
  );
  if (!shuffled.some((choice) => choice.isCorrect)) {
    shuffled[0] = { ...shuffled[0]!, label: correctLabel, isCorrect: true };
  }
  const seen = new Set<string>();
  return shuffled.filter((choice) => {
    const key = normalize(choice.label);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 4);
}

export function buildQuestion(word: Word, pool: Word[], type: QuestionType, rng: RNG): QuizQuestion {
  let prompt = "";
  let promptSub: string | undefined;
  let highlight: string | undefined;
  let correct = "";
  let distractors: string[] = [];

  if (type === "enToTh") {
    prompt = `คำว่า «${word.word}» หมายความว่าอะไร?`;
    highlight = word.word;
    correct = quizMeaning(word.meaningTh);
    distractors = pickDistractors(word, pool, 3, rng, "meaningTh").map((item) => quizMeaning(item.meaningTh));
  } else if (type === "thToEn") {
    const meaning = quizMeaning(word.meaningTh);
    prompt = `คำภาษาอังกฤษข้อไหนมีความหมายว่า «${meaning}»?`;
    highlight = meaning;
    correct = word.word;
    distractors = pickDistractors(word, pool, 3, rng, "word").map((item) => item.word);
  } else if (type === "exampleMeaning") {
    prompt = `ประโยคใดสื่อความหมายของ «${word.word}» ได้ถูกต้อง?`;
    highlight = word.word;
    correct = word.example;
    distractors = pickDistractors(word, pool, 3, rng, "example").map((item) => item.example);
  } else if (type === "pronunciation") {
    prompt = `สัทอักษรของ «${word.word}» คือข้อใด?`;
    highlight = word.word;
    correct = word.ipa;
    distractors = pickDistractors(word, pool, 3, rng, "ipa").map((item) => item.ipa);
  } else {
    prompt = blankExample(word);
    highlight = "______";
    correct = word.word;
    distractors = pickDistractors(word, pool, 3, rng, "word").map((item) => item.word);
  }

  const choices = makeChoices(correct, distractors, rng);

  return {
    id: `${word.id}-${type}`,
    type,
    wordId: word.id,
    prompt,
    promptSub,
    highlight,
    targetWord: word.word,
    ipa: word.ipa,
    phoneticThai: word.phoneticThai,
    meaningTh: word.meaningTh,
    meaningEn: word.meaningEn,
    example: word.example,
    exampleThai: word.exampleThai,
    speakText: word.word,
    choices,
    level: word.level,
    category: word.category,
    partOfSpeech: word.partOfSpeech,
  };
}

export function weightedPick(words: Word[], progress: Record<string, WordProgress>, adaptive: boolean, rng: RNG): Word {
  const weights = words.map((word) => selectionWeight(progress[String(word.id)], adaptive));
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = rng() * total;
  for (let i = 0; i < words.length; i += 1) {
    cursor -= weights[i]!;
    if (cursor <= 0) return words[i]!;
  }
  return words[words.length - 1]!;
}

export function selectQuizWords(options: {
  words: Word[];
  count: number;
  level?: CEFRLevel | "adaptive";
  progress?: Record<string, WordProgress>;
  adaptive?: boolean;
  rng?: RNG;
  preferWeak?: boolean;
}): Word[] {
  const rng = options.rng ?? Math.random;
  const progress = options.progress ?? {};
  const adaptive = options.adaptive ?? true;
  const levelFiltered =
    options.level && options.level !== "adaptive"
      ? options.words.filter((word) => word.level === options.level)
      : options.words;
  const pool = levelFiltered.length ? levelFiltered : options.words;

  const due = pool.filter((word) => isDueForReview(progress[String(word.id)]));
  const weak = pool.filter((word) => (progress[String(word.id)]?.mastery ?? 50) <= 50);
  const prioritized = options.preferWeak ? [...due, ...weak, ...pool] : [...due, ...pool];

  const selected: Word[] = [];
  const usedIds = new Set<number>();
  const categoryCount = new Map<string, number>();

  const candidates = [...new Map(prioritized.map((word) => [word.id, word])).values()];

  while (selected.length < options.count && selected.length < candidates.length) {
    const remaining = candidates.filter((word) => !usedIds.has(word.id));
    if (!remaining.length) break;
    const diversified = remaining.filter((word) => (categoryCount.get(word.category) ?? 0) < 3);
    const source = diversified.length ? diversified : remaining;
    const pick = weightedPick(source, progress, adaptive, rng);
    usedIds.add(pick.id);
    categoryCount.set(pick.category, (categoryCount.get(pick.category) ?? 0) + 1);
    selected.push(pick);
  }

  return selected;
}

export function generateQuestions(options: {
  words: Word[];
  count: number;
  level?: CEFRLevel | "adaptive";
  progress?: Record<string, WordProgress>;
  adaptive?: boolean;
  rng?: RNG;
  preferWeak?: boolean;
}): QuizQuestion[] {
  const rng = options.rng ?? Math.random;
  const selected = selectQuizWords({ ...options, rng });
  return selected.map((word) => buildQuestion(word, options.words, pickQuestionType(rng), rng));
}

export function pickQuestionType(rng: RNG): QuestionType {
  return rng() < 0.5 ? "enToTh" : "thToEn";
}

export function generateDailyQuestions(words: Word[], dateKey: string, count = 10): QuizQuestion[] {
  const rng = seededRandom(`daily-${dateKey}-v1`);
  return generateQuestions({
    words,
    count,
    adaptive: false,
    rng,
  });
}
