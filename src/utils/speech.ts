import type { VoiceAccent } from "../types/game";

const THAI_LETTER: Record<string, string> = {
  A: "เอ",
  B: "บี",
  C: "ซี",
  D: "ดี",
  E: "อี",
  F: "เอฟ",
  G: "จี",
  H: "เอช",
  I: "ไอ",
  J: "เจ",
  K: "เค",
  L: "เอล",
  M: "เอ็ม",
  N: "เอ็น",
  O: "โอ",
  P: "พี",
  Q: "คิว",
  R: "อาร์",
  S: "เอส",
  T: "ที",
  U: "ยู",
  V: "วี",
  W: "ดับเบิลยู",
  X: "เอ็กซ์",
  Y: "วาย",
  Z: "แซด",
};

export function lettersOf(word: string): string[] {
  return [...word.toUpperCase()].filter((ch) => /[A-Z]/.test(ch));
}

export function spellingGuide(word: string): Array<{ letter: string; thai: string }> {
  return lettersOf(word).map((letter) => ({ letter, thai: THAI_LETTER[letter] ?? letter }));
}

function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const lower = lang.toLowerCase();
  return voices.find((voice) => voice.lang.toLowerCase().startsWith(lower)) ?? voices.find((voice) => voice.lang.toLowerCase().startsWith(lower.slice(0, 2)));
}

function enqueue(text: string, lang: string, rate: number): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  const preferred = pickVoice(window.speechSynthesis.getVoices(), lang);
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

export function speakEnglish(text: string, lang: VoiceAccent = "en-US"): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    enqueue(text, lang, 0.92);
  } catch {
    /* speech unavailable */
  }
}

/** Spell letters in Thai names, then read the English word. */
export function speakPracticeWord(word: string, lang: VoiceAccent = "en-US", spell = true): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    if (spell) {
      const guide = spellingGuide(word);
      if (guide.length) {
        const voices = window.speechSynthesis.getVoices();
        const thaiVoice = pickVoice(voices, "th-TH");
        if (thaiVoice) {
          enqueue(guide.map((item) => item.thai).join(" "), "th-TH", 0.82);
        } else {
          enqueue(guide.map((item) => item.letter).join(", "), lang, 0.72);
        }
      }
    }
    enqueue(word, lang, 0.92);
  } catch {
    /* speech unavailable */
  }
}

export function cancelSpeech(): void {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}
