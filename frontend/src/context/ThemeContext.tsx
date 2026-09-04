import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

/** IDs de tema visual - exportados como tipo y también como strings para uso en el contexto. */
export type ThemeId = "corporate" | "academy" | "legal-hub";

/** Modes de color disponibles - exportados como tipo y también como strings para uso en el contexto. */
export type ColorMode = "light" | "dark" | "system";

interface ThemeContextValue {
  /** Tema visual activo: corporate / academy / legal-hub */
  theme: ThemeId;
  /** Modo de color: light / dark / system */
  colorMode: ColorMode;
  /** Densidad visual compacta / confortable */
  density: "compact" | "comfortable";

  setTheme: (theme: ThemeId) => void;
  setColorMode: (mode: ColorMode) => void;
  setDensity: (density: "compact" | "comfortable") => void;
}

/** Cadena literal para persistencia en localStorage - mantener sincronizada con ThemeId */
const THEME_STORAGE_KEY = "ley21719_theme";
const COLOR_MODE_STORAGE_KEY = "ley21719_colormode";
const DENSITY_STORAGE_KEY = "ley21719_density";

const ThemeContext = createContext<ThemeContextValue>({
  theme: "corporate" as ThemeId,
  colorMode: "system" as ColorMode,
  density: "comfortable" as "compact" | "comfortable",
  setTheme: () => {},
  setColorMode: () => {},
  setDensity: () => {},
});

function readInitialTheme(): ThemeId {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw && ["corporate", "academy", "legal-hub"].includes(raw)) return raw as ThemeId;
  } catch {
    /* localStorage no disponible */
  }
  return "corporate";
}

function readInitialColorMode(): ColorMode {
  try {
    const raw = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (raw && ["light", "dark", "system"].includes(raw)) return raw as ColorMode;
  } catch {
    /* localStorage no disponible */
  }
  return "system";
}

function readInitialDensity(): "compact" | "comfortable" {
  try {
    const raw = window.localStorage.getItem(DENSITY_STORAGE_KEY);
    if (raw && ["compact", "comfortable"].includes(raw)) return raw as "compact" | "comfortable";
  } catch {
    /* localStorage no disponible */
  }
  return "comfortable";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(readInitialTheme);
  const [colorMode, setColorModeState] = useState<ColorMode>(readInitialColorMode);
  const [density, setDensityState] = useState<"compact" | "comfortable">(
    readInitialDensity,
  );

  useEffect(() => {
    try {
      if (theme) window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      else window.localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, [theme]);

  useEffect(() => {
    try {
      if (colorMode) window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
      else window.localStorage.removeItem(COLOR_MODE_STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, [colorMode]);

  useEffect(() => {
    try {
      if (density) window.localStorage.setItem(DENSITY_STORAGE_KEY, density);
      else window.localStorage.removeItem(DENSITY_STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, [density]);

  const setTheme = useCallback((theme: ThemeId) => setThemeState(theme), []);
  const setColorMode = useCallback((mode: ColorMode) => setColorModeState(mode), []);
  const setDensity = useCallback((density: "compact" | "comfortable") => setDensityState(density), []);

  return (
    <ThemeContext.Provider value={{ theme, colorMode, density, setTheme, setColorMode, setDensity }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export default ThemeContext;