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
            value === item ? "ui-chip-on" : "ui-chip"
          }`}
          aria-pressed={value === item}
          onClick={() => onChange(item)}
        >
          {item === "light" ? "สว่าง" : item === "dark" ? "มืดนุ่ม" : "ตามเครื่อง"}
        </button>
      ))}
    </div>
  );
}
