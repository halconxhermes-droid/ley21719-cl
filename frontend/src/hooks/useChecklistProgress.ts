import { useCallback, useEffect, useState } from "react";

/**
 * Estado persistente por rol en localStorage (mockup: ley21719_ck_<rol>).
 * Devuelve [done, toggle, reset] para el rol activo.
 */
export function useChecklistProgress(role: string) {
  const storageKey = `ley21719_ck_${role}`;

  const read = useCallback((): Record<string, boolean> => {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || "{}") as Record<
        string,
        boolean
      >;
    } catch {
      return {};
    }
  }, [storageKey]);

  const [done, setDone] = useState<Record<string, boolean>>(read);

  // Recarga al cambiar de rol
  useEffect(() => {
    setDone(read());
  }, [read]);

  const persist = useCallback(
    (next: Record<string, boolean>) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* noop */
      }
    },
    [storageKey],
  );

  const toggle = useCallback(
    (itemId: string, completed: boolean) => {
      setDone((prev) => {
        const next = { ...prev };
        if (completed) next[itemId] = true;
        else delete next[itemId];
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(() => {
    setDone(() => {
      persist({});
      return {};
    });
  }, [persist]);

  return { done, toggle, reset };
}
