import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MindMapCanvas } from "../components/MindMapCanvas";
import { loadWords } from "../utils/loadWords";
import { buildRhymeFamilies, findFamily, type RhymeFamily } from "../utils/rhymeMap";
import { loadSettings } from "../utils/storage";
import { speakEnglish } from "../utils/speech";
import type { Word } from "../types/word";

export function WordMap() {
  const [params] = useSearchParams();
  const settings = loadSettings();
  const words = loadWords();
  const families = useMemo(() => buildRhymeFamilies(words, 2), [words]);
  const initialQuery = params.get("q") || "ice";
  const [query, setQuery] = useState(initialQuery);
  const family = useMemo(() => findFamily(families, query) ?? families[0], [families, query]);
  const [activeId, setActiveId] = useState<number | null>(null);

  const chain = family?.words ?? [];
  const center = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chain.find((item) => item.word.toLowerCase() === q) ?? chain[0];
  }, [chain, query]);
  const mapWords = useMemo(() => {
    if (!center) return [];
    const rest = chain.filter((item) => item.id !== center.id).slice(0, 6);
    return [center, ...rest];
  }, [chain, center]);

  function selectWord(word: Word) {
    setActiveId(word.id);
    speakEnglish(word.word, settings.voice);
  }

  function pickFamily(item: RhymeFamily) {
    setQuery(item.words[0]?.word ?? item.key);
    setActiveId(null);
  }

  if (!family || !center) {
    return <p className="pt-10 text-center">ยังไม่มีกลุ่มคำสำหรับ mind map</p>;
  }

  return (
    <div className="min-w-0 space-y-3 overflow-x-hidden">
      <header>
        <h1 className="text-2xl font-black">Mind Map · แผนที่คำศัพท์</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
          ice → rice → price · แตะการ์ดหรือรายการเพื่อฟังเสียง
        </p>
      </header>

      <label className="block">
        <span className="sr-only">ค้นหาคำ</span>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveId(null);
          }}
          placeholder="ค้นหา เช่น ice"
          className="min-h-11 w-full rounded-2xl border border-white/50 bg-white/90 px-4 dark:bg-white/10"
        />
      </label>

      <section className="min-w-0">
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-300">
          กลุ่มเสียงลงท้ายเดียวกัน · ตัวเลขคือจำนวนคำในกลุ่ม · ปัดแถบแล้วแตะกลุ่มที่ต้องการ
        </p>
        <div
          className="flex w-full min-w-0 max-w-full flex-nowrap gap-2 overflow-x-auto overflow-y-hidden pb-2"
          style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" }}
        >
          {families.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => pickFamily(item)}
              aria-pressed={item.key === family.key}
              aria-label={`กลุ่มเสียง ${item.label} มี ${item.words.length} คำ`}
              className={`min-h-10 shrink-0 rounded-full px-3 text-sm font-semibold ${
                item.key === family.key ? "bg-blue-600 text-white" : "bg-white/80 dark:bg-white/10"
              }`}
            >
              {item.label} · {item.words.length} คำ
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[#1e1b4b] p-2">
        <p className="px-2 pb-1 text-center text-[11px] text-blue-200">
          แผนที่ตัวอย่าง {mapWords.length} คำ · ลากเพื่อเลื่อนดู
        </p>
        <MindMapCanvas words={mapWords} activeId={activeId ?? center.id} onSelect={selectWord} />
      </section>

      <section className="rounded-3xl bg-white/80 p-3 shadow dark:bg-white/10">
        <h2 className="text-base font-black">
          คำทั้งหมดในกลุ่ม {family.label} · {chain.length} คำ
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">เลื่อนรายการด้านล่างเพื่อดูครบทุกคำ แตะเพื่อฟังเสียง</p>
        <ul className="mt-3 max-h-[min(50vh,24rem)] space-y-2 overflow-y-auto overscroll-contain pr-1">
          {chain.map((word) => {
            const meaning = word.meaningTh.split("/")[0]?.trim() ?? word.meaningTh;
            const active = word.id === (activeId ?? center.id);
            return (
              <li key={word.id}>
                <button
                  type="button"
                  onClick={() => selectWord(word)}
                  aria-label={`${word.word} ${word.phoneticThai} ${meaning}`}
                  className={`flex min-h-12 w-full items-start justify-between gap-3 rounded-2xl px-3 py-2 text-left ${
                    active ? "bg-blue-600 text-white" : "bg-white/90 dark:bg-white/5"
                  }`}
                >
                  <span>
                    <span className="block font-black">{word.word}</span>
                    <span className={`block text-xs ${active ? "text-blue-100" : "text-sky-600 dark:text-sky-300"}`}>
                      {word.ipa} · {word.phoneticThai}
                    </span>
                  </span>
                  <span className={`max-w-[55%] text-right text-sm font-semibold ${active ? "text-white" : ""}`}>
                    {meaning}
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
