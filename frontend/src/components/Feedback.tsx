interface LoadingProps {
  label?: string;
}

export function Loading({ label = "Cargando…" }: LoadingProps) {
  return (
    <div role="status" aria-live="polite" className="p-6 text-slate-500">
      {label}
    </div>
  );
}

interface ErrorPanelProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorPanel({
  message = "No se pudo cargar el contenido. Verifica que la API esté disponible en /api/v1.",
  onRetry,
}: ErrorPanelProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-300 bg-red-100 p-4 text-red-900"
    >
      <p className="m-0 mb-2">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-md border border-red-300 bg-white px-4 py-2 font-medium text-red-900 hover:bg-red-50"
        >
          Reintentar
        </button>
      ) : null}
    </div>
  );
}
