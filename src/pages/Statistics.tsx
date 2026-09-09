import { Link } from "react-router-dom";
import { ProgressBar } from "../components/ProgressBar";
import { useStatistics } from "../hooks/useStatistics";
import { CEFR_LEVELS } from "../types/word";

export function StatisticsPage() {
  const { stats, accuracy, cefrProgress, weakWords, strongWords } = useStatistics();

  return (
    <div className="space-y-5">
      <h1 className="font-game-display text-3xl font-black text-rose-600">ความก้าวหน้าของเรา</h1>
      {stats.totalQuestions === 0 ? (
        <p className="ui-card p-5 text-rose-500">
          เริ่มเล่นเกมสักรอบ แล้วสถิติจะโผล่มาให้เชียร์ตัวเอง
        </p>
      ) : (
        <section className="grid grid-cols-2 gap-3">
          <Card label="ข้อที่เล่นแล้ว" value={stats.totalQuestions} />
          <Card label="ถูก" value={stats.correct} />
          <Card label="ยังไม่ถูก" value={stats.wrong} />
          <Card label="ความแม่นยำ" value={`${accuracy}%`} />
          <Card label="คะแนนสูงสุด" value={stats.bestScore} />
          <Card label="สตรีคยาวสุด" value={stats.bestStreak} />
          <Card label="คำที่เคยเจอ" value={stats.wordsLearned} />
          <Card label="คำที่แม่นแล้ว" value={stats.wordsMastered} />
        </section>
      )}

      <section className="space-y-3 ui-card p-4">
        <h2 className="font-bold text-rose-700">ความก้าวหน้าระดับ CEFR</h2>
        {CEFR_LEVELS.map((level) => (
          <ProgressBar key={level} label={`${level}    ${cefrProgress[level]}%`} value={cefrProgress[level]} />
        ))}
      </section>

      <section>
        <h2 className="font-bold text-rose-700">คำที่อยากเจออีกครั้ง</h2>
        {weakWords.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">ยังไม่มีคำอ่อน</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {weakWords.slice(0, 12).map((item) => (
              <li key={item.word.id}>
                ❌ {item.word.word} · Wrong {item.progress?.wrongCount} times
              </li>
            ))}
          </ul>
        )}
        <Link to="/practice?weak=1" className="mt-3 inline-block font-semibold text-rose-600">
          Practice Weak Words
        </Link>
      </section>

      <section>
        <h2 className="font-bold">Strong Words</h2>
        {strongWords.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">ยังไม่มีคำที่ master</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {strongWords.slice(0, 12).map((item) => (
              <li key={item.word.id}>
                ⭐ {item.word.word} · {item.progress?.mastery}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-bold text-rose-700">รอบที่เพิ่งเล่น</h2>
        {stats.gameHistory.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">ยังไม่มีประวัติ</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {stats.gameHistory.slice(0, 10).map((item) => (
              <li key={item.id} className="ui-card p-3">
                {item.mode} · {item.level} · {item.score} pts · {item.accuracy}%
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="ui-card p-4">
      <p className="text-xs text-rose-400">{label}</p>
      <p className="font-game-display text-2xl font-black text-rose-600">{value}</p>
    </div>
  );
}
