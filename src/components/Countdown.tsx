type Props = {
  value: number;
};

export function Countdown({ value }: Props) {
  const label = value === 0 ? "GO" : String(value);
  return (
    <div className="flex flex-col items-center justify-center" role="status" aria-live="assertive">
      <div className="flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-blue-500 bg-white text-5xl font-black text-blue-700 shadow-lg">
        {label}
      </div>
    </div>
  );
}
