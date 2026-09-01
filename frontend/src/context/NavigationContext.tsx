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
  | "verificar"
  | "practica";

interface NavigationContextValue {
  view: ViewId;
  moduleId: string;
  practiceId: string;
  navigate: (view: ViewId, opts?: { moduleId?: string; practiceId?: string }) => void;
}

const NavigationContext = createContext<NavigationContextValue>({
  view: "admin",
  moduleId: "empresa",
  practiceId: "breach",
  navigate: () => {},
});

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("portal");
  const [moduleId, setModuleId] = useState("empresa");
  const [practiceId, setPracticeId] = useState("breach");

  const navigate = useCallback((v: ViewId, opts?: { moduleId?: string; practiceId?: string }) => {
    if (opts?.moduleId) setModuleId(opts.moduleId);
    if (opts?.practiceId) setPracticeId(opts.practiceId);
    setView(v);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const value = useMemo(
    () => ({ view, moduleId, practiceId, navigate }),
    [view, moduleId, practiceId, navigate],
  );

  return (
    <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextValue {
  return useContext(NavigationContext);
}
