import { useNavigate } from "react-router-dom";
import { useDailyChallenge } from "../hooks/useDailyChallenge";

export function DailyChallenge() {
  const navigate = useNavigate();
  const { date, todayState, streak } = useDailyChallenge();

  return (
    <div className="space-y-5">
      <header className="ui-card p-5">
        <p className="text-sm font-semibold text-rose-400">{date}</p>
        <h1 className="font-game-display mt-1 text-3xl font-black text-rose-600">ภารกิจวันนี้</h1>
        <p className="mt-2 text-sm text-rose-500">10 ข้อสั้น ๆ สำหรับอุ่นเครื่องสมอง</p>
      </header>
      <section className="rounded-[1.75rem] bg-gradient-to-br from-amber-300 via-rose-400 to-pink-400 p-6 text-white shadow-[0_8px_0_0_#fb7185]">
        <p className="text-sm font-semibold opacity-90">☀️ Today&apos;s Challenge</p>
        <p className="font-game-display mt-1 text-3xl font-black">10 ข้อน่ารัก ๆ</p>
        <p className="mt-3">คะแนนสูงสุดวันนี้ {todayState.bestScore}</p>
        <p>🔥 ไฟต่อเนื่อง {streak.current} วัน</p>
      </section>
      <button
        type="button"
        className="ui-go min-h-14 w-full text-lg"
        onClick={() => navigate("/game?mode=daily&level=adaptive")}
      >
        {todayState.completed ? "เล่นอีกรอบก็ได้นะ ✨" : "เริ่มภารกิจวันนี้ ☀️"}
      </button>
    </div>
  );
}
