import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ViewId =
  | "portal"
  | "home"
  | "admin"
  | "lector"
  | "quiz"
  | "checklist"
  | "glosario"
  | "testfinal"
  | "resultados"
  | "verificar";

interface NavigationContextValue {
  view: ViewId;
  moduleId: string;
  navigate: (view: ViewId, opts?: { moduleId?: string }) => void;
}

const NavigationContext = createContext<NavigationContextValue>({
  view: "admin",
  moduleId: "empresa",
  navigate: () => {},
});

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("portal");
  const [moduleId, setModuleId] = useState("empresa");

  const navigate = useCallback((v: ViewId, opts?: { moduleId?: string }) => {
    if (opts?.moduleId) setModuleId(opts.moduleId);
    setView(v);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const value = useMemo(
    () => ({ view, moduleId, navigate }),
    [view, moduleId, navigate],
  );

  return (
    <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextValue {
  return useContext(NavigationContext);
}
