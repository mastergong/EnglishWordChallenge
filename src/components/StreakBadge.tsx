type Props = {
  streak: number;
};

export function StreakBadge({ streak }: Props) {
  if (streak < 3) return null;
  const label = streak >= 20 ? "20 Streak" : streak >= 10 ? "10 Streak" : streak >= 5 ? "5 Streak" : "3 Streak";
  return (
    <div className="animate-bounce rounded-full bg-orange-500 px-3 py-1 text-sm font-bold text-white">
      🔥 {label}
    </div>
  );
}
