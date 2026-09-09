import type { Word } from "../types/word";
import { validateWords } from "./validateWords";

const loaders = import.meta.glob("../data/words-*.json") as Record<
  string,
  () => Promise<{ default: Word[] }>
>;

let cache: Word[] | null = null;
let pending: Promise<Word[]> | null = null;

export async function ensureWords(): Promise<Word[]> {
  if (cache) return cache;
  if (!pending) {
    pending = Promise.all(Object.values(loaders).map((load) => load())).then((mods) => {
      const bundled = mods.flatMap((mod) => mod.default ?? []);
      const issues = validateWords(bundled);
      const invalidIds = new Set(
        issues.filter((issue) => issue.severity === "error" && issue.id).map((issue) => issue.id),
      );
      cache = bundled
        .filter((word) => !invalidIds.has(word.id))
        .sort((a, b) => a.id - b.id);
      return cache;
    });
  }
  return pending;
}

export function loadWords(): Word[] {
  if (!cache) {
    throw new Error("Vocabulary is not loaded yet. Call ensureWords() first.");
  }
  return cache;
}

export async function loadWordsByLevel(level: string): Promise<Word[]> {
  const words = await ensureWords();
  return words.filter((word) => word.level === level);
}
