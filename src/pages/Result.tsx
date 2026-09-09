import { Link } from "react-router-dom";
import { readLastResult } from "../hooks/useQuiz";
import { loadWords } from "../utils/loadWords";
import { PronunciationButton } from "../components/PronunciationButton";
import { speakEnglish } from "../utils/speech";
import { loadSettings } from "../utils/storage";

export function Result() {
  const result = readLastResult();
  const words = loadWords();
  const settings = loadSettings();

  if (!result) {
    return (
      <div className="space-y-4 pt-10 text-center">
        <p>ยังไม่มีผลล่าสุด</p>
        <Link to="/" className="font-bold text-blue-600">
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  const wrong = result.results.filter((item) => item.outcome !== "correct");

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-black">🎉 Great Job!</h1>
      <section className="grid grid-cols-2 gap-3">
        <Card label="Score" value={String(result.score)} />
        <Card label="Correct" value={`${result.correct} / ${result.total}`} />
        <Card label="Accuracy" value={`${result.accuracy}%`} />
        <Card label="Avg Time" value={`${(result.averageTimeMs / 1000).toFixed(1)} sec`} />
        <Card label="Best Streak" value={String(result.bestStreak)} />
        <Card label="Level" value={String(result.level)} />
      </section>
      <section>
        <h2 className="mb-2 font-bold">Words to Review · ควรทบทวน</h2>
        {wrong.length === 0 ? (
          <p className="text-sm text-slate-500">ไม่มีคำผิดในรอบนี้</p>
        ) : (
          <ul className="space-y-3">
            {wrong.map((item) => {
              const word = words.find((entry) => entry.id === item.question.wordId);
              return (
                <li key={item.question.id} className="rounded-3xl bg-white/80 p-4 dark:bg-white/10">
                  <Link to={`/practice?word=${item.question.wordId}`} className="font-black">
                    {item.question.targetWord}
                  </Link>
                  <p className="text-sm">{item.question.ipa} · {item.question.meaningTh}</p>
                  {word ? (
                    <PronunciationButton
                      onClick={() => settings.speech && speakEnglish(word.word, settings.voice)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <Link
        to="/"
        className="flex min-h-12 items-center justify-center rounded-3xl bg-blue-600 font-bold text-white"
      >
        Home
      </Link>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/80 p-4 shadow dark:bg-white/10">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}
