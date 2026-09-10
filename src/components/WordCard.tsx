import type { ReactNode } from "react";
import type { Word } from "../types/word";
import { PronunciationButton } from "./PronunciationButton";

type Props = {
  word: Word;
  onSpeak: () => void;
  speakLabel?: string;
  extra?: ReactNode;
};

export function WordCard({ word, onSpeak, speakLabel, extra }: Props) {
  return (
    <article className="rounded-3xl bg-white/85 p-5 shadow-lg dark:bg-white/10">
      <h2 className="text-3xl font-black">{word.word}</h2>
      <p className="mt-1 text-slate-500 dark:text-slate-300">{word.ipa}</p>
      <p className="text-blue-500">{word.phoneticThai}</p>
      <p className="mt-3 text-lg font-semibold">{word.meaningTh}</p>
      <p className="text-sm text-slate-500 dark:text-slate-300">{word.meaningEn}</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
        {word.partOfSpeech} · {word.level} · {word.category}
      </p>
      <p className="mt-4 font-medium">{word.example}</p>
      <p className="text-sm text-slate-500 dark:text-slate-300">{word.exampleThai}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <PronunciationButton onClick={onSpeak} label={speakLabel} />
        {extra}
      </div>
    </article>
  );
}
