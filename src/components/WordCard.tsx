import type { ReactNode } from "react";
import type { Word } from "../types/word";
import { PronunciationButton } from "./PronunciationButton";

type Props = {
  word: Word;
  onSpeak: () => void;
  extra?: ReactNode;
};

export function WordCard({ word, onSpeak, extra }: Props) {
  return (
    <article className="ui-card p-5">
      <h2 className="text-3xl font-black text-slate-800 dark:text-white">{word.word}</h2>
      <p className="mt-1 text-slate-500">{word.ipa}</p>
      <p className="text-rose-500">{word.phoneticThai}</p>
      <p className="mt-3 text-lg font-semibold">{word.meaningTh}</p>
      <p className="text-sm text-slate-500 dark:text-slate-300">{word.meaningEn}</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
        {word.partOfSpeech} · {word.level} · {word.category}
      </p>
      <p className="mt-4 font-medium">{word.example}</p>
      <p className="text-sm text-slate-500 dark:text-slate-300">{word.exampleThai}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <PronunciationButton onClick={onSpeak} />
        {extra}
      </div>
    </article>
  );
}
