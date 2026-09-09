import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LevelSelector } from "../components/LevelSelector";
import { ProgressBar } from "../components/ProgressBar";
import { InstallHint } from "../components/InstallHint";
import { useStatistics } from "../hooks/useStatistics";
import { useDailyChallenge } from "../hooks/useDailyChallenge";
import { loadSettings, saveSettings } from "../utils/storage";
import type { AppSettings } from "../types/game";
import type { CEFRLevel } from "../types/word";
import type { GameMode } from "../types/game";

export function Home() {
  const navigate = useNavigate();
  const { stats, accuracy, accuracyByLevel, weakWords } = useStatistics();
  const { todayState, streak } = useDailyChallenge();
  const settings = loadSettings();
  const [level, setLevel] = useState<CEFRLevel | "adaptive">("A1");
  const [questionCount, setQuestionCount] = useState<AppSettings["questionCount"]>(settings.questionCount);

  useEffect(() => {
    sessionStorage.setItem("ewc.level", level);
  }, [level]);

  const modes = useMemo(
    () =>
      [
        ["classic", "Classic", `${questionCount} ข้อ`],
        ["challenge", "Challenge", `${questionCount} ข้อ`],
        ["endless", "Endless", "จนกว่าจะผิด"],
        ["timeAttack", "Time Attack", "60 วินาที"],
        ["adaptive", "Adaptive", "ปรับตามคุณ"],
        ["practice", "Practice", "ไม่มีจับเวลา"],
      ] as Array<[GameMode, string, string]>,
    [questionCount],
  );

  function start(mode: GameMode) {
    const nextLevel = mode === "adaptive" ? "adaptive" : level;
    navigate(`/game?mode=${mode}&level=${nextLevel}`);
  }

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <p className="text-sm font-semibold text-indigo-500">Mobile vocabulary game</p>
        <h1 className="text-4xl font-black leading-tight">
          English Word
          <span className="block text-indigo-600 dark:text-indigo-300">Challenge</span>
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          ฝึกศัพท์อังกฤษให้เก่งขึ้น วันละไม่กี่นาที
        </p>
      </header>

      <InstallHint />

      <section className="grid grid-cols-2 gap-3">
        <Stat label="Daily Streak" value={`🔥 ${streak.current}`} />
        <Stat label="Best Score" value={`⭐ ${stats.bestScore}`} />
        <Stat label="Words Learned" value={`📚 ${stats.wordsLearned}`} />
        <Stat label="Accuracy" value={`🎯 ${accuracy}%`} />
      </section>

      <Link
        to="/daily"
        className="block rounded-3xl bg-indigo-600 p-5 text-white shadow-lg"
      >
        <p className="text-sm opacity-80">Today&apos;s Challenge · โจทย์ประจำวัน</p>
        <p className="text-2xl font-black">10 Questions</p>
        <p className="mt-1 text-sm">
          Best {todayState.bestScore} {todayState.completed ? "· Completed" : "· ยังไม่เล่นวันนี้"}
        </p>
      </Link>

      <section className="rounded-3xl bg-white/80 p-4 shadow dark:bg-white/10">
        <h2 className="mb-3 font-bold">เลือกเลเวล</h2>
        <LevelSelector
          value={level === "adaptive" ? "A1" : level}
          onChange={setLevel}
          accuracyByLevel={accuracyByLevel}
          lockEnabled={settings.levelLock}
        />
      </section>

      <section className="rounded-3xl bg-white/80 p-4 shadow dark:bg-white/10">
        <h2 className="mb-3 font-bold">จำนวนข้อ</h2>
        <div className="grid grid-cols-5 gap-2">
          {([10, 20, 30, 40, 50] as const).map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => {
                setQuestionCount(count);
                saveSettings({ ...loadSettings(), questionCount: count });
              }}
              className={`min-h-11 rounded-2xl text-sm font-bold ${
                questionCount === count ? "bg-indigo-600 text-white" : "bg-white/80 dark:bg-white/10"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => start("classic")}
        className="flex min-h-14 w-full items-center justify-center rounded-3xl bg-indigo-600 text-xl font-black text-white shadow-lg"
      >
        ▶ START GAME · เริ่มเกม
      </button>

      <Link
        to="/map"
        className="flex min-h-12 w-full items-center justify-center rounded-3xl bg-white/80 font-bold shadow dark:bg-white/10"
      >
        🧠 Mind Map · ice ⇒ rice ⇒ price
      </Link>

      <button
        type="button"
        onClick={() => navigate("/game?mode=adaptive&level=adaptive&weak=1")}
        className="flex min-h-12 w-full items-center justify-center rounded-3xl bg-white/80 font-bold shadow dark:bg-white/10"
      >
        Continue Learning · ต่อจากคำที่ยังอ่อน
      </button>

      <div className="grid grid-cols-2 gap-3">
        {modes.map(([mode, title, hint]) => (
          <button
            key={mode}
            type="button"
            onClick={() => start(mode)}
            className="min-h-20 rounded-3xl bg-white/80 p-4 text-left shadow dark:bg-white/10"
          >
            <p className="font-bold">{title}</p>
            <p className="text-sm text-slate-500">{hint}</p>
          </button>
        ))}
      </div>

      <section className="rounded-3xl bg-white/80 p-4 shadow dark:bg-white/10">
        <h2 className="font-bold">Need Review · ควรทบทวน</h2>
        {weakWords.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">เริ่มเล่นเกมเพื่อสร้างสถิติของคุณ</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {weakWords.slice(0, 4).map((item) => (
              <li key={item.word.id} className="flex justify-between text-sm">
                <span>❌ {item.word.word}</span>
                <span>Wrong {item.progress?.wrongCount}</span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/practice?weak=1" className="mt-3 inline-block font-semibold text-indigo-600">
          Practice Weak Words
        </Link>
      </section>

      <ProgressBar value={accuracy} label="Overall accuracy" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/80 p-4 shadow dark:bg-white/10">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}
