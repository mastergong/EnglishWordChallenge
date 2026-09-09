type Props = {
  remainingMs: number;
  totalMs: number;
};

export function Timer({ remainingMs, totalMs }: Props) {
  const sec = Math.max(0, Math.ceil(remainingMs / 1000));
  const size = 64;
  const stroke = 5;
  const radius = 27;
  const circ = 2 * Math.PI * radius;
  const ratio = totalMs ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  return (
    <div className="flex justify-center" role="timer" aria-label={`เหลือ ${sec} วินาที`}>
      <div className="relative flex items-center justify-center">
        <div className="timer-ring-pulse absolute h-20 w-20 rounded-full bg-rose-400/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-rose-100 bg-white shadow-lg shadow-rose-500/20">
          <svg className="-rotate-90 h-16 w-16" viewBox={`0 0 ${size} ${size}`} aria-hidden>
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
            <span className="font-game-display text-xl font-black leading-none text-rose-600">{sec}</span>
            <span className="text-[9px] font-bold uppercase leading-none text-rose-400">วิ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
