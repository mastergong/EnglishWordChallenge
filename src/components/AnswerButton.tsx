type Props = {
  label: string;
  letter: string;
  selected?: boolean;
  hidden?: boolean;
  state?: "idle" | "correct" | "wrong" | "reveal";
  onClick: () => void;
  disabled?: boolean;
};

export function AnswerButton({ label, letter, selected, hidden, state = "idle", onClick, disabled }: Props) {
  if (hidden) return null;

  const look =
    state === "correct" || state === "reveal"
      ? {
          button: "border-emerald-500 bg-emerald-50 shadow-[0_4px_0_0_#059669]",
          badge: "bg-emerald-500 text-white",
          text: "text-emerald-950",
        }
      : state === "wrong"
        ? {
            button: "border-rose-400 bg-rose-50 shadow-[0_4px_0_0_#fb7185]",
            badge: "bg-rose-400 text-white",
            text: "text-rose-800",
          }
        : selected
          ? {
              button: "border-blue-600 bg-blue-50/90 shadow-[0_4px_0_0_#2563EB] ring-4 ring-blue-500/10",
              badge: "bg-blue-600 text-white shadow-sm",
              text: "text-blue-950",
            }
          : {
              button: "border-slate-200 bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.12)]",
              badge: "bg-slate-100 text-slate-600",
              text: "text-slate-700",
            };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Choice ${letter}: ${label}`}
      aria-pressed={selected}
      className={`group relative flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition-all active:translate-y-1 active:shadow-none ${look.button}`}
    >
      <span
        className={`font-game-display mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${look.badge}`}
      >
        {letter}
      </span>
      <span className={`min-w-0 flex-1 whitespace-normal break-words text-base font-bold leading-snug ${look.text}`}>
        {label}
      </span>
      {selected && state === "idle" ? (
        <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white" aria-hidden>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : null}
    </button>
  );
}
