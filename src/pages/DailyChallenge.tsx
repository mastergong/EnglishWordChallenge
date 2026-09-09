import { useNavigate } from "react-router-dom";
import { useDailyChallenge } from "../hooks/useDailyChallenge";

export function DailyChallenge() {
  const navigate = useNavigate();
  const { date, todayState, streak } = useDailyChallenge();

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Daily Challenge · โจทย์ประจำวัน</h1>
      <p className="text-slate-500">{date}</p>
      <section className="rounded-3xl bg-blue-600 p-6 text-white shadow-lg">
        <p className="text-sm opacity-80">Today&apos;s Challenge</p>
        <p className="text-3xl font-black">10 Questions</p>
        <p className="mt-2">Best Score {todayState.bestScore}</p>
        <p>🔥 Daily Streak {streak.current} Days</p>
      </section>
      <button
        type="button"
        className="min-h-14 w-full rounded-3xl bg-white/85 text-lg font-black shadow dark:bg-white/10"
        onClick={() => navigate("/game?mode=daily&level=adaptive")}
      >
        {todayState.completed ? "Play Again" : "Start Daily Challenge"}
      </button>
    </div>
  );
}
