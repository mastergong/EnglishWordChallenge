import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Word } from "../src/types/word";
import { validateWords, hasCriticalVocabErrors } from "../src/utils/validateWords";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");

function readLevel(level: string): Word[] {
  const file = path.join(dataDir, `words-${level.toLowerCase()}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8")) as Word[];
}

const words = ["a1", "a2", "b1", "b2", "c1", "c2"].flatMap(readLevel);
const issues = validateWords(words);
const errors = issues.filter((issue) => issue.severity === "error");
const warnings = issues.filter((issue) => issue.severity === "warning");

for (const issue of [...errors, ...warnings].slice(0, 40)) {
  console[issue.severity === "error" ? "error" : "warn"](
    `[${issue.severity}] ${issue.code}: ${issue.message}`,
  );
}
if (errors.length > 40) console.error(`...and ${errors.length - 40} more errors`);

console.log(`Validated ${words.length} words (${errors.length} errors, ${warnings.length} warnings).`);

if (hasCriticalVocabErrors(issues)) {
  process.exit(1);
}
