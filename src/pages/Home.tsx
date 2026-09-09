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

  const hello =
    streak.current >= 3
      ? `เก่งมาก! สตรีค ${streak.current} วันแล้ว มาต่อกันอีกนิดนะ`
      : streak.current > 0
        ? `ยินดีต้อนรับกลับมา วันนี้มาเก็บคำใหม่กันเถอะ`
        : "สวัสดี มาเรียนศัพท์แบบสบาย ๆ ด้วยกันนะ";

  const modes = useMemo(
    () =>
      [
        ["classic", "🌸 เล่นอุ่น ๆ", `${questionCount} ข้อ · ค่อย ๆ เก่งขึ้น`],
        ["challenge", "💪 ท้าทายหน่อย", `${questionCount} ข้อเต็ม ๆ`],
        ["endless", "♾️ เล่นต่อได้เรื่อย", "จนกว่าจะอยากพัก"],
        ["timeAttack", "⏰ แข่งกับนาฬิกา", "สนุกใน 60 วินาที"],
        ["adaptive", "🎯 ปรับตามคุณ", "เน้นคำที่ยังจำไม่แม่น"],
        ["practice", "🧸 ฝึกแบบไม่เร่ง", "ไม่มีจับเวลา"],
      ] as Array<[GameMode, string, string]>,
    [questionCount],
  );

  function start(mode: GameMode) {
    const nextLevel = mode === "adaptive" ? "adaptive" : level;
    navigate(`/game?mode=${mode}&level=${nextLevel}`);
  }

  return (
    <div className="space-y-5">
      <header className="ui-card relative overflow-hidden p-5">
        <div className="pointer-events-none absolute -right-6 -top-8 text-7xl opacity-20" aria-hidden>
          ☁️
        </div>
        <p className="text-sm font-semibold text-rose-400">มุมเรียนศัพท์นุ่ม ๆ</p>
        <h1 className="font-game-display mt-1 text-4xl font-black leading-tight text-rose-600">
          Word
          <span className="block text-pink-400">Challenge</span>
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-rose-700/80 dark:text-rose-100/80">{hello}</p>
      </header>

      <InstallHint />

      <section className="grid grid-cols-2 gap-3">
        <Stat emoji="🔥" label="ไฟต่อเนื่อง" value={`${streak.current} วัน`} />
        <Stat emoji="⭐" label="คะแนนสูงสุด" value={`${stats.bestScore}`} />
        <Stat emoji="📚" label="คำที่เคยเจอ" value={`${stats.wordsLearned}`} />
        <Stat emoji="🎯" label="ความแม่นยำ" value={`${accuracy}%`} />
      </section>

      <Link
        to="/daily"
        className="block overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-amber-300 via-rose-400 to-pink-400 p-5 text-white shadow-[0_8px_0_0_#fb7185]"
      >
        <p className="text-sm font-semibold opacity-90">☀️ ภารกิจวันนี้</p>
        <p className="font-game-display mt-1 text-2xl font-black">10 ข้อน่ารัก ๆ</p>
        <p className="mt-1 text-sm opacity-90">
          {todayState.completed ? "เล่นครบแล้ว เก่งมาก!" : "ยังไม่เล่นวันนี้ มาลองสักนิดนะ"} · สูงสุด {todayState.bestScore}
        </p>
      </Link>

      <section className="ui-card p-4">
        <h2 className="mb-1 font-bold text-rose-700">เลือกเลเวลที่สบายใจ</h2>
        <p className="mb-3 text-xs text-rose-400">เริ่มง่าย ๆ แล้วค่อยยากขึ้นได้</p>
        <LevelSelector
          value={level === "adaptive" ? "A1" : level}
          onChange={setLevel}
          accuracyByLevel={accuracyByLevel}
          lockEnabled={settings.levelLock}
        />
      </section>

      <section className="ui-card p-4">
        <h2 className="mb-1 font-bold text-rose-700">อยากเล่นกี่ข้อ</h2>
        <p className="mb-3 text-xs text-rose-400">น้อยก็ได้ เยอะก็ได้ ตามอารมณ์วันนี้</p>
        <div className="grid grid-cols-5 gap-2">
          {([10, 20, 30, 40, 50] as const).map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => {
                setQuestionCount(count);
                saveSettings({ ...loadSettings(), questionCount: count });
              }}
              className={`text-sm font-bold ${questionCount === count ? "ui-chip-on" : "ui-chip"}`}
            >
              {count}
            </button>
          ))}
        </div>
      </section>

      <button type="button" onClick={() => start("classic")} className="ui-go flex min-h-14 w-full items-center justify-center text-xl">
        เริ่มเรียนกันเลย ✨
      </button>

      <Link to="/map" className="ui-card flex min-h-12 w-full items-center justify-center gap-2 font-bold text-rose-600">
        🗺️ ดูคำที่เสียงคล้ายกัน
      </Link>

      <button
        type="button"
        onClick={() => navigate("/game?mode=adaptive&level=adaptive&weak=1")}
        className="ui-card flex min-h-12 w-full items-center justify-center font-bold text-rose-600"
      >
        💕 ทบทวนคำที่ยังจำไม่แม่น
      </button>

      <div className="grid grid-cols-2 gap-3">
        {modes.map(([mode, title, hint]) => (
          <button key={mode} type="button" onClick={() => start(mode)} className="ui-card min-h-20 p-4 text-left">
            <p className="font-bold text-rose-700">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-rose-400">{hint}</p>
          </button>
        ))}
      </div>

      <section className="ui-card p-4">
        <h2 className="font-bold text-rose-700">คำที่อยากเจออีกครั้ง</h2>
        {weakWords.length === 0 ? (
          <p className="mt-2 text-sm text-rose-400">ยังไม่มีคำที่ต้องทบทวน เริ่มเล่นเกมแล้วจะมีให้ดูที่นี่</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {weakWords.slice(0, 4).map((item) => (
              <li key={item.word.id} className="flex justify-between text-sm">
                <span>💭 {item.word.word}</span>
                <span className="text-rose-400">พลาด {item.progress?.wrongCount} ครั้ง</span>
              </li>
            ))}
          </ul>
        )}
        <Link to="/practice?weak=1" className="mt-3 inline-block font-semibold text-rose-500">
          ไปฝึกแบบนุ่ม ๆ →
        </Link>
      </section>

      <ProgressBar value={accuracy} label="ความแม่นยำโดยรวม" />
    </div>
  );
}

function Stat({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="ui-card p-4">
      <p className="text-xs text-rose-400">
        {emoji} {label}
      </p>
      <p className="font-game-display mt-1 text-xl font-black text-rose-600">{value}</p>
    </div>
  );
}
