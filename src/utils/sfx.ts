type Sfx = "countdown" | "go" | "correct" | "wrong" | "timeout" | "levelUp" | "complete";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType, gainValue: number, startAt = 0) {
  const audio = getCtx();
  if (!audio) return;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;
  gain.gain.value = gainValue;
  oscillator.connect(gain);
  gain.connect(audio.destination);
  const start = audio.currentTime + startAt;
  gain.gain.setValueAtTime(gainValue, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

export async function playSfx(name: Sfx, enabled: boolean): Promise<void> {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  try {
    if (audio.state === "suspended") await audio.resume();
  } catch {
    return;
  }

  if (name === "countdown") tone(440, 0.12, "sine", 0.08);
  if (name === "go") {
    tone(523, 0.12, "triangle", 0.1);
    tone(784, 0.16, "triangle", 0.08, 0.08);
  }
  if (name === "correct") {
    tone(523, 0.1, "sine", 0.09);
    tone(784, 0.16, "sine", 0.08, 0.08);
  }
  if (name === "wrong") tone(180, 0.22, "sawtooth", 0.05);
  if (name === "timeout") tone(220, 0.28, "square", 0.04);
  if (name === "levelUp") {
    tone(392, 0.1, "triangle", 0.08);
    tone(523, 0.1, "triangle", 0.08, 0.1);
    tone(784, 0.18, "triangle", 0.08, 0.2);
  }
  if (name === "complete") {
    tone(523, 0.12, "sine", 0.08);
    tone(659, 0.12, "sine", 0.08, 0.12);
    tone(784, 0.2, "sine", 0.09, 0.24);
  }
}
