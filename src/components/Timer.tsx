type Props = {
  remainingMs: number;
  totalMs: number;
  compact?: boolean;
};

export function Timer({ remainingMs, totalMs, compact = false }: Props) {
  const sec = Math.max(0, Math.ceil(remainingMs / 1000));
  const size = compact ? 40 : 64;
  const stroke = compact ? 4 : 5;
  const radius = compact ? 16 : 27;
  const circ = 2 * Math.PI * radius;
  const ratio = totalMs ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  return (
    <div className="flex shrink-0 justify-end" role="timer" aria-label={`เหลือ ${sec} วินาที`}>
      <div className="relative flex items-center justify-center">
        {compact ? null : <div className="timer-ring-pulse absolute h-20 w-20 rounded-full bg-rose-400/20" />}
        <div
          className={`relative flex items-center justify-center rounded-full border border-rose-100 bg-white shadow-md shadow-rose-500/15 ${
            compact ? "h-10 w-10" : "h-16 w-16 shadow-lg shadow-rose-500/20"
          }`}
        >
          <svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#FEE2E2" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#F43F5E"
              strokeWidth={stroke}
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - ratio)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`font-game-display font-black leading-none text-rose-600 ${compact ? "text-sm" : "text-xl"}`}>
              {sec}
            </span>
            <span className={`font-bold uppercase leading-none text-rose-400 ${compact ? "text-[8px]" : "text-[9px]"}`}>วิ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
