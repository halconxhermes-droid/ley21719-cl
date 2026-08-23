interface ProgressBarProps {
  /** Porcentaje 0–100 */
  value: number;
  label?: string;
  ariaLabel?: string;
}

export default function ProgressBar({ value, label, ariaLabel }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div
        className="h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? label ?? "Progreso"}
      >
        <div
          className="h-full rounded-full bg-primary-600 transition-[width] duration-250"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {label ? (
        <p className="mt-1 text-sm font-medium text-slate-700">{label}</p>
      ) : null}
    </div>
  );
}
