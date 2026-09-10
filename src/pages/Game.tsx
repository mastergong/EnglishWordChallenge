import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnswerButton } from "../components/AnswerButton";
import { QuizCard } from "../components/QuizCard";
import { Timer } from "../components/Timer";
import { persistLastResult, useQuiz } from "../hooks/useQuiz";
import { useSpeech } from "../hooks/useSpeech";
import { useDailyChallenge } from "../hooks/useDailyChallenge";
import { loadSettings } from "../utils/storage";
import { playSfx } from "../utils/sfx";
import { categoryLabelTh } from "../data/categoryLabels";
import { displayMeaning } from "../utils/questionGenerator";
import type { GameMode } from "../types/game";
import type { CEFRLevel } from "../types/word";

const LETTERS = ["A", "B", "C", "D"];

export function Game() {
  const [params] = useSearchParams();
  return <GamePlay key={params.toString()} />;
}

function GamePlay() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const settings = loadSettings();
  const mode = (params.get("mode") as GameMode) || "classic";
  const level = (params.get("level") as CEFRLevel | "adaptive") || "A1";
  const daily = useDailyChallenge();
  const quiz = useQuiz({
    mode,
    level,
    questions: mode === "daily" ? daily.questions : undefined,
    preferWeak: params.get("weak") === "1",
  });
  const { speak, stop } = useSpeech(settings.speech, settings.voice);

  const [phase, setPhase] = useState<"question" | "feedback">("question");
  const [locked, setLocked] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [fiftyUsed, setFiftyUsed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [skipUsed, setSkipUsed] = useState(false);
  const [round, setRound] = useState(0);
  const [remainingMs, setRemainingMs] = useState(
    mode === "timeAttack" ? 60_000 : settings.questionTimeSec * 1000,
  );
  const expireGuard = useRef(false);

  const totalMs = mode === "timeAttack" ? 60_000 : settings.questionTimeSec * 1000;
  const timed = mode !== "practice";

  useEffect(() => {
    if (phase !== "question" || !timed) return undefined;
    const start = Date.now();
    const budget = mode === "timeAttack" ? remainingMs : totalMs;
    const id = window.setInterval(() => {
      const next = Math.max(0, budget - (Date.now() - start));
      setRemainingMs(next);
      if (next <= 0 && !expireGuard.current) {
        expireGuard.current = true;
        void finishChoice(null, true);
      }
    }, 50);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round, quiz.index, mode, totalMs, timed]);

  useEffect(() => {
    if (phase === "question" && settings.autoPronounce && quiz.current) {
      speak(quiz.current.speakText);
    }
    return () => stop();
  }, [phase, quiz.current, settings.autoPronounce, speak, stop]);

  async function finishChoice(choiceId: string | null, timeout = false) {
    if (locked || !quiz.current) return;
    setLocked(true);
    setPicked(choiceId);
    const leftover = remainingMs;
    const outcome = quiz.answer(choiceId, leftover, timeout);
    if (!outcome) return;
    if (outcome.result.outcome === "correct") void playSfx("correct", settings.sound);
    if (outcome.result.outcome === "wrong") void playSfx("wrong", settings.sound);
    if (outcome.result.outcome === "timeout") void playSfx("timeout", settings.sound);
    setPhase("feedback");
    if (outcome.done && outcome.summary) {
      persistLastResult(outcome.summary);
      if (mode === "daily") daily.complete(outcome.summary.score);
      window.setTimeout(() => {
        void playSfx("complete", settings.sound);
        navigate("/result");
      }, 1400);
      return;
    }
    if (settings.autoNext) {
      window.setTimeout(() => advance(), 1400);
    }
  }

  function advance() {
    quiz.next();
    setLocked(false);
    setPicked(null);
    setHiddenIds([]);
    setShowHint(false);
    setRemainingMs(totalMs);
    expireGuard.current = false;
    setPhase("question");
    setRound((r) => r + 1);
  }

  function useFiftyFifty() {
    if (fiftyUsed || phase !== "question" || !quiz.current) return;
    const wrong = quiz.current.choices.filter((choice) => !choice.isCorrect).map((choice) => choice.id);
    const drop = wrong.slice(0, 2);
    setHiddenIds(drop);
    if (picked && drop.includes(picked)) setPicked(null);
    setFiftyUsed(true);
  }

  if (!quiz.current) {
    return <p className="pt-20 text-center">ไม่พบคำศัพท์เพียงพอสำหรับโหมดนี้</p>;
  }

  const last = quiz.results[quiz.results.length - 1];
  const display = quiz.current;
  const questionNo = quiz.index + 1;
  const total = quiz.questions.length;
  const percent = Math.round((questionNo / total) * 100);

  return (
    <div className="font-game relative mx-auto flex h-dvh max-w-[420px] flex-col overflow-hidden bg-gradient-to-b from-[#EFF6FF] via-[#F0F9FF] to-[#DBEAFE] text-slate-800">
      <div className="game-blob pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-blue-300/40" />
      <div className="game-blob pointer-events-none absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-sky-300/35" />
      <div className="game-blob pointer-events-none absolute -bottom-10 left-10 h-64 w-64 rounded-full bg-sky-200/50" />

      <header className="relative z-10 shrink-0 px-5 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Link
            to="/"
            aria-label="ออกจากการทดสอบ"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/60 bg-white/80 text-slate-600 shadow-sm"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1 px-1">
            <div className="mb-1.5 flex items-center justify-between px-0.5 text-xs font-bold text-slate-500">
              <span className="font-game-display text-blue-600">
                คำถามที่ {questionNo}/{total}
              </span>
              <span className="text-slate-400">{percent}%</span>
            </div>
            <div className="h-3.5 overflow-hidden rounded-full bg-slate-200/80 p-0.5 shadow-inner">
              <div
                className="relative h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700 transition-all duration-500"
                style={{ width: `${percent}%` }}
              >
                <div className="absolute right-1 top-0.5 h-1 w-2 rounded-full bg-white/60" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5">
            <span className="text-base">🔥</span>
            <span className="font-game-display text-xs font-extrabold text-amber-700">{quiz.streak}</span>
          </div>
          <div className="flex items-center gap-1 rounded-2xl border border-sky-500/30 bg-sky-500/10 px-2.5 py-1.5">
            <span className="text-sm">💎</span>
            <span className="font-game-display text-xs font-extrabold text-sky-700">{quiz.score}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/80 px-3 py-1 text-xs font-bold tracking-wide text-blue-700 shadow-sm">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-blue-500" />
            <span className="truncate">
              {display.level} • หมวด{categoryLabelTh(display.category)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {quiz.streak > 0 ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <svg className="h-3.5 w-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                คะแนน x2
              </span>
            ) : null}
            {timed ? (
              <Timer remainingMs={phase === "question" ? remainingMs : 0} totalMs={totalMs} compact />
            ) : null}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-5 py-2">
        <div className="shrink-0">
          <QuizCard question={display} showHint={showHint} onSpeak={() => speak(display.speakText)} />
        </div>

        <section
          aria-label="ตัวเลือกคำตอบ"
          className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain pb-1"
        >
          {display.choices.map((choice, idx) => {
            let state: "idle" | "correct" | "wrong" | "reveal" = "idle";
            if (phase === "feedback" && last) {
              if (choice.isCorrect) state = picked === choice.id ? "correct" : "reveal";
              else if (picked === choice.id) state = "wrong";
            }
            return (
              <AnswerButton
                key={choice.id}
                letter={LETTERS[idx] ?? "?"}
                label={choice.label}
                selected={picked === choice.id}
                hidden={hiddenIds.includes(choice.id)}
                state={state}
                disabled={phase !== "question"}
                onClick={() => {
                  if (settings.confirmSubmit) setPicked(choice.id);
                  else void finishChoice(choice.id);
                }}
              />
            );
          })}
          {phase === "feedback" && last ? (
            <p className="px-1 pb-1 text-center text-sm font-bold" aria-live="polite">
              {last.outcome === "correct" ? "✓ ถูกต้อง" : last.outcome === "timeout" ? "⌛ หมดเวลา / ข้าม" : "✗ ยังไม่ถูก"}{" "}
              · {displayMeaning(last.question.meaningTh)}
            </p>
          ) : null}
        </section>
      </main>

      <footer className="relative z-10 shrink-0 border-t border-slate-200/70 bg-white/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-2xl backdrop-blur-md">
        <div className="mb-2 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={fiftyUsed || phase !== "question"}
            onClick={useFiftyFifty}
            className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40"
          >
            <span className="font-game-display text-blue-600">⚡</span>
            50:50
          </button>
          <button
            type="button"
            disabled={hintUsed || phase !== "question"}
            onClick={() => {
              setShowHint(true);
              setHintUsed(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200/60 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 disabled:opacity-40"
          >
            <span>💡</span>
            คำใบ้
          </button>
          <button
            type="button"
            disabled={skipUsed || phase !== "question"}
            onClick={() => {
              setSkipUsed(true);
              void finishChoice(null, true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40"
          >
            <span>⏭️</span>
            ข้าม
          </button>
        </div>
        {phase === "feedback" && !settings.autoNext && !quiz.finished ? (
          <button
            type="button"
            onClick={advance}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-lg font-extrabold tracking-wide text-white shadow-[0_5px_0_0_#047857] active:translate-y-1 active:shadow-none"
          >
            ข้อถัดไป
          </button>
        ) : settings.confirmSubmit ? (
          <button
            type="button"
            disabled={phase !== "question" || !picked}
            onClick={() => void finishChoice(picked)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-lg font-extrabold tracking-wide text-white shadow-[0_5px_0_0_#047857] disabled:opacity-40 active:translate-y-1 active:shadow-none"
          >
            ส่งคำตอบ (Submit)
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
        <div className="mx-auto mb-0.5 mt-2 h-1 w-32 rounded-full bg-slate-300" />
      </footer>
    </div>
  );
}
