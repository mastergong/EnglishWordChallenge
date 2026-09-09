type Props = {
  value: number;
};

export function Countdown({ value }: Props) {
  const label = value === 0 ? "GO" : String(value);
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="assertive">
      <div className="flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-white text-5xl font-semibold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
        {label}
      </div>
    </div>
  );
}
