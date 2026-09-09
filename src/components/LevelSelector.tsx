import type { CEFRLevel } from "../types/word";
import { CEFR_LEVELS } from "../types/word";
import { isLevelUnlocked, levelMeta } from "../utils/levels";

type Props = {
  value: CEFRLevel | "adaptive";
  onChange: (level: CEFRLevel | "adaptive") => void;
  accuracyByLevel: Partial<Record<CEFRLevel, number>>;
  lockEnabled: boolean;
};

export function LevelSelector({ value, onChange, accuracyByLevel, lockEnabled }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {CEFR_LEVELS.map((level) => {
        const unlocked = isLevelUnlocked(level, accuracyByLevel, lockEnabled);
        const meta = levelMeta(level);
        return (
          <button
            key={level}
            type="button"
            disabled={!unlocked}
            onClick={() => onChange(level)}
            className={`min-h-11 rounded-2xl border px-2 py-3 text-sm font-bold ${
              value === level
                ? "border-indigo-500 bg-indigo-600 text-white"
                : "border-white/50 bg-white/70 dark:bg-white/10"
            } disabled:opacity-40`}
            aria-pressed={value === level}
            aria-label={`${level} ${meta.en}`}
          >
            {level}
            <span className="mt-1 block text-[11px] font-medium opacity-80">{meta.th}</span>
          </button>
        );
      })}
    </div>
  );
}
