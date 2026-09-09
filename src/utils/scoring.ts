export function calcTimeBonus(remainingMs: number, totalMs: number): number {
  if (totalMs <= 0) return 0;
  const ratio = Math.max(0, Math.min(1, remainingMs / totalMs));
  return Math.round(50 * ratio);
}

export function calcComboBonus(streakBeforeAnswer: number): number {
  if (streakBeforeAnswer <= 0) return 0;
  if (streakBeforeAnswer >= 20) return 50;
  if (streakBeforeAnswer >= 10) return 35;
  if (streakBeforeAnswer >= 5) return 20;
  if (streakBeforeAnswer >= 3) return 10;
  return 5;
}

export function calcQuestionScore(options: {
  correct: boolean;
  remainingMs: number;
  totalMs: number;
  streakBeforeAnswer: number;
  timed: boolean;
}): { points: number; timeBonus: number; comboBonus: number } {
  if (!options.correct) {
    return { points: 0, timeBonus: 0, comboBonus: 0 };
  }
  const timeBonus = options.timed
    ? calcTimeBonus(options.remainingMs, options.totalMs)
    : 0;
  const comboBonus = calcComboBonus(options.streakBeforeAnswer);
  return {
    points: 100 + timeBonus + comboBonus,
    timeBonus,
    comboBonus,
  };
}

export function calcAccuracy(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}
