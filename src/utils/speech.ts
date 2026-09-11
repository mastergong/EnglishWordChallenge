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
  void speakUtterance(text, lang, rate, playGen);
}

function speakUtterance(text: string, lang: string, rate: number, gen: number): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis || gen !== playGen) {
      resolve();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    const preferred = pickVoice(window.speechSynthesis.getVoices(), lang);
    if (preferred) utterance.voice = preferred;
    let settled = false;
    const timeout = window.setTimeout(() => done(), Math.min(8000, 900 + text.length * 220));
    const done = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve();
    };
    utterance.onend = done;
    utterance.onerror = done;
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      done();
    }
  });
}

let playGen = 0;
let letterAudio: HTMLAudioElement | null = null;
let audioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
const scheduledSources: AudioBufferSourceNode[] = [];
const bufferCache = new Map<string, AudioBuffer>();
const MIN_LETTER_MS = 420;
const LETTER_TAIL_MS = 80;
const LETTER_GAP_MS = 200;

export function letterAudioSrc(letter: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}audio/${letter.toLowerCase()}_letter.mp3`;
}

export function letterPlaySlotMs(durationSec: number): number {
  const audible = Number.isFinite(durationSec) ? durationSec * 1000 : 0;
  return Math.max(MIN_LETTER_MS, Math.round(audible) + LETTER_TAIL_MS);
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
  while (scheduledSources.length) {
    const source = scheduledSources.pop();
    try {
      source?.stop();
    } catch {
      /* already stopped */
    }
  }
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

function cloneBuffer(ctx: AudioContext, buffer: AudioBuffer): AudioBuffer {
  const copy = ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    copy.getChannelData(channel).set(buffer.getChannelData(channel));
  }
  return copy;
}

function playBuffer(buffer: AudioBuffer, gen: number): Promise<void> {
  return new Promise((resolve) => {
    void getAudioContext().then((ctx) => {
      if (!ctx || gen !== playGen) {
        resolve();
        return;
      }
      const source = ctx.createBufferSource();
      currentSource = source;
      scheduledSources.push(source);
      source.buffer = cloneBuffer(ctx, buffer);
      source.connect(ctx.destination);
      const holdMs = letterPlaySlotMs(buffer.duration);
      const finish = () => {
        if (currentSource === source) currentSource = null;
        resolve();
      };
      try {
        source.start();
      } catch {
        finish();
        return;
      }
      window.setTimeout(finish, holdMs);
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
    const startWait = () => {
      const holdMs = letterPlaySlotMs(Number.isFinite(audio.duration) ? audio.duration : 0.4);
      void audio.play().then(() => {
        window.setTimeout(done, holdMs);
      }).catch(done);
    };
    if (audio.readyState >= 1) startWait();
    else audio.addEventListener("loadedmetadata", startWait, { once: true });
    audio.addEventListener("error", done, { once: true });
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
  return th ? { thai: th } : {};
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
      if (gen === playGen) await new Promise((resolve) => window.setTimeout(resolve, LETTER_GAP_MS));
    }
  }
  if (gen !== playGen) return;
  try {
    await speakUtterance(word, lang, 0.92, gen);
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
