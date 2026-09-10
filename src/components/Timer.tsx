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
  const pulse = compact ? "h-11 w-11" : "h-20 w-20";
  const ring = compact
    ? "h-10 w-10 border-blue-100 shadow-md shadow-blue-500/15"
    : "h-16 w-16 border-blue-100 shadow-lg shadow-blue-500/20";
  return (
    <div className="flex justify-center" role="timer" aria-label={`เหลือ ${sec} วินาที`}>
      <div className="relative flex items-center justify-center">
        <div className={`timer-ring-pulse absolute rounded-full bg-blue-400/20 ${pulse}`} />
        <div className={`relative flex items-center justify-center rounded-full border bg-white ${ring}`}>
          <svg className={`-rotate-90 ${compact ? "h-10 w-10" : "h-16 w-16"}`} viewBox={`0 0 ${size} ${size}`} aria-hidden>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#E0E7FF" strokeWidth={stroke} />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#2563EB"
              strokeWidth={stroke}
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - ratio)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`font-game-display font-black leading-none text-blue-600 ${compact ? "text-sm" : "text-xl"}`}>
              {sec}
            </span>
            {compact ? null : <span className="text-[9px] font-bold uppercase leading-none text-blue-400">วิ</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
