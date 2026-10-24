import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { URL } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const pkg = JSON.parse(read("package.json"));
const themeModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(read("src/lib/theme.ts"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: themeModule.exports });
const { themeScript, isTheme } = themeModule.exports;

function paint(saved, systemDark = false, blocked = false) {
  const root = { dataset: {}, style: {} };
  vm.runInNewContext(themeScript, {
    localStorage: { getItem(key) { assert.equal(key, "agenticpay-theme"); if (blocked) throw new Error("Storage blocked"); return saved; } },
    window: { matchMedia(query) { assert.equal(query, "(prefers-color-scheme: dark)"); return { matches: systemDark }; } },
    document: { documentElement: root },
  });
  return root;
}

test("project exposes the required scripts and framework dependencies", () => {
  assert.deepEqual(pkg.scripts, { dev: "next dev", build: "next build", start: "next start", lint: "eslint .", typecheck: "tsc --noEmit", test: "node --experimental-strip-types --test tests/*.test.mjs" });
  for (const name of ["next", "react", "react-dom", "typescript", "tailwindcss", "@tailwindcss/postcss", "postcss", "lucide-react", "clsx", "tailwind-merge", "@types/node", "@types/react", "@types/react-dom", "eslint", "@eslint/js", "typescript-eslint"]) assert.ok({ ...pkg.dependencies, ...pkg.devDependencies }[name], name);
  assert.match(pkg.dependencies.next, /\b(15|16)\./);
  assert.equal(JSON.parse(read("tsconfig.json")).compilerOptions.strict, true);
  assert.match(read("postcss.config.mjs"), /@tailwindcss\/postcss/);
});

test("design system uses the VibeDev-inspired light canvas and comfortable geometry", () => {
  const css = read("src/app/globals.css");
  const root = css.split("[data-theme='dark']")[0];
  for (const token of ["--background: #ffffff", "--panel: #ffffff", "--card: #fafafa", "--foreground: #000000", "--muted: #666666", "--border: #e5e5e5", "--primary: #111111", "--secondary: #888888", "--radius-card: 16px", "--radius-button: 12px", "--space-unit: 24px"]) assert.ok(root.includes(token), token);
  assert.match(css, /--font-ui: "Geist"/);
  assert.match(css, /\.landing-hero[\s\S]*padding: 72px 0 64px/);
  assert.match(css, /\.hero-reel img[\s\S]*brightness\(\.68\)[\s\S]*opacity: 1/);
  assert.match(css, /\.workspace-panel[\s\S]*border-radius: var\(--radius-card\)/);
  assert.doesNotMatch(css, /background-image:\s*radial-gradient/);
  assert.match(css, /@import "tailwindcss"/);
});

test("pre-paint defaults to light and handles invalid or blocked storage", () => {
  for (const saved of [null, "invalid", "", "light"]) assert.equal(paint(saved).dataset.theme, "light");
  assert.equal(paint("dark", false, true).dataset.theme, "light");
});

test("pre-paint respects explicit themes and system preference", () => {
  for (const [saved, systemDark, expected] of [["light", true, "light"], ["dark", false, "dark"], ["system", true, "dark"], ["system", false, "light"]]) {
    const root = paint(saved, systemDark);
    assert.equal(root.dataset.theme, expected);
    assert.equal(root.style.colorScheme, expected);
  }
  for (const value of ["dark", "light", "system"]) assert.equal(isTheme(value), true);
  for (const value of [null, "auto", {}, 0]) assert.equal(isTheme(value), false);
});

test("layout installs the theme initializer in head before the body", () => {
  const layout = read("src/app/layout.tsx");
  assert.match(layout, /data-theme="light" suppressHydrationWarning/);
  assert.ok(layout.indexOf("__html: themeScript") < layout.indexOf("<body>"));
  assert.match(read("src/app/page.tsx"), /<AppShell/);
});

test("homepage integrates the reusable tilted grid hero through the shadcn ui path", () => {
  const component = read("src/components/ui/tilted-grid-hero.tsx");
  const hero = read("src/components/landing/landing-hero.tsx");
  const shadcn = JSON.parse(read("components.json"));
  assert.match(component, /export function TiltedGridHero/);
  assert.match(component, /ResizeObserver/);
  assert.match(hero, /@\/components\/ui\/tilted-grid-hero/);
  assert.match(hero, /<TiltedGridHero/);
  assert.match(hero, /hero-reel-visible/);
  assert.match(hero, /HERO_IMAGES\.slice\(0, 3\)/);
  assert.equal(shadcn.aliases.ui, "@/components/ui");
  assert.equal(shadcn.tailwind.css, "src/app/globals.css");
  const hook = read("src/lib/use-theme.ts");
  assert.match(hook, /useState<Theme>\("light"\)/);
  assert.match(hook, /let preference: Theme = "light"/);
});
