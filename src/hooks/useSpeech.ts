import { useCallback } from "react";
import { cancelSpeech, speakEnglish } from "../utils/speech";
import type { VoiceAccent } from "../types/game";

export function useSpeech(enabled: boolean, voice: VoiceAccent) {
  const speak = useCallback(
    (text: string) => {
      if (!enabled) return;
      speakEnglish(text, voice);
    },
    [enabled, voice],
  );

  const stop = useCallback(() => {
    cancelSpeech();
  }, []);

  return { speak, stop };
}
