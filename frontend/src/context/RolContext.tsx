import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Rol = "empresa" | "ciudadano" | "desarrollador" | "institucion";

export const ROLE_LABELS: Record<Rol, string> = {
  empresa: "Empresa",
  ciudadano: "Ciudadano / Titular",
  desarrollador: "Desarrollador / Técnico",
  institucion: "Institución Pública",
};

/** Roles válidos en la API de checklist (backend). */
export const ROLE_API: Record<Rol, string> = {
  empresa: "empresas",
  ciudadano: "ciudadanos",
  desarrollador: "desarrolladores",
  institucion: "instituciones-publicas",
};

export const ROLES: Rol[] = ["empresa", "ciudadano", "desarrollador", "institucion"];

const STORAGE_KEY = "ley21719_role";

interface RolContextValue {
  rol: Rol | null;
  setRol: (rol: Rol | null) => void;
}

const RolContext = createContext<RolContextValue>({
  rol: null,
  setRol: () => {},
});

function readInitialRol(): Rol | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && (ROLES as string[]).includes(raw)) return raw as Rol;
  } catch {
    /* localStorage no disponible */
  }
  return null;
}

export function RolProvider({ children }: { children: ReactNode }) {
  const [rol, setRolState] = useState<Rol | null>(readInitialRol);

  useEffect(() => {
    try {
      if (rol) window.localStorage.setItem(STORAGE_KEY, rol);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, [rol]);

  const setRol = useCallback((r: Rol | null) => setRolState(r), []);

  return <RolContext.Provider value={{ rol, setRol }}>{children}</RolContext.Provider>;
}

export function useRol(): RolContextValue {
  return useContext(RolContext);
}
