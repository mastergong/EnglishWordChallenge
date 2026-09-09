type Props = {
  onClick: () => void;
  label?: string;
};

export function PronunciationButton({ onClick, label = "Listen" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-2xl border border-rose-200/80 bg-rose-50 px-4 py-2 font-semibold text-rose-500 shadow-sm"
      aria-label="Listen to pronunciation"
    >
      🔊 {label}
    </button>
  );
}
