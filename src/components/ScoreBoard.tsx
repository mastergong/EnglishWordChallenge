type Props = {
  score: number;
  streak: number;
};

export function ScoreBoard({ score, streak }: Props) {
  return (
    <div className="flex items-center justify-between text-sm font-semibold">
      <span aria-label={`Streak ${streak}`}>🔥 Streak {streak}</span>
      <span aria-label={`Score ${score}`}>Score {score}</span>
    </div>
  );
}
