import { useEffect, useState } from "react";

/**
 * Cuenta regresiva viva a la vigencia plena de la Ley 21.719:
 * 1-DIC-2026 00:00 CLST (UTC-3) = 2026-12-01T03:00:00Z.
 * Se actualiza cada segundo.
 */

const TARGET_MS = Date.UTC(2026, 11, 1, 3, 0, 0); // 00:00 en Santiago (UTC-3)

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export function getTimeRemaining(now: number = Date.now()): TimeRemaining {
  const diff = Math.max(0, TARGET_MS - now);
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    totalMs: diff,
  };
}

export function formatRemaining(t: TimeRemaining): string {
  if (t.totalMs <= 0) return "¡Vigencia plena en curso!";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${t.days} días, ${pad(t.hours)}h ${pad(t.minutes)}m ${pad(t.seconds)}s`;
}

export function useCountdown(): string {
  const [text, setText] = useState(() => formatRemaining(getTimeRemaining()));

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      // Con movimiento reducido, actualiza cada minuto (menos parpadeo).
      const id = window.setInterval(
        () => setText(formatRemaining(getTimeRemaining())),
        60_000,
      );
      setText(formatRemaining(getTimeRemaining()));
      return () => window.clearInterval(id);
    }
    const id = window.setInterval(
      () => setText(formatRemaining(getTimeRemaining())),
      1000,
    );
    return () => window.clearInterval(id);
  }, []);

  return text;
}
