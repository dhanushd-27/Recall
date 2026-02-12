# Practical Best Practices

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. `tsconfig.json` Essentials

**Question:**
Most important config options for a new project.

**Answer:**

```json
{
  "compilerOptions": {
    "target": "ES2022", // JS version to compile to
    "module": "ESNext", // Module system (ESM)
    "moduleResolution": "bundler", // How to resolve imports (for Vite/Next.js)
    "strict": true, // Enable ALL strict checks
    "outDir": "./dist", // Output directory
    "rootDir": "./src", // Source directory
    "declaration": true, // Generate .d.ts files
    "skipLibCheck": true, // Skip checking node_modules .d.ts (faster)
    "esModuleInterop": true, // Allow default imports from CJS
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true, // Allow importing .json files
    "isolatedModules": true // Required for esbuild/swc/Vite
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

| Option             | What it does      | Recommended                                 |
| ------------------ | ----------------- | ------------------------------------------- |
| `target`           | JS output version | `ES2022` (modern)                           |
| `module`           | Module system     | `ESNext` (for bundlers)                     |
| `moduleResolution` | Import resolution | `bundler` (Vite/Next) or `node16` (Node.js) |
| `strict`           | All strict checks | Always `true`                               |

---

### 2. Avoiding Common Mistakes

**Question:**
Five common TypeScript mistakes.

**Answer:**

**1. Using `any` as an escape hatch:**

```typescript
// ❌
function process(data: any) {
  return data.value;
}
// ✅
function process(data: unknown) {
  /* narrow first */
}
```

**2. Not enabling strict mode:**
Without `strict`, TypeScript misses null errors, implicit `any`, and more.

**3. Incorrectly typing `catch` errors:**

```typescript
// ❌
catch (error) { console.log(error.message); }
// ✅
catch (error: unknown) { if (error instanceof Error) { ... } }
```

**4. Using `as` to silence errors instead of fixing types:**

```typescript
// ❌ Type assertion hides real bugs
const user = response.data as User;
// ✅ Validate at runtime
const user = UserSchema.parse(response.data);
```

**5. Not using `readonly` for immutable data:**

```typescript
// ❌ Array can be mutated
function process(items: string[]) {
  items.push("oops");
}
// ✅ Protected
function process(items: readonly string[]) {
  /* can't mutate */
}
```

---

## 🟡 Intermediate

### 1. Type-Safe API Contracts

**Question:**
Sharing types between frontend and backend.

**Answer:**

| Approach                      | Pros                                 | Cons                                 |
| ----------------------------- | ------------------------------------ | ------------------------------------ |
| **Shared package (monorepo)** | Simple, direct type sharing          | Tight coupling, must deploy together |
| **OpenAPI/Swagger codegen**   | Language-agnostic, standard          | Generated code can be verbose        |
| **tRPC**                      | End-to-end type safety, zero codegen | TypeScript-only, tight coupling      |
| **GraphQL codegen**           | Schema-driven, flexible              | Complex setup, extra build step      |

```typescript
// tRPC — full type safety with zero codegen
// Server
const appRouter = router({
  getUser: procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => db.users.findUnique({ where: { id: input.id } })),
});
export type AppRouter = typeof appRouter;

// Client — types flow automatically
const user = await trpc.getUser.query({ id: "123" });
// TypeScript knows user's shape without any type imports!
```

---

### 2. Writing Good Generic Code

**Question:**
Guidelines for readable generics.

**Answer:**

**Rule 1: Use descriptive type parameter names:**

```typescript
// ❌ Cryptic
function merge<A, B>(a: A, b: B): A & B { ... }
// ✅ Descriptive
function merge<TBase, TExtension>(base: TBase, ext: TExtension): TBase & TExtension { ... }
```

**Rule 2: Don't add generics you don't use:**

```typescript
// ❌ Over-engineered — T is only used once
function log<T>(value: T): void {
  console.log(value);
}
// ✅ Simple
function log(value: unknown): void {
  console.log(value);
}
```

**Rule 3: Constrain generics narrowly:**

```typescript
// ❌ Too broad
function getLength<T>(x: T): number {
  return (x as any).length;
}
// ✅ Constrained
function getLength<T extends { length: number }>(x: T): number {
  return x.length;
}
```

**Rule 4: If a generic gets complex, extract named types:**

```typescript
// ❌ Inline mess
function transform<T extends Record<string, (...args: any[]) => any>>(obj: T): { [K in keyof T]: ReturnType<T[K]> } { ... }

// ✅ Named type
type FunctionMap = Record<string, (...args: any[]) => any>;
type ReturnTypes<T extends FunctionMap> = { [K in keyof T]: ReturnType<T[K]> };
function transform<T extends FunctionMap>(obj: T): ReturnTypes<T> { ... }
```

---

### 3. Migration Strategy

**Question:**
Migrate 100k lines of JS to TS incrementally.

**Answer:**

**Phase 1 — Setup (Week 1):**

- Add `tsconfig.json` with `allowJs: true`, `checkJs: false`.
- Rename entry point and critical files to `.ts`.
- Install `@types/` packages for dependencies.

**Phase 2 — Incremental adoption (Weeks 2-8):**

- Enable `// @ts-check` at the top of `.js` files for gradual checking.
- Rename files from `.js` to `.ts` starting from leaf modules (no dependencies).
- Use `any` initially for complex types, then tighten with `// @ts-expect-error`.

**Phase 3 — Strict mode (Weeks 8-12):**

- Enable `strict` flags one at a time:
  1. `noImplicitAny`
  2. `strictNullChecks`
  3. `strictFunctionTypes`
- Fix errors in batches.

**Phase 4 — Full strict (ongoing):**

- Enable `strict: true`.
- Remove all remaining `any` types.
- Add type-safe error handling.

---

## 🔴 Advanced

### 1. Performance Optimization

**Question:**
Diagnose slow type-checking.

**Answer:**

```bash
# Generate a trace file
tsc --generateTrace ./trace

# Analyze with @typescript/analyze-trace
npx @typescript/analyze-trace ./trace
```

**Common performance killers:**

- **Deep conditional types** — recursive types slow down the checker exponentially.
- **Large union types** — unions over 25+ members get expensive for comparison.
- **Type-only imports** missing `type` keyword — forces TS to resolve entire modules.
- **Barrel files** — importing from `index.ts` pulls in everything.

**Fixes:**

- Use `import type { ... }` for type-only imports.
- Split large union types into smaller discriminated unions.
- Use project references to scope type-checking to changed packages.
- Enable `skipLibCheck: true` to skip checking `node_modules`.

---

### 2. TypeScript with Build Tools

**Question:**
Modern build pipeline comparison.

**Answer:**

| Tool       | Type-checks          | Speed        | Language        |
| ---------- | -------------------- | ------------ | --------------- |
| `tsc`      | ✅ Full              | Slow         | TypeScript (JS) |
| esbuild    | ❌ Strips types only | ~100x faster | Go              |
| SWC        | ❌ Strips types only | ~70x faster  | Rust            |
| Vite (dev) | ❌ Uses esbuild      | Very fast    | —               |
| `ts-node`  | ✅ (optional)        | Slow         | —               |
| `tsx`      | ❌ Uses esbuild      | Fast         | —               |

**Recommended pipeline:**

```bash
# Development — fast, no type-checking
vite dev  # or tsx watch src/index.ts

# CI/CD — parallel type-check + build
tsc --noEmit &    # Type-check only (no output)
vite build &      # Build with esbuild (fast, no types)
wait              # Both run in parallel
```

This gives you **fast development** (esbuild) + **full type safety** (tsc in CI).
