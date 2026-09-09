import type { QuizQuestion } from "../types/game";
import { posLabelTh } from "../data/categoryLabels";

type Props = {
  question: QuizQuestion;
  showHint?: boolean;
  onSpeak: () => void;
};

export function QuizCard({ question, showHint, onSpeak }: Props) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-white bg-white/95 p-4 shadow-lg shadow-rose-950/5">
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-rose-100/50" />
      <div className="relative flex items-start justify-between gap-2">
        <button type="button" className="min-w-0 flex-1 text-left" onClick={onSpeak}>
          <h1 className="break-words text-xl font-bold leading-snug text-slate-800">
            <HighlightedText text={question.prompt} highlight={question.highlight} />
          </h1>
        </button>
        <button
          type="button"
          onClick={onSpeak}
          aria-label="ฟังการออกเสียง"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-200/80 bg-rose-50 text-rose-500 shadow-sm"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" aria-hidden>
            <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-2.5 9.77l-4.5-4H3v6h4l4.5 4v-6zm5-2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </button>
      </div>
      <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <span className="max-w-full break-all rounded-full bg-rose-50 px-2.5 py-1 font-mono text-xs font-bold text-rose-500">
          {question.ipa}
        </span>
        <span className="text-xs font-medium text-slate-500">{posLabelTh(question.partOfSpeech ?? "")}</span>
      </div>
      {showHint ? (
        <p className="mt-3 text-sm font-medium text-rose-600">💡 {question.exampleThai || question.example}</p>
      ) : null}
    </article>
  );
}

function HighlightedText({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return <>{text}</>;
  const wrapped = text.includes(`«${highlight}»`) ? `«${highlight}»` : highlight;
  const parts = text.split(wrapped);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? (
            <span className="font-game-display break-all text-2xl font-extrabold tracking-wide text-rose-600 underline decoration-rose-300 decoration-wavy underline-offset-4">
              {wrapped.startsWith("«") ? wrapped : highlight}
            </span>
          ) : null}
        </span>
      ))}
    </>
  );
}
