import type { Word } from "../types/word";
import { CEFR_LEVELS } from "../types/word";

export type VocabIssue = {
  id?: number;
  word?: string;
  code: string;
  message: string;
  severity: "error" | "warning";
};

const CEFR_SET = new Set<string>(CEFR_LEVELS);

export function normalizeWordKey(word: string): string {
  return word.trim().toLowerCase().replace(/\s+/g, " ");
}

export function validateWords(words: Word[]): VocabIssue[] {
  const issues: VocabIssue[] = [];
  const seenIds = new Map<number, string>();
  const seenKeys = new Map<string, number>();

  if (!Array.isArray(words) || words.length === 0) {
    issues.push({
      code: "empty-dataset",
      message: "Vocabulary dataset is empty.",
      severity: "error",
    });
    return issues;
  }

  words.forEach((entry, index) => {
    const word = entry?.word ?? "";
    const id = entry?.id;

    const required: Array<[keyof Word, unknown]> = [
      ["word", entry?.word],
      ["meaningTh", entry?.meaningTh],
      ["meaningEn", entry?.meaningEn],
      ["ipa", entry?.ipa],
      ["phoneticThai", entry?.phoneticThai],
      ["level", entry?.level],
      ["partOfSpeech", entry?.partOfSpeech],
      ["category", entry?.category],
      ["example", entry?.example],
      ["exampleThai", entry?.exampleThai],
    ];

    for (const [field, value] of required) {
      if (typeof value !== "string" || value.trim() === "") {
        issues.push({
          id,
          word,
          code: `missing-${field}`,
          message: `Row ${index + 1}: missing ${field}.`,
          severity: "error",
        });
      }
    }

    if (!Number.isInteger(id) || (id ?? 0) <= 0) {
      issues.push({
        id,
        word,
        code: "invalid-id",
        message: `Row ${index + 1}: invalid id.`,
        severity: "error",
      });
    } else if (seenIds.has(id)) {
      issues.push({
        id,
        word,
        code: "duplicate-id",
        message: `Duplicate id ${id} (${seenIds.get(id)} / ${word}).`,
        severity: "error",
      });
    } else {
      seenIds.set(id, word);
    }

    const key = normalizeWordKey(word);
    if (key) {
      if (seenKeys.has(key)) {
        issues.push({
          id,
          word,
          code: "duplicate-word",
          message: `Duplicate word "${word}" (also id ${seenKeys.get(key)}).`,
          severity: "error",
        });
      } else {
        seenKeys.set(key, id);
      }
    }

    if (entry?.level && !CEFR_SET.has(entry.level)) {
      issues.push({
        id,
        word,
        code: "invalid-cefr",
        message: `Invalid CEFR "${entry.level}".`,
        severity: "error",
      });
    }

    if (
      typeof entry?.difficulty !== "number" ||
      !Number.isInteger(entry.difficulty) ||
      entry.difficulty < 1 ||
      entry.difficulty > 5
    ) {
      issues.push({
        id,
        word,
        code: "invalid-difficulty",
        message: `Invalid difficulty "${String(entry?.difficulty)}".`,
        severity: "error",
      });
    }

    if (entry?.ipa && !/^\/.+\/$/.test(entry.ipa.trim())) {
      issues.push({
        id,
        word,
        code: "ipa-format",
        message: `IPA should be wrapped in slashes: ${entry.ipa}`,
        severity: "warning",
      });
    }
  });

  return issues;
}

export function hasCriticalVocabErrors(issues: VocabIssue[]): boolean {
  return issues.some((issue) => issue.severity === "error");
}
