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

let playGen = 0;
let letterAudio: HTMLAudioElement | null = null;

export function letterAudioSrc(letter: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}audio/${letter.toLowerCase()}_letter.mp3`;
}

function stopLetterAudio(): void {
  if (!letterAudio) return;
  letterAudio.pause();
  letterAudio.src = "";
  letterAudio = null;
}

function playLetterFile(src: string, gen: number): Promise<void> {
  return new Promise((resolve) => {
    if (typeof Audio === "undefined" || gen !== playGen) {
      resolve();
      return;
    }
    const audio = new Audio(src);
    letterAudio = audio;
    const done = () => {
      if (letterAudio === audio) letterAudio = null;
      resolve();
    };
    audio.addEventListener("ended", done);
    audio.addEventListener("error", done);
    void audio.play().catch(done);
  });
}

export function speakEnglish(text: string, lang: VoiceAccent = "en-US"): void {
  playGen += 1;
  stopLetterAudio();
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    enqueue(text, lang, 0.92);
  } catch {
    /* speech unavailable */
  }
}

/** Play letter clips from /audio, then read the English word. */
export async function speakPracticeWord(word: string, lang: VoiceAccent = "en-US", spell = true): Promise<void> {
  const gen = ++playGen;
  stopLetterAudio();
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
  if (spell) {
    for (const letter of lettersOf(word)) {
      if (gen !== playGen) return;
      await playLetterFile(letterAudioSrc(letter), gen);
    }
  }
  if (gen !== playGen) return;
  try {
    enqueue(word, lang, 0.92);
  } catch {
    /* speech unavailable */
  }
}

export function cancelSpeech(): void {
  playGen += 1;
  stopLetterAudio();
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}
