import type { Word } from "../types/word";

const SUFFIXES = [
  "tion",
  "sion",
  "ture",
  "ight",
  "ough",
  "ance",
  "ence",
  "able",
  "ible",
  "ment",
  "ness",
  "ound",
  "ouse",
  "ice",
  "ace",
  "ake",
  "ate",
  "ine",
  "ing",
  "est",
  "ess",
  "all",
  "ell",
  "ill",
  "ook",
  "oon",
  "own",
  "ear",
  "air",
  "ore",
  "ure",
  "ous",
  "ive",
  "ize",
  "ise",
  "ack",
  "ick",
  "ock",
  "uck",
  "ash",
  "ish",
  "ush",
  "and",
  "end",
  "ind",
  "old",
  "ain",
  "een",
  "eet",
  "eat",
  "ool",
  "ile",
  "ite",
  "ote",
  "oke",
  "one",
  "ime",
  "ife",
  "ade",
  "ide",
  "ode",
];

export type RhymeFamily = {
  key: string;
  label: string;
  words: Word[];
};

function headword(word: string): string {
  const parts = word.trim().toLowerCase().split(/\s+/);
  return (parts[parts.length - 1] ?? word).replace(/[^a-z']/g, "");
}

export function rhymeKey(word: string, ipa = ""): string {
  const fromIpa = ipaRhyme(ipa);
  if (fromIpa) return fromIpa;
  const w = headword(word);
  if (w.length <= 2) return w;
  const ranked = [...SUFFIXES].sort((a, b) => b.length - a.length);
  for (const suffix of ranked) {
    if (w.endsWith(suffix) && w.length > suffix.length) return suffix;
  }
  return w.slice(-Math.min(3, w.length));
}

function ipaRhyme(ipa: string): string | null {
  const raw = ipa
    .toLowerCase()
    .replace(/[/[\]ˈˌ.ː:\s-]/g, "")
    .replace(/tʃ/g, "ʧ")
    .replace(/dʒ/g, "ʤ");
  if (!raw) return null;
  const match = raw.match(/([aeiouæɑɒɔəɜɛɪiyʊuʌ]+(?:ɪ|ʊ)?)([^aeiouæɑɒɔəɜɛɪiyʊuʌ]*)$/i);
  if (!match) return raw.slice(-3);
  return `${match[1]}${match[2]}`;
}

export function buildRhymeFamilies(words: Word[], minSize = 2): RhymeFamily[] {
  const unique = new Map<string, Word>();
  for (const item of words) {
    const key = item.word.trim().toLowerCase();
    if (!unique.has(key)) unique.set(key, item);
  }

  const buckets = new Map<string, Word[]>();
  for (const item of unique.values()) {
    const key = rhymeKey(item.word, item.ipa);
    if (!key) continue;
    const list = buckets.get(key) ?? [];
    list.push(item);
    buckets.set(key, list);
  }

  return [...buckets.entries()]
    .map(([key, group]) => ({
      key,
      label: key.startsWith("-") ? key : `/${key}/`,
      words: [...group].sort(
        (a, b) => a.word.length - b.word.length || a.word.localeCompare(b.word),
      ),
    }))
    .filter((family) => family.words.length >= minSize)
    .sort((a, b) => b.words.length - a.words.length || a.key.localeCompare(b.key));
}

export function findFamily(families: RhymeFamily[], query: string): RhymeFamily | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return families[0];
  return (
    families.find((family) => family.words.some((word) => word.word.toLowerCase() === q)) ??
    families.find((family) => family.words.some((word) => word.word.toLowerCase().includes(q))) ??
    families.find((family) => family.key === q || family.key === rhymeKey(q) || family.key === rhymeKey(q, `/${q}/`))
  );
}
