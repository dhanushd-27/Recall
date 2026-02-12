# Modules & Namespaces

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. ES Modules in TypeScript

**Question:**
Named vs default exports.

**Answer:**

```typescript
// Named exports — multiple per file
export interface User { id: string; name: string; }
export function createUser(name: string): User { return { id: crypto.randomUUID(), name }; }
export const MAX_USERS = 100;

// Import named exports
import { User, createUser, MAX_USERS } from "./user";

// Default export — one per file
export default class UserService { ... }

// Import default
import UserService from "./user-service";
```

| Feature             | Named Export                  | Default Export              |
| ------------------- | ----------------------------- | --------------------------- |
| Number per file     | Multiple                      | One                         |
| Renaming on import  | `import { User as U }`        | `import Whatever`           |
| Auto-import support | ✅ Excellent                  | ⚠️ Name depends on importer |
| Refactoring         | ✅ Rename tracks across files | ❌ Name not connected       |
| Tree shaking        | ✅ Better                     | ⚠️ Includes entire default  |

**Community preference:** Named exports. They're more explicit, better for auto-imports, and easier to refactor.

---

### 2. Module Resolution

**Question:**
How TypeScript resolves module paths.

**Answer:**

For `import { User } from "./models"`, TypeScript checks (in order):

1. `./models.ts`
2. `./models.tsx`
3. `./models.d.ts`
4. `./models/index.ts`
5. `./models/index.tsx`
6. `./models/index.d.ts`

**`tsconfig.json` path settings:**

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["./*"],
      "@models/*": ["./models/*"],
      "@utils/*": ["./utils/*"]
    }
  }
}
```

```typescript
// Without paths
import { User } from "../../../models/user";

// With paths
import { User } from "@models/user"; // ✅ Clean
```

**⚠️ Important:** `paths` only tells TypeScript where to find types. Your bundler (Vite, webpack) or runtime (Node with `--conditions`) needs its own alias configuration too.

---

## 🟡 Intermediate

### 1. Barrel Files

**Question:**
When barrel files help and hurt.

**Answer:**

```typescript
// models/index.ts — barrel file
export { User } from "./user";
export { Post } from "./post";
export { Comment } from "./comment";

// Consumer — single clean import
import { User, Post, Comment } from "@models";
```

**Benefits:**

- Clean import paths.
- Encapsulation — hide internal module structure.

**Problems:**

- **Bundle size:** Importing one thing imports the entire barrel. `import { User } from "@models"` may pull in ALL models.
- **Circular dependencies:** Barrel files create a central hub that easily forms dependency cycles.
- **Slow IDE:** Large barrel files slow down auto-imports and type checking.

**Recommendation:** Use barrel files for public APIs of packages. Avoid for internal module organization. Use direct imports instead.

---

### 2. Dynamic Imports

**Question:**
Lazy loading with `import()`.

**Answer:**

```typescript
// Static import — loaded at startup
import { heavyFunction } from "./heavy-module";

// Dynamic import — loaded on demand
async function loadHeavyModule() {
  const { heavyFunction } = await import("./heavy-module");
  return heavyFunction();
}

// TypeScript infers the type automatically
// Type: Promise<typeof import("./heavy-module")>
```

**Real-world: Route-based code splitting in Next.js/React:**

```typescript
const Dashboard = lazy(() => import("./pages/Dashboard"));
// TypeScript knows Dashboard is React.ComponentType
```

---

### 3. Namespaces vs Modules

**Question:**
When to use `namespace` (almost never).

**Answer:**

```typescript
// ❌ Namespace — legacy pattern
namespace Validation {
  export function isEmail(s: string): boolean { ... }
}
Validation.isEmail("test@test.com");

// ✅ Module — modern pattern
// validation.ts
export function isEmail(s: string): boolean { ... }
import { isEmail } from "./validation";
```

**When namespaces are still used:**

- **Declaration files** for libraries that expose a single global object (e.g., `namespace Express`).
- **Augmenting global types** (`declare global` is technically a namespace).

**Never use namespaces for organizing application code.** ES modules do everything better.

---

## 🔴 Advanced

### 1. Module Augmentation

**Question:**
Extend third-party types with `declare module`.

**Answer:**

```typescript
// types/axios.d.ts
import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    retryCount?: number;
    retryDelay?: number;
  }
}

// Now TypeScript accepts these custom properties
axios.get("/api", { retryCount: 3, retryDelay: 1000 }); // ✅
```

**Rules:**

- The file must contain at least one `import`/`export` to be a module.
- The module name in `declare module` must match the import path exactly.
- Only `interface` merges — you can't add to `type` aliases.

---

### 2. Path Mapping & Project References

**Question:**
Monorepo configuration.

**Answer:**

```
packages/
  shared/         ← shared types & utils
    tsconfig.json
    src/index.ts
  api/            ← backend
    tsconfig.json
    src/index.ts
  web/            ← frontend
    tsconfig.json
    src/index.ts
tsconfig.base.json
```

```json
// packages/api/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true, // Required for project references
    "outDir": "./dist"
  },
  "references": [
    { "path": "../shared" } // Depends on shared package
  ]
}
```

- **`composite: true`** — enables incremental builds and declaration output.
- **`references`** — declares cross-package dependencies so `tsc --build` compiles in correct order.
- **`paths`** — maps import aliases to source locations for type checking.

```bash
tsc --build # Builds all packages in dependency order
```
