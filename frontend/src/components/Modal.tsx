import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  labelledBy?: string;
  children: ReactNode;
}

/** Modal accesible: role=dialog, aria-modal, cierre con Escape y foco en cerrar. */
export default function Modal({ title, onClose, labelledBy, children }: ModalProps) {
  const headingId = labelledBy ?? "modal-title";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="max-h-[80vh] w-full max-w-[480px] overflow-y-auto rounded-xl bg-white p-6 shadow-lg animate-fade-in"
      >
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <h3 id={headingId} className="m-0 text-xl font-semibold">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Cerrar modal"
            className="cursor-pointer border-none bg-transparent p-1 text-2xl leading-none text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>
        <div className="leading-relaxed text-slate-700">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
