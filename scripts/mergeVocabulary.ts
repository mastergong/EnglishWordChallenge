import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Word } from "../src/types/word";
import { validateWords, hasCriticalVocabErrors } from "../src/utils/validateWords";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const batchDir = path.join(root, "scripts", "batches");
const dataDir = path.join(root, "src", "data");

const files = fs
  .readdirSync(batchDir)
  .filter((name) => name.endsWith(".json"))
  .sort();

const merged: Word[] = [];
for (const file of files) {
  const rows = JSON.parse(fs.readFileSync(path.join(batchDir, file), "utf8")) as Word[];
  merged.push(...rows);
}

merged.sort((a, b) => a.id - b.id);
const issues = validateWords(merged);
if (hasCriticalVocabErrors(issues)) {
  console.error(issues.filter((issue) => issue.severity === "error").slice(0, 20));
  process.exit(1);
}

const byLevel: Record<string, Word[]> = {};
for (const word of merged) {
  byLevel[word.level] ??= [];
  byLevel[word.level]!.push(word);
}

fs.mkdirSync(dataDir, { recursive: true });
for (const [level, rows] of Object.entries(byLevel)) {
  fs.writeFileSync(path.join(dataDir, `words-${level.toLowerCase()}.json`), JSON.stringify(rows));
}
fs.writeFileSync(path.join(dataDir, "words.json"), JSON.stringify(merged));
console.log(`Merged ${merged.length} words into src/data.`);
