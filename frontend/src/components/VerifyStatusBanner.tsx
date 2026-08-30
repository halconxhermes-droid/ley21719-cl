interface Props {
  status: { kind: "success" } | { kind: "error"; message: string };
  onDismiss: () => void;
  onRetry?: () => void;
}

/**
 * Banner que muestra el resultado del click en el enlace de verificacion.
 * Aparece en la parte superior de la pantalla despues de que el usuario
 * regresa del flujo de email verification de InsForge.
 */
export default function VerifyStatusBanner({ status, onDismiss, onRetry }: Props) {
  if (status.kind === "success") {
    return (
      <div className="fixed inset-x-0 top-0 z-[200] mx-auto max-w-2xl p-4">
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-lg">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-emerald-900">Correo verificado</p>
            <p className="text-sm text-emerald-800">
              Tu cuenta ha sido verificada correctamente. Ya puedes usar la plataforma.
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="text-emerald-700 hover:text-emerald-900"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[200] mx-auto max-w-2xl p-4">
      <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-lg">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-rose-900">Enlace de verificacion invalido</p>
          <p className="text-sm text-rose-800">{status.message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-sm font-semibold text-rose-900 underline hover:no-underline"
            >
              Reenviar enlace de verificacion
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-rose-700 hover:text-rose-900"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
