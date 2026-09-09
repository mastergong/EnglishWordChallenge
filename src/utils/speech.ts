export function speakEnglish(text: string, lang: "en-US" | "en-GB" = "en-US"): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((voice) => voice.lang.toLowerCase().startsWith(lang.toLowerCase())) ??
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en"));
    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
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
