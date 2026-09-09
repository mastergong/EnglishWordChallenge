import { useCallback, useEffect, useRef, useState } from "react";

export function useTimer(initialSec: number, running: boolean, roundKey: number, onExpire?: () => void) {
  const [remainingMs, setRemainingMs] = useState(initialSec * 1000);
  const expired = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemainingMs(initialSec * 1000);
    expired.current = false;
  }, [initialSec, roundKey]);

  useEffect(() => {
    if (!running) return undefined;
    expired.current = false;
    const started = Date.now();
    const startValue = initialSec * 1000;
    const id = window.setInterval(() => {
      const next = Math.max(0, startValue - (Date.now() - started));
      setRemainingMs(next);
      if (next <= 0 && !expired.current) {
        expired.current = true;
        onExpireRef.current?.();
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [running, roundKey, initialSec]);

  const reset = useCallback((sec = initialSec) => {
    expired.current = false;
    setRemainingMs(sec * 1000);
  }, [initialSec]);

  return { remainingMs, remainingSec: remainingMs / 1000, reset };
}
