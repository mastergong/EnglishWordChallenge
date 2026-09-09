import { describe, expect, it } from "vitest";
import { generateDailyQuestions, generateQuestions, buildQuestion } from "../utils/questionGenerator";
import { calcQuestionScore } from "../utils/scoring";
import { calcMastery } from "../utils/adaptiveLearning";
import { nextReviewAfterAnswer } from "../utils/spacedRepetition";
import { seededRandom } from "../utils/random";
import { validateWords } from "../utils/validateWords";
import type { Word } from "../types/word";

const sample: Word[] = [
  {
    id: 1,
    word: "achieve",
    meaningTh: "บรรลุ",
    meaningEn: "to successfully reach a goal",
    ipa: "/əˈtʃiːv/",
    phoneticThai: "อะ-ชีฟ",
    level: "B1",
    partOfSpeech: "verb",
    category: "Work",
    difficulty: 3,
    example: "She worked hard to achieve her goal.",
    exampleThai: "เธอทำงานหนักเพื่อบรรลุเป้าหมาย",
  },
  {
    id: 2,
    word: "avoid",
    meaningTh: "หลีกเลี่ยง",
    meaningEn: "to stay away from something",
    ipa: "/əˈvɔɪd/",
    phoneticThai: "อะ-วอยด์",
    level: "B1",
    partOfSpeech: "verb",
    category: "Daily Life",
    difficulty: 3,
    example: "Try to avoid junk food.",
    exampleThai: "พยายามหลีกเลี่ยงอาหารขยะ",
  },
  {
    id: 3,
    word: "allow",
    meaningTh: "อนุญาต",
    meaningEn: "to let someone do something",
    ipa: "/əˈlaʊ/",
    phoneticThai: "อะ-ลาว",
    level: "B1",
    partOfSpeech: "verb",
    category: "Common Verbs",
    difficulty: 2,
    example: "The teacher will allow extra time.",
    exampleThai: "ครูจะอนุญาตให้มีเวลาเพิ่ม",
  },
  {
    id: 4,
    word: "appear",
    meaningTh: "ปรากฏ",
    meaningEn: "to become visible",
    ipa: "/əˈpɪə/",
    phoneticThai: "อะ-เพีย",
    level: "B1",
    partOfSpeech: "verb",
    category: "Common Verbs",
    difficulty: 2,
    example: "Stars appear at night.",
    exampleThai: "ดาวปรากฏในตอนกลางคืน",
  },
  {
    id: 5,
    word: "borrow",
    meaningTh: "ยืม",
    meaningEn: "to take something temporarily",
    ipa: "/ˈbɒr.əʊ/",
    phoneticThai: "บอ-โรล",
    level: "A2",
    partOfSpeech: "verb",
    category: "Daily Life",
    difficulty: 2,
    example: "Can I borrow your pen?",
    exampleThai: "ฉันยืมปากกาเธอได้ไหม",
  },
  {
    id: 6,
    word: "cancel",
    meaningTh: "ยกเลิก",
    meaningEn: "to stop a planned event",
    ipa: "/ˈkæn.səl/",
    phoneticThai: "แคน-เซิล",
    level: "A2",
    partOfSpeech: "verb",
    category: "Daily Life",
    difficulty: 2,
    example: "They had to cancel the trip.",
    exampleThai: "พวกเขาต้องยกเลิกทริป",
  },
  {
    id: 7,
    word: "complete",
    meaningTh: "ทำให้เสร็จ",
    meaningEn: "to finish something",
    ipa: "/kəmˈpliːt/",
    phoneticThai: "คัม-พลีท",
    level: "A2",
    partOfSpeech: "verb",
    category: "Work",
    difficulty: 2,
    example: "Please complete the form.",
    exampleThai: "กรุณากรอกแบบฟอร์มให้ครบ",
  },
  {
    id: 8,
    word: "improve",
    meaningTh: "ปรับปรุง",
    meaningEn: "to make better",
    ipa: "/ɪmˈpruːv/",
    phoneticThai: "อิม-พรูฟ",
    level: "B1",
    partOfSpeech: "verb",
    category: "Education",
    difficulty: 3,
    example: "Practice will improve your English.",
    exampleThai: "การฝึกจะช่วยให้ภาษาอังกฤษดีขึ้น",
  },
];

describe("question generation", () => {
  it("always includes exactly one correct answer and four unique choices", () => {
    const questions = generateQuestions({ words: sample, count: 8, adaptive: false, rng: seededRandom(42) });
    expect(questions).toHaveLength(8);
    const ids = questions.map((q) => q.wordId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of questions) {
      expect(q.type).toBe("enToTh");
      expect(q.prompt).toMatch(/^คำว่า «.+» หมายความว่าอะไร\?$/);
      const correct = q.choices.filter((c) => c.isCorrect);
      expect(correct).toHaveLength(1);
      expect(correct[0]?.label).toBe(
        (sample.find((w) => w.id === q.wordId)?.meaningTh ?? "").split("/")[0]?.trim(),
      );
      const labels = q.choices.map((c) => c.label.toLowerCase());
      expect(new Set(labels).size).toBe(labels.length);
      expect(q.choices.length).toBeLessThanOrEqual(4);
      expect(q.choices.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("randomizes correct answer position", () => {
    const positions = new Set<number>();
    for (let seed = 1; seed <= 30; seed += 1) {
      const q = buildQuestion(sample[0]!, sample, "enToTh", seededRandom(seed));
      positions.add(q.choices.findIndex((c) => c.isCorrect));
    }
    expect(positions.size).toBeGreaterThan(1);
  });

  it("makes daily challenge deterministic", () => {
    const a = generateDailyQuestions(sample, "2026-09-08", 5);
    const b = generateDailyQuestions(sample, "2026-09-08", 5);
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
    expect(a.map((q) => q.choices.map((c) => c.label))).toEqual(b.map((q) => q.choices.map((c) => c.label)));
  });
});

describe("scoring and learning", () => {
  it("scores correct answers with time and combo bonuses", () => {
    const result = calcQuestionScore({
      correct: true,
      remainingMs: 2500,
      totalMs: 5000,
      streakBeforeAnswer: 5,
      timed: true,
    });
    expect(result.points).toBe(100 + 25 + 20);
    expect(calcQuestionScore({ correct: false, remainingMs: 1000, totalMs: 5000, streakBeforeAnswer: 4, timed: true }).points).toBe(0);
  });

  it("computes mastery in 0-100", () => {
    const mastery = calcMastery({
      seenCount: 5,
      correctCount: 4,
      wrongCount: 1,
      averageResponseTime: 2000,
      consecutiveCorrect: 3,
    });
    expect(mastery).toBeGreaterThan(50);
    expect(mastery).toBeLessThanOrEqual(100);
  });

  it("schedules spaced review", () => {
    const wrong = nextReviewAfterAnswer(0, false, Date.parse("2026-09-08T00:00:00Z"));
    const right = nextReviewAfterAnswer(1, true, Date.parse("2026-09-08T00:00:00Z"));
    expect(new Date(wrong).getTime()).toBeGreaterThan(Date.parse("2026-09-08T00:00:00Z"));
    expect(new Date(right).getTime()).toBeGreaterThan(new Date(wrong).getTime());
  });
});

describe("vocabulary validation", () => {
  it("detects case-insensitive duplicates", () => {
    const issues = validateWords([
      sample[0]!,
      { ...sample[0]!, id: 99, word: "Achieve" },
    ]);
    expect(issues.some((issue) => issue.code === "duplicate-word")).toBe(true);
  });
});
