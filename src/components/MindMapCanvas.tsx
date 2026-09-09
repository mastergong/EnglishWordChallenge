import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Word } from "../types/word";

type Props = {
  words: Word[];
  activeId: number;
  onSelect: (word: Word) => void;
};

const CARD_W = 108;
const CARD_H = 108;
const GAP = 44;
const PAD = 28;

export function MindMapCanvas({ words, activeId, onSelect }: Props) {
  const center = words[0];
  const viewportRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ scrollX: number; scrollY: number; pointerX: number; pointerY: number } | null>(null);
  const [panning, setPanning] = useState(false);

  const others = words.slice(1, 7);
  const radius = CARD_W / 2 + CARD_H / 2 + GAP;
  const width = Math.ceil(radius * 2 + CARD_W + PAD * 2);
  const height = Math.ceil(radius * 2 + CARD_H + PAD * 2);
  const cx = width / 2;
  const cy = height / 2;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollLeft = Math.max(0, (width - el.clientWidth) / 2);
    el.scrollTop = Math.max(0, (height - el.clientHeight) / 2);
  }, [width, height, center?.id]);

  if (!center) return null;

  const nodes = others.map((word, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / Math.max(others.length, 1);
    return {
      word,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    };
  });

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const el = viewportRef.current;
    if (!el) return;
    drag.current = {
      scrollX: el.scrollLeft,
      scrollY: el.scrollTop,
      pointerX: event.clientX,
      pointerY: event.clientY,
    };
    el.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = viewportRef.current;
    const start = drag.current;
    if (!el || !start) return;
    const dx = event.clientX - start.pointerX;
    const dy = event.clientY - start.pointerY;
    if (Math.abs(dx) + Math.abs(dy) > 6) setPanning(true);
    el.scrollLeft = start.scrollX - dx;
    el.scrollTop = start.scrollY - dy;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    drag.current = null;
    setPanning(false);
    viewportRef.current?.releasePointerCapture(event.pointerId);
  }

  return (
    <div
      ref={viewportRef}
      className={`h-[min(46vh,20rem)] w-full overflow-auto overscroll-contain rounded-2xl ${
        panning ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ touchAction: "pan-x pan-y", WebkitOverflowScrolling: "touch" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="relative" style={{ width, height }}>
        <svg className="pointer-events-none absolute inset-0" width={width} height={height} aria-hidden>
          {nodes.map((node) => (
            <line
              key={node.word.id}
              x1={cx}
              y1={cy}
              x2={node.x}
              y2={node.y}
              stroke="#fb7185"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
        </svg>

        {nodes.map((node) => (
          <NodeCard
            key={node.word.id}
            word={node.word}
            x={node.x}
            y={node.y}
            active={node.word.id === activeId}
            onSelect={() => onSelect(node.word)}
          />
        ))}
        <NodeCard word={center} x={cx} y={cy} active={center.id === activeId} onSelect={() => onSelect(center)} />
      </div>
    </div>
  );
}

function NodeCard({
  word,
  x,
  y,
  active,
  onSelect,
}: {
  word: Word;
  x: number;
  y: number;
  active?: boolean;
  onSelect: () => void;
}) {
  const meaning = word.meaningTh.split("/")[0]?.trim() ?? word.meaningTh;
  return (
    <button
      type="button"
      onClick={onSelect}
      onPointerDown={(event) => event.stopPropagation()}
      aria-label={`${word.word} ${word.phoneticThai} ${meaning}`}
      className={`absolute z-10 rounded-2xl px-2 py-2 text-center shadow-xl ${
        active ? "z-20 bg-rose-400 text-white ring-4 ring-rose-200" : "border border-rose-100 bg-white text-slate-800"
      }`}
      style={{
        left: x,
        top: y,
        width: CARD_W,
        minHeight: CARD_H,
        transform: "translate(-50%, -50%)",
      }}
    >
      <p className="text-sm font-black leading-tight">{word.word}</p>
      <p className={`mt-1 text-[11px] leading-tight ${active ? "text-rose-50" : "text-rose-400"}`}>{word.ipa}</p>
      <p className={`text-[11px] leading-tight ${active ? "text-white/80" : "text-slate-500"}`}>{word.phoneticThai}</p>
      <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-snug">{meaning}</p>
    </button>
  );
}
