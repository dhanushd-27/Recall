# Declaration Files

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. What Are Declaration Files?

**Question:**
What is a `.d.ts` file and why do some packages need `@types/`?

**Answer:**
A `.d.ts` file contains **type declarations without implementation**. It tells TypeScript what types a JavaScript module exports.

**Two distribution models:**

| Model             | Example                    | Maintained by             |
| ----------------- | -------------------------- | ------------------------- |
| Bundled types     | `axios` ships with `.d.ts` | Library authors           |
| `@types/` package | `@types/express`           | DefinitelyTyped community |

```bash
# Check if a package has bundled types
npm info axios types # → "./index.d.ts" ✅

# If not, install from DefinitelyTyped
npm install -D @types/express
```

**Why the split exists:** Some libraries are written in JavaScript and don't maintain their own types. The community fills the gap via `@types/`.

---

### 2. The `declare` Keyword

**Question:**
What `declare` means and when to use it.

**Answer:**
`declare` tells TypeScript "this exists at runtime, but I'm not defining it here — just describing its type."

```typescript
// Describe a global variable (e.g., injected by a script tag)
declare const API_URL: string;

// Describe a function that exists at runtime
declare function gtag(event: string, action: string, params: object): void;

// Describe a module without types
declare module "untyped-lib" {
  export function doSomething(x: string): number;
}
```

**`declare` never produces JavaScript output.** It's purely for the type checker.

---

## 🟡 Intermediate

### 1. Writing Declaration Files

**Question:**
Write a `.d.ts` for a JavaScript utility library.

**Answer:**

```typescript
// utils.d.ts
declare module "my-utils" {
  /** Format a Date object using a format string */
  export function formatDate(date: Date, format: string): string;

  /** Library version */
  export const VERSION: string;

  /** Configuration options */
  export interface FormatOptions {
    locale?: string;
    timezone?: string;
  }

  /** Format with options */
  export function formatDateWithOptions(
    date: Date,
    format: string,
    options?: FormatOptions,
  ): string;
}
```

**Placement:** Either in a `types/` directory referenced via `typeRoots` in tsconfig, or alongside the JS file with the same name (`utils.d.ts` next to `utils.js`).

---

### 2. Triple-Slash Directives

**Question:**
When triple-slash directives are still needed.

**Answer:**

```typescript
/// <reference types="vite/client" />  // Include Vite's client types
/// <reference path="./custom.d.ts" /> // Reference a local declaration file
```

**Modern usage (rare but necessary):**

- `/// <reference types="..." />` — Used in `.d.ts` files to include global type libraries without `import`.
- Vite/Next.js projects use them for client type augmentation (`vite-env.d.ts`).
- For ambient type definitions that can't use `import`.

**In most cases:** `import` statements and `tsconfig.json` `types` array replace triple-slash directives.

---

### 3. Ambient Declarations

**Question:**
Type a server-injected global config.

**Answer:**

```typescript
// types/global.d.ts
interface AppConfig {
  apiUrl: string;
  environment: "development" | "staging" | "production";
  features: Record<string, boolean>;
}

declare global {
  interface Window {
    config: AppConfig;
  }
}

export {}; // Required — makes this a module

// Usage anywhere in your app
const url = window.config.apiUrl; // ✅ Typed!
```

---

## 🔴 Advanced

### 1. Declaration File Generation

**Question:**
Publishing a TS library with proper declarations.

**Answer:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true, // Generate .d.ts files
    "declarationMap": true, // Source maps for .d.ts (Go to Definition goes to .ts source)
    "emitDeclarationOnly": true, // Only emit .d.ts (use esbuild/swc for JS)
    "outDir": "./dist"
  }
}
```

**Package.json setup:**

```json
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

**Modern build pipeline:**

1. `tsc --emitDeclarationOnly` → generates `.d.ts` files
2. `tsup` or `esbuild` → bundles JS (much faster than tsc)

---

### 2. Conditional Types in Declarations

**Question:**
How `querySelector` returns different element types.

**Answer:**

```typescript
// Simplified from lib.dom.d.ts
interface Document {
  querySelector<K extends keyof HTMLElementTagNameMap>(
    selectors: K,
  ): HTMLElementTagNameMap[K] | null;

  querySelector<E extends Element = Element>(selectors: string): E | null;
}

// HTMLElementTagNameMap maps tag names to element types
interface HTMLElementTagNameMap {
  a: HTMLAnchorElement;
  button: HTMLButtonElement;
  div: HTMLDivElement;
  input: HTMLInputElement;
  // ...
}

// Usage — TypeScript infers the return type from the selector
document.querySelector("input"); // HTMLInputElement | null
document.querySelector("a"); // HTMLAnchorElement | null
document.querySelector(".custom"); // Element | null (generic string)
```

**This is achieved through overloaded declarations** — the more specific signature (with `keyof`) is tried first, then the generic fallback.
