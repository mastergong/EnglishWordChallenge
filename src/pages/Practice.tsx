import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WordCard } from "../components/WordCard";
import { loadWords } from "../utils/loadWords";
import { loadSettings, loadWordProgress, saveWordProgress } from "../utils/storage";
import { speakEnglish } from "../utils/speech";
import { applyAnswerToProgress } from "../utils/adaptiveLearning";
import { nextReviewAfterAnswer } from "../utils/spacedRepetition";

export function Practice() {
  const [params] = useSearchParams();
  const settings = loadSettings();
  const all = loadWords();
  const progress = loadWordProgress();
  const weakOnly = params.get("weak") === "1";
  const wordId = Number(params.get("word") ?? 0);

  const queue = useMemo(() => {
    if (wordId) return all.filter((word) => word.id === wordId);
    if (weakOnly) {
      const weak = all
        .filter((word) => (progress[String(word.id)]?.wrongCount ?? 0) >= 1)
        .sort((a, b) => (progress[String(b.id)]?.wrongCount ?? 0) - (progress[String(a.id)]?.wrongCount ?? 0));
      return weak.length ? weak : all.slice(0, 20);
    }
    return all.slice().sort((a, b) => (progress[String(a.id)]?.mastery ?? 0) - (progress[String(b.id)]?.mastery ?? 0));
  }, [all, progress, weakOnly, wordId]);

  const [index, setIndex] = useState(0);
  const word = queue[index];

  function mark(know: boolean) {
    if (!word) return;
    const map = loadWordProgress();
    const prev = map[String(word.id)];
    const consecutive = know ? (prev?.consecutiveCorrect ?? 0) + 1 : 0;
    map[String(word.id)] = applyAnswerToProgress(
      prev,
      word.id,
      know,
      0,
      nextReviewAfterAnswer(consecutive, know),
    );
    saveWordProgress(map);
    setIndex((value) => (value + 1) % queue.length);
  }

  if (!word) {
    return <p className="pt-10 text-center">ยังไม่มีคำให้ฝึก · เริ่มเล่นเกมก่อน</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Practice · ฝึกคำศัพท์</h1>
      <WordCard
        word={word}
        onSpeak={() => settings.speech && speakEnglish(word.word, settings.voice)}
        extra={
          <div className="flex w-full gap-2">
            <button
              type="button"
              className="min-h-12 flex-1 rounded-2xl bg-emerald-600 font-bold text-white"
              onClick={() => mark(true)}
            >
              I Know This
            </button>
            <button
              type="button"
              className="min-h-12 flex-1 rounded-2xl bg-amber-500 font-bold text-white"
              onClick={() => mark(false)}
            >
              Need More Practice
            </button>
          </div>
        }
      />
    </div>
  );
}
