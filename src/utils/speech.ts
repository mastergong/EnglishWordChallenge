import type { QuizSpeakLang, VoiceAccent } from "../types/game";

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
let audioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
const bufferCache = new Map<string, AudioBuffer>();

export function letterAudioSrc(letter: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}audio/${letter.toLowerCase()}_letter.mp3`;
}

export function letterAudioReady(): boolean {
  return Boolean(audioCtx && audioCtx.state === "running");
}

function stopLetterAudio(): void {
  try {
    currentSource?.stop();
  } catch {
    /* already stopped */
  }
  currentSource = null;
  if (!letterAudio) return;
  letterAudio.pause();
  letterAudio.removeAttribute("src");
  letterAudio.load();
  letterAudio = null;
}

async function getAudioContext(): Promise<AudioContext | null> {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") await audioCtx.resume();
  return audioCtx;
}

async function loadLetterBuffer(letter: string): Promise<AudioBuffer> {
  const cached = bufferCache.get(letter);
  if (cached) return cached;
  const ctx = await getAudioContext();
  if (!ctx) throw new Error("no-audio-context");
  const response = await fetch(letterAudioSrc(letter));
  if (!response.ok) throw new Error("missing-letter");
  const buffer = await ctx.decodeAudioData(await response.arrayBuffer());
  bufferCache.set(letter, buffer);
  return buffer;
}

function playBuffer(buffer: AudioBuffer, gen: number): Promise<void> {
  return new Promise((resolve, reject) => {
    void getAudioContext().then((ctx) => {
      if (!ctx || gen !== playGen) {
        resolve();
        return;
      }
      const source = ctx.createBufferSource();
      currentSource = source;
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => {
        if (currentSource === source) currentSource = null;
        resolve();
      };
      try {
        source.start();
      } catch (error) {
        reject(error);
      }
    });
  });
}

function playLetterElement(src: string, gen: number): Promise<void> {
  return new Promise((resolve) => {
    if (typeof Audio === "undefined" || gen !== playGen) {
      resolve();
      return;
    }
    const audio = new Audio(src);
    audio.preload = "auto";
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

async function playOneLetter(letter: string, gen: number): Promise<void> {
  try {
    const buffer = await loadLetterBuffer(letter);
    if (gen !== playGen) return;
    await playBuffer(buffer, gen);
  } catch {
    await playLetterElement(letterAudioSrc(letter), gen);
  }
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

export function quizSpeechParts(
  lang: QuizSpeakLang,
  english: string,
  thai: string,
  allowEnglish: boolean,
): { english?: string; thai?: string } {
  const en = allowEnglish ? english.trim() : "";
  const th = thai.trim();
  if (lang === "en") return en ? { english: en } : {};
  if (lang === "th") return th ? { thai: th } : {};
  return {
    ...(en ? { english: en } : {}),
    ...(th ? { thai: th } : {}),
  };
}

export function choiceSpeechParts(label: string): { english?: string; thai?: string } {
  const text = label.trim();
  if (!text) return {};
  if (/[\u0E00-\u0E7F]/.test(text)) return { thai: text };
  return { english: text };
}

export function speakQuizAudio(
  parts: { english?: string; thai?: string },
  voice: VoiceAccent = "en-US",
): void {
  playGen += 1;
  stopLetterAudio();
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (!parts.english && !parts.thai) return;
  try {
    window.speechSynthesis.cancel();
    if (parts.english) enqueue(parts.english, voice, 0.92);
    if (parts.thai) enqueue(parts.thai, "th-TH", 1);
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
  await getAudioContext();
  if (spell) {
    for (const letter of lettersOf(word)) {
      if (gen !== playGen) return;
      await playOneLetter(letter, gen);
      if (gen === playGen) await new Promise((resolve) => window.setTimeout(resolve, 80));
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
