import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CEFRLevel, Word } from "../src/types/word";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const batchDir = path.join(root, "scripts", "batches");
const dataDir = path.join(root, "src", "data");

const DIFF: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 4, C2: 5 };
const TARGET: Record<CEFRLevel, number> = { A1: 500, A2: 500, B1: 700, B2: 700, C1: 400, C2: 200 };

const FILES: Array<[CEFRLevel, string]> = [
  ["A1", "vocab_a1.txt"],
  ["A2", "vocab_a2.txt"],
  ["B1", "vocab_b1.txt"],
  ["B2", "vocab_b2.txt"],
  ["C1", "vocab_c1.txt"],
  ["C2", "vocab_c2.txt"],
];

function wrapIpa(ipa: string): string {
  let value = ipa.trim();
  if (!value.startsWith("/")) value = `/${value}`;
  if (!value.endsWith("/")) value = `${value}/`;
  return value;
}

function parseLine(level: CEFRLevel, line: string): Omit<Word, "id"> | null {
  const parts = line.split("|").map((part) => part.trim());
  if (parts.length !== 9) return null;
  const [word, partOfSpeech, category, meaningTh, meaningEn, ipa, phoneticThai, example, exampleThai] = parts;
  if (!word) return null;
  return {
    word,
    partOfSpeech,
    category,
    meaningTh,
    meaningEn,
    ipa: wrapIpa(ipa),
    phoneticThai,
    example,
    exampleThai,
    level,
    difficulty: DIFF[level],
  };
}

const groups: Record<CEFRLevel, Omit<Word, "id">[]> = {
  A1: [],
  A2: [],
  B1: [],
  B2: [],
  C1: [],
  C2: [],
};

const seen = new Set<string>();
function keyOf(word: string) {
  return word.trim().toLowerCase().replace(/\s+/g, " ");
}

for (const [level, file] of FILES) {
  const text = fs.readFileSync(path.join(root, "scripts", file), "utf8");
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const row = parseLine(level, line);
    if (!row) throw new Error(`Bad row: ${line.slice(0, 80)}`);
    const key = keyOf(row.word);
    if (seen.has(key)) continue;
    seen.add(key);
    groups[level].push(row);
  }
}

const extraPath = path.join(root, "scripts", "vocab_extra.txt");
if (fs.existsSync(extraPath)) {
  for (const raw of fs.readFileSync(extraPath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const probe = parseLine("B1", line);
    if (!probe) throw new Error(`Bad extra row: ${line.slice(0, 80)}`);
    if (seen.has(keyOf(probe.word))) continue;
    const needy = (Object.keys(TARGET) as CEFRLevel[]).find((level) => groups[level].length < TARGET[level]);
    if (!needy) break;
    const row = { ...probe, level: needy, difficulty: DIFF[needy] };
    seen.add(keyOf(row.word));
    groups[needy].push(row);
  }
}

for (const level of Object.keys(TARGET) as CEFRLevel[]) {
  if (groups[level].length < TARGET[level]) {
    throw new Error(`${level} has ${groups[level].length}, need ${TARGET[level]}. Add scripts/vocab_extra.txt`);
  }
  groups[level] = groups[level].slice(0, TARGET[level]);
}

fs.mkdirSync(batchDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

let id = 1;
const all: Word[] = [];
for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"] as CEFRLevel[]) {
  const out: Word[] = groups[level].map((item) => ({ id: id++, ...item }));
  all.push(...out);
  fs.writeFileSync(path.join(batchDir, `batch-${level.toLowerCase()}.json`), JSON.stringify(out));
  fs.writeFileSync(path.join(dataDir, `words-${level.toLowerCase()}.json`), JSON.stringify(out));
  console.log(`${level}: ${out.length}`);
}
fs.writeFileSync(path.join(dataDir, "words.json"), JSON.stringify(all));
console.log("total", all.length);
