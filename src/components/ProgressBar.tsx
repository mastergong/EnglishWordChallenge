type Props = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label ? <p className="mb-1 text-sm text-slate-500 dark:text-slate-300">{label}</p> : null}
      <div
        className="h-3.5 overflow-hidden rounded-full bg-rose-100 p-0.5 dark:bg-white/10"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="relative h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 transition-all" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
