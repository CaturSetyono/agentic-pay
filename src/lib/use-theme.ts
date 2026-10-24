"use client";

import { useCallback, useEffect, useState } from "react";
import { isTheme, THEME_KEY, type Theme } from "./theme";

export function useTheme() {
  const [theme, setPreference] = useState<Theme>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

  const apply = useCallback((preference: Theme) => {
    const resolved = preference === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : preference;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
    setPreference(preference);
    setResolvedTheme(resolved);
  }, []);

  useEffect(() => {
    let preference: Theme = "light";
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (isTheme(saved)) preference = saved;
    } catch { /* Keep the default when storage is blocked. */ }
    apply(preference);
    const sync = (event: StorageEvent) => {
      if (event.key === THEME_KEY || event.key === null) {
        apply(isTheme(event.newValue) ? event.newValue : "light");
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [apply]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => apply("system");
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [theme, apply]);

  const setTheme = useCallback((preference: Theme) => {
    try { localStorage.setItem(THEME_KEY, preference); } catch { /* Theme still works in memory. */ }
    apply(preference);
  }, [apply]);

  return { theme, resolvedTheme, setTheme };
}
