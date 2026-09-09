import { Link } from "react-router-dom";
import { ProgressBar } from "../components/ProgressBar";
import { useStatistics } from "../hooks/useStatistics";
import { CEFR_LEVELS } from "../types/word";

export function StatisticsPage() {
  const { stats, accuracy, cefrProgress, weakWords, strongWords } = useStatistics();

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Statistics · สถิติ</h1>
      {stats.totalQuestions === 0 ? (
        <p className="rounded-3xl bg-white/80 p-5 dark:bg-white/10">
          เริ่มเล่นเกมเพื่อสร้างสถิติของคุณ
        </p>
      ) : (
        <section className="grid grid-cols-2 gap-3">
          <Card label="Total Questions" value={stats.totalQuestions} />
          <Card label="Correct" value={stats.correct} />
          <Card label="Wrong" value={stats.wrong} />
          <Card label="Accuracy" value={`${accuracy}%`} />
          <Card label="Best Score" value={stats.bestScore} />
          <Card label="Best Streak" value={stats.bestStreak} />
          <Card label="Words Learned" value={stats.wordsLearned} />
          <Card label="Words Mastered" value={stats.wordsMastered} />
        </section>
      )}

      <section className="space-y-3 rounded-3xl bg-white/80 p-4 dark:bg-white/10">
        <h2 className="font-bold">CEFR progress</h2>
        {CEFR_LEVELS.map((level) => (
          <ProgressBar key={level} label={`${level}    ${cefrProgress[level]}%`} value={cefrProgress[level]} />
        ))}
      </section>

      <section>
        <h2 className="font-bold">Weak Words · ควรทบทวน</h2>
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
        <Link to="/practice?weak=1" className="mt-3 inline-block font-semibold text-indigo-600">
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
        <h2 className="font-bold">Recent Activity</h2>
        {stats.gameHistory.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">ยังไม่มีประวัติ</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {stats.gameHistory.slice(0, 10).map((item) => (
              <li key={item.id} className="rounded-2xl bg-white/80 p-3 dark:bg-white/10">
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
    <div className="rounded-3xl bg-white/80 p-4 shadow dark:bg-white/10">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}
