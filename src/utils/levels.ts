import type { CEFRLevel } from "../types/word";

const THRESHOLDS: Record<CEFRLevel, number> = {
  A1: 0,
  A2: 70,
  B1: 75,
  B2: 80,
  C1: 80,
  C2: 80,
};

const ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function isLevelUnlocked(
  level: CEFRLevel,
  accuracyByLevel: Partial<Record<CEFRLevel, number>>,
  lockEnabled: boolean,
): boolean {
  if (!lockEnabled) return true;
  if (level === "A1") return true;
  const index = ORDER.indexOf(level);
  const previous = ORDER[index - 1];
  if (!previous) return true;
  const needed = THRESHOLDS[level];
  return (accuracyByLevel[previous] ?? 0) >= needed;
}

export function levelMeta(level: CEFRLevel): { en: string; th: string } {
  const map: Record<CEFRLevel, { en: string; th: string }> = {
    A1: { en: "Beginner", th: "เริ่มต้น" },
    A2: { en: "Elementary", th: "พื้นฐาน" },
    B1: { en: "Intermediate", th: "สื่อสารได้" },
    B2: { en: "Upper Intermediate", th: "คล่องขึ้น" },
    C1: { en: "Advanced", th: "ระดับสูง" },
    C2: { en: "Proficiency", th: "ขั้นเชี่ยวชาญ" },
  };
  return map[level];
}
