import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

/** Hook que aplica atributos data-theme / dark al <html>. */
export default function useApplyTheme() {
  const { theme, colorMode } = useTheme();

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const html = document.documentElement;
    const apply = () => {
      let isDark = false;
      if (colorMode === "dark") isDark = true;
      else if (colorMode === "light") isDark = false;
      else isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      html.classList.toggle("dark", isDark);
    };
    apply();
    if (colorMode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [colorMode]);
}