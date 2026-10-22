export type Theme = "dark" | "light" | "system";
export const THEME_KEY = "agenticpay-theme";
export const isTheme = (value: unknown): value is Theme =>
  value === "dark" || value === "light" || value === "system";

// Runs in <head> before body paint; storage can be unavailable in private contexts.
export const themeScript = `(function(){var theme='dark';try{var saved=localStorage.getItem('agenticpay-theme');if(saved==='dark'||saved==='light'||saved==='system')theme=saved;}catch(e){}var resolved=theme==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved;})();`;
