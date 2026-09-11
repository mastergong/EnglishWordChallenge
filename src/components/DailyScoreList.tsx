import type { DailyHistoryEntry } from "../types/statistics";
import { formatDailyDate } from "../utils/dailyHistory";

type Props = {
  history: DailyHistoryEntry[];
  today?: string;
  compact?: boolean;
  limit?: number;
};

export function DailyScoreList({ history, today, compact, limit }: Props) {
  const rows = history.slice(0, limit ?? history.length);
  if (!rows.length) {
    return <p className="text-center text-sm text-slate-500">ยังไม่มีคะแนนรายวัน · เล่น Daily แล้วจะบันทึกที่นี่</p>;
  }
  return (
    <ul className={compact ? "space-y-1.5" : "space-y-2"}>
      {rows.map((item) => {
        const isToday = item.date === today;
        return (
          <li
            key={item.date}
            className={`flex items-center justify-between rounded-2xl px-3 py-2 ${
              compact ? "bg-white/80 text-sm dark:bg-white/10" : "bg-white/80 p-3 shadow dark:bg-white/10"
            } ${isToday ? "ring-2 ring-blue-500" : ""}`}
          >
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">
                {formatDailyDate(item.date)}
                {isToday ? " · วันนี้" : ""}
              </p>
              <p className="text-xs text-slate-500">
                {item.correct}/{item.total} ข้อ · {item.accuracy}% · เล่น {item.plays} รอบ
              </p>
            </div>
            <div className="text-right">
              <p className="font-game-display text-lg font-black text-blue-700">{item.bestScore}</p>
              <p className="text-[11px] text-slate-400">ล่าสุด {item.lastScore}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
