import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { loadWords } from "../utils/loadWords";
import { buildRhymeFamilies, familyTitle, findFamily, type RhymeFamily } from "../utils/rhymeMap";
import { loadSettings } from "../utils/storage";
import { speakEnglish } from "../utils/speech";
import { displayMeaning } from "../utils/questionGenerator";
import type { Word } from "../types/word";

const SUGGESTIONS = ["ice", "light", "time", "day", "play", "night"];

export function WordMap() {
  const [params] = useSearchParams();
  const settings = loadSettings();
  const words = loadWords();
  const families = useMemo(() => buildRhymeFamilies(words, 2), [words]);
  const [query, setQuery] = useState(params.get("q") || "ice");
  const family = useMemo(() => findFamily(families, query), [families, query]);
  const [activeId, setActiveId] = useState<number | null>(null);

  const chain = family?.words ?? [];
  const selected = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chain.find((item) => item.word.toLowerCase() === q) ?? chain[0];
  }, [chain, query]);

  const related = useMemo(() => {
    if (!selected) return [];
    return chain.filter((item) => item.id !== selected.id);
  }, [chain, selected]);

  const quickGroups = useMemo(() => {
    const spelling = families.filter((item) => /^[a-z']{2,6}$/.test(item.key)).slice(0, 10);
    if (!family) return spelling;
    if (spelling.some((item) => item.key === family.key)) return spelling;
    return [family, ...spelling].slice(0, 10);
  }, [families, family]);

  function hear(word: Word) {
    setActiveId(word.id);
    speakEnglish(word.word, settings.voice);
  }

  function pickGroup(item: RhymeFamily) {
    const first = item.words[0];
    if (!first) return;
    setQuery(first.word);
    setActiveId(first.id);
  }

  if (!family || !selected) {
    return (
      <div className="space-y-4 pt-4">
        <h1 className="text-3xl font-black">คำที่เสียงคล้ายกัน</h1>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveId(null);
          }}
          placeholder="พิมพ์คำ เช่น ice"
          className="min-h-12 w-full rounded-2xl border border-white/50 bg-white px-4 shadow dark:bg-white/10"
        />
        <p className="text-slate-500">ไม่พบกลุ่มคำนี้ ลอง ice, light หรือ time</p>
      </div>
    );
  }

  const title = familyTitle(family);
  const meaning = displayMeaning(selected.meaningTh);
  const highlightId = activeId ?? selected.id;

  return (
    <div className="min-w-0 space-y-4">
      <header>
        <h1 className="text-3xl font-black">คำที่เสียงคล้ายกัน</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
          ค้นหาคำ แล้วดูคำอื่นที่ลงท้ายคล้ายกัน แตะเพื่อฟังเสียง
        </p>
      </header>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">1. ค้นหาคำ</span>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveId(null);
          }}
          placeholder="เช่น ice"
          className="min-h-12 w-full rounded-2xl border border-white/50 bg-white px-4 shadow dark:bg-white/10"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((word) => (
          <button
            key={word}
            type="button"
            onClick={() => {
              setQuery(word);
              setActiveId(null);
            }}
            className={`min-h-10 rounded-full px-3 text-sm font-semibold ${
              query.trim().toLowerCase() === word ? "bg-blue-600 text-white" : "bg-white shadow dark:bg-white/10"
            }`}
          >
            {word}
          </button>
        ))}
      </div>

      <section className="rounded-3xl bg-white p-5 shadow dark:bg-white/10">
        <p className="text-sm font-semibold text-blue-600">2. ฟังคำนี้</p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-game-display text-4xl font-black text-blue-700">{selected.word}</p>
            <p className="mt-1 text-sm text-slate-500">
              {selected.ipa} · {selected.phoneticThai}
            </p>
            <p className="mt-2 text-lg font-semibold">{meaning}</p>
            <p className="mt-1 text-xs text-slate-400">
              {selected.level} · กลุ่ม {title} · {chain.length} คำ
            </p>
          </div>
          <button
            type="button"
            onClick={() => hear(selected)}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl text-white shadow-lg"
            aria-label={`ฟัง ${selected.word}`}
          >
            🔊
          </button>
        </div>
        <Link
          to={`/practice?word=${selected.id}`}
          className="mt-4 flex min-h-11 items-center justify-center rounded-2xl bg-blue-50 font-bold text-blue-700 dark:bg-white/10"
        >
          ฝึกคำนี้
        </Link>
      </section>

      <section>
        <p className="mb-2 text-sm font-semibold">3. คำที่คล้ายกัน · แตะเพื่อฟัง</p>
        {related.length === 0 ? (
          <p className="rounded-2xl bg-white p-4 text-sm text-slate-500 shadow">ยังไม่มีคำอื่นในกลุ่มนี้</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {related.slice(0, 24).map((word) => {
              const on = word.id === highlightId;
              return (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => hear(word)}
                  className={`min-h-11 rounded-2xl px-3 py-2 text-left shadow ${
                    on ? "bg-blue-600 text-white" : "bg-white dark:bg-white/10"
                  }`}
                >
                  <span className={`block font-black ${on ? "text-white" : "text-blue-700"}`}>{word.word}</span>
                  <span className={`block text-xs ${on ? "text-blue-100" : "text-slate-500"}`}>
                    {displayMeaning(word.meaningTh)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {related.length > 24 ? (
          <p className="mt-2 text-xs text-slate-500">และอีก {related.length - 24} คำในรายการด้านล่าง</p>
        ) : null}
      </section>

      <section>
        <p className="mb-2 text-sm font-semibold">กลุ่มยอดนิยม</p>
        <div className="flex flex-wrap gap-2">
          {quickGroups.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => pickGroup(item)}
              className={`min-h-10 rounded-full px-3 text-sm font-semibold ${
                item.key === family.key ? "bg-blue-600 text-white" : "bg-white shadow dark:bg-white/10"
              }`}
            >
              {familyTitle(item)} · {item.words.length}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-4 shadow dark:bg-white/10">
        <h2 className="font-black">คำทั้งหมด · {chain.length} คำ</h2>
        <ul className="mt-3 max-h-[min(40vh,22rem)] space-y-2 overflow-y-auto overscroll-contain">
          {chain.map((word) => {
            const on = word.id === highlightId;
            return (
              <li key={word.id}>
                <button
                  type="button"
                  onClick={() => hear(word)}
                  className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left ${
                    on ? "bg-blue-600 text-white" : "bg-slate-50 dark:bg-white/5"
                  }`}
                >
                  <span>
                    <span className="block font-black">{word.word}</span>
                    <span className={`block text-xs ${on ? "text-blue-100" : "text-slate-500"}`}>
                      {word.ipa} · {word.phoneticThai}
                    </span>
                  </span>
                  <span className={`max-w-[50%] text-right text-sm font-semibold ${on ? "text-white" : "text-slate-700"}`}>
                    {displayMeaning(word.meaningTh)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
