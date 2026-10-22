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
  assert.deepEqual(pkg.scripts, { dev: "next dev", build: "next build", start: "next start", lint: "eslint .", typecheck: "tsc --noEmit", test: "node --test tests/*.test.mjs" });
  for (const name of ["next", "react", "react-dom", "typescript", "tailwindcss", "@tailwindcss/postcss", "postcss", "lucide-react", "clsx", "tailwind-merge", "@types/node", "@types/react", "@types/react-dom", "eslint", "@eslint/js", "typescript-eslint"]) assert.ok({ ...pkg.dependencies, ...pkg.devDependencies }[name], name);
  assert.match(pkg.dependencies.next, /\b(15|16)\./);
  assert.equal(JSON.parse(read("tsconfig.json")).compilerOptions.strict, true);
  assert.match(read("postcss.config.mjs"), /@tailwindcss\/postcss/);
});

test("design system includes required dark and light tokens", () => {
  const css = read("src/app/globals.css");
  const dark = css.split("[data-theme='light']")[0];
  const light = css.split("[data-theme='light']")[1].split("}")[0];
  for (const token of ["#08090a", "#0e1012", "rgba(255,255,255,0.03)", "rgba(255,255,255,0.08)", "#6366f1", "#10b981", "#f59e0b", "#f43f5e"]) assert.ok(dark.includes(token), token);
  for (const token of ["#f8fafc", "#ffffff", "#f1f5f9", "#e2e8f0", "#0f172a"]) assert.ok(light.includes(token), token);
  assert.match(css, /@import "tailwindcss"/);
});

test("pre-paint defaults to dark and handles invalid or blocked storage", () => {
  for (const saved of [null, "invalid", "", "dark"]) assert.equal(paint(saved).dataset.theme, "dark");
  assert.equal(paint("light", false, true).dataset.theme, "dark");
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
  assert.match(layout, /data-theme="dark" suppressHydrationWarning/);
  assert.ok(layout.indexOf("__html: themeScript") < layout.indexOf("<body>"));
  assert.match(read("src/app/page.tsx"), /<AppShell/);
});
