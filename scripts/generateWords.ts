/**
 * Development helper: rebuilds JSON from scripts/vocab_*.txt then merges batches.
 * Production never calls AI APIs; vocabulary is local static data.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const steps = ["scripts/buildLexicon.ts", "scripts/mergeVocabulary.ts"];
for (const file of steps) {
  const result = spawnSync("npx", ["tsx", file], { cwd: root, stdio: "inherit", shell: true });
  if (result.status) process.exit(result.status);
}
