import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WordCard } from "../components/WordCard";
import { loadWords } from "../utils/loadWords";
import { loadSettings, loadWordProgress, saveSettings, saveWordProgress } from "../utils/storage";
import { cancelSpeech, letterAudioReady, speakPracticeWord, spellingGuide } from "../utils/speech";
import { applyAnswerToProgress } from "../utils/adaptiveLearning";
import { nextReviewAfterAnswer } from "../utils/spacedRepetition";
import type { AppSettings } from "../types/game";

export function Practice() {
  const [params] = useSearchParams();
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
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

  useEffect(() => {
    if (!word || !settings.speech) return undefined;
    if (settings.spellLetters && !letterAudioReady()) return undefined;
    void speakPracticeWord(word.word, settings.voice, settings.spellLetters);
    return () => cancelSpeech();
  }, [word?.id, settings.speech, settings.voice, settings.spellLetters]);

  function toggleSpell() {
    const next = { ...loadSettings(), spellLetters: !settings.spellLetters };
    saveSettings(next);
    setSettings(next);
  }

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

  const guide = spellingGuide(word.word);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Practice · ฝึกคำศัพท์</h1>
      <p className="text-sm text-slate-500">
        {settings.spellLetters
          ? "แตะ 🔊 ฟังสะกด เพื่อเล่นไฟล์ตัวอักษรทีละตัว แล้วค่อยอ่านทั้งคำ"
          : "ฟังคำภาษาอังกฤษ และดูว่ามีตัวอักษรอะไรบ้าง"}
      </p>
      <button
        type="button"
        onClick={toggleSpell}
        className="flex min-h-12 w-full items-center justify-between rounded-2xl bg-white px-4 font-semibold shadow dark:bg-white/10"
        aria-pressed={settings.spellLetters}
      >
        สะกดทีละตัวตอนออกเสียง
        <span className={settings.spellLetters ? "text-blue-600" : "text-slate-400"}>
          {settings.spellLetters ? "ON" : "OFF"}
        </span>
      </button>
      <WordCard
        word={word}
        speakLabel={settings.spellLetters ? "ฟังสะกด" : "Listen"}
        onSpeak={() => settings.speech && void speakPracticeWord(word.word, settings.voice, settings.spellLetters)}
        extra={
          <div className="flex w-full basis-full flex-col gap-3">
            <div className="rounded-2xl bg-blue-50 px-3 py-3 dark:bg-white/10">
              <p className="text-xs font-semibold text-blue-600">ตัวอักษรในคำนี้</p>
              <p className="mt-1 font-game-display text-2xl font-black tracking-[0.2em] text-blue-800">
                {guide.map((item) => item.letter).join(" ")}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {guide.map((item) => item.thai).join(" · ")}
                {word.phoneticThai ? `  →  ${word.phoneticThai}` : ""}
              </p>
            </div>
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
          </div>
        }
      />
    </div>
  );
}
