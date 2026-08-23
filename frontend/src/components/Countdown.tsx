import { useCountdown } from "../lib/countdown";

/** Cuenta regresiva viva al 1-DIC-2026 00:00 CLST, actualizada cada segundo. */
export default function Countdown({ hero = false }: { hero?: boolean }) {
  const text = useCountdown();

  if (hero) {
    return (
      <p
        aria-live="polite"
        className="m-2 mx-0 mb-0 font-mono text-lg font-bold"
      >
        {text}
      </p>
    );
  }

  return (
    <div
      aria-live="polite"
      aria-label="Cuenta regresiva a vigencia plena"
      className="whitespace-nowrap rounded-full bg-primary-900 px-4 py-2 font-mono text-sm font-semibold text-white"
    >
      ⏳ {text}
    </div>
  );
}
