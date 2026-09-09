import type { ThemePreference } from "../types/game";

type Props = {
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
};

export function ThemeToggle({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme">
      {(["light", "dark", "system"] as const).map((item) => (
        <button
          key={item}
          type="button"
          className={`min-h-11 rounded-2xl border px-3 py-2 text-sm font-semibold capitalize ${
            value === item ? "bg-blue-600 text-white" : "bg-white/70 dark:bg-white/10"
          }`}
          aria-pressed={value === item}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
