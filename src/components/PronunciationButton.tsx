type Props = {
  onClick: () => void;
  label?: string;
};

export function PronunciationButton({ onClick, label = "Listen" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 font-semibold text-white shadow"
      aria-label="Listen to pronunciation"
    >
      🔊 {label}
    </button>
  );
}
