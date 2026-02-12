# TypeScript Basics

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Why TypeScript?

**Question:**
What problems does TypeScript solve that JavaScript doesn't?

**Answer:**

| Problem in JS                                       | TypeScript Solution                    |
| --------------------------------------------------- | -------------------------------------- |
| Runtime type errors (`undefined is not a function`) | Caught at compile time                 |
| No intellisense / autocomplete for custom objects   | Full IDE support via types             |
| Refactoring breaks things silently                  | Compiler catches all broken references |
| No documentation in code                            | Types serve as living documentation    |
| API contract ambiguity                              | Explicit input/output types            |

**When TypeScript is NOT the right choice:**

- Quick prototypes / throwaway scripts.
- Very small projects with a single developer.
- When the team has zero TypeScript experience and deadline is tight.
- Shell scripts or simple automation.

**Real-world impact:** Microsoft studies show TypeScript catches ~15% of bugs that would otherwise reach production.

---

### 2. Type Annotations vs Inference

**Question:**
When to annotate vs let TypeScript infer?

**Answer:**

**Let inference work (don't annotate):**

```typescript
// ✅ TypeScript infers: number
const count = 42;

// ✅ TypeScript infers: string[]
const names = ["Alice", "Bob"];

// ✅ TypeScript infers return type from body
function add(a: number, b: number) {
  return a + b; // inferred: number
}
```

**Annotate explicitly when:**

```typescript
// Function parameters — ALWAYS annotate
function greet(name: string): void { ... }

// Complex return types — helps readers
function parseUser(data: unknown): User | null { ... }

// Empty collections
const items: string[] = []; // Without annotation: never[]

// External data (API responses, parsed JSON)
const data: ApiResponse = await res.json();
```

**Rule:** Annotate function boundaries (params + return types of exported functions). Let inference handle the rest.

---

### 3. `any` vs `unknown`

**Question:**
Difference between `any` and `unknown`.

**Answer:**

| Feature         | `any`                         | `unknown`                                                    |
| --------------- | ----------------------------- | ------------------------------------------------------------ |
| Type checking   | ❌ Disabled entirely          | ✅ Requires narrowing before use                             |
| Property access | `value.anything` — no error   | `value.anything` — ❌ error                                  |
| Assignability   | Assignable to/from everything | Assignable from everything, but to nothing without narrowing |
| Safety          | None                          | Full type safety                                             |

```typescript
// any — disables ALL type checking (dangerous)
function unsafeLog(data: any) {
  console.log(data.nested.value.name); // No error, crashes at runtime
}

// unknown — requires type narrowing (safe)
function safeLog(data: unknown) {
  // data.nested; // ❌ Error: 'data' is of type 'unknown'

  if (typeof data === "object" && data !== null && "nested" in data) {
    console.log(data.nested); // ✅ Narrowed
  }
}
```

**Migration strategy:** Replace `any` with `unknown`, then add type guards where TypeScript complains. This forces you to handle edge cases you were previously ignoring.

---

## 🟡 Intermediate

### 1. `type` vs `interface`

**Question:**
Practical differences and when each matters.

**Answer:**

| Feature             | `interface`                      | `type`                              |
| ------------------- | -------------------------------- | ----------------------------------- |
| Declaration merging | ✅ Yes                           | ❌ No                               |
| Extends             | `extends` keyword                | Intersection `&`                    |
| Union types         | ❌ Cannot represent              | ✅ `type Result = Success \| Error` |
| Primitive aliases   | ❌                               | ✅ `type ID = string`               |
| Mapped types        | ❌                               | ✅ Full support                     |
| Computed properties | ❌                               | ✅ Full support                     |
| Performance         | Slightly better for cached types | Slightly slower for complex types   |

**When it matters:**

- **Use `interface`** when defining object shapes that might be extended (APIs, library types, class contracts).
- **Use `type`** for unions, intersections, mapped types, conditional types, and anything that isn't a pure object shape.

```typescript
// Interface — extendable object shape
interface User {
  id: string;
  name: string;
}

// Type — union (impossible with interface)
type Result = { success: true; data: User } | { success: false; error: string };

// Type — computed
type UserKeys = keyof User; // "id" | "name"
```

**Team recommendation:** Pick one as default and use the other when needed. Most modern codebases default to `type`.

---

### 2. Utility Types in Practice

**Question:**
Create derived types from a `User` type.

**Answer:**

```typescript
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

// For creating users — no id or createdAt (server generates these)
type CreateUserInput = Omit<User, "id" | "createdAt">;

// For partial updates — all fields optional
type UpdateUserInput = Partial<Omit<User, "id">>;

// For displaying — no password
type PublicUser = Omit<User, "password">;

// For auth — only what's needed
type AuthCredentials = Pick<User, "email" | "password">;

// Read-only version for immutable state
type ReadonlyUser = Readonly<User>;
```

**Most-used utility types:**

| Utility         | What it does                     |
| --------------- | -------------------------------- |
| `Partial<T>`    | All properties optional          |
| `Required<T>`   | All properties required          |
| `Readonly<T>`   | All properties read-only         |
| `Pick<T, K>`    | Select specific properties       |
| `Omit<T, K>`    | Remove specific properties       |
| `Record<K, V>`  | Object with keys K and values V  |
| `ReturnType<T>` | Extract function return type     |
| `Parameters<T>` | Extract function parameter types |

---

### 3. Enums vs Union Types

**Question:**
Compare enums vs string literal unions.

**Answer:**

```typescript
// Enum — generates runtime code
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
}

// Union — zero runtime cost (erased during compilation)
type Status = "ACTIVE" | "INACTIVE" | "PENDING";
```

| Feature         | `enum`                       | Union Type              |
| --------------- | ---------------------------- | ----------------------- |
| Runtime code    | ✅ Yes (~200 bytes per enum) | ❌ None (erased)        |
| Bundle size     | Larger                       | Zero overhead           |
| Reverse mapping | `enum[0]` for numeric enums  | Not applicable          |
| Iteration       | `Object.values(Status)`      | Requires separate array |
| Tree shaking    | ❌ Not tree-shakeable        | ✅                      |
| `const enum`    | Inlined at compile time ✅   | N/A                     |

**Recommendation:** Use **union types** for most cases. Use `enum` only when you need runtime reverse mapping or iteration over all values.

```typescript
// Modern pattern — union type + const array for iteration
const STATUSES = ["ACTIVE", "INACTIVE", "PENDING"] as const;
type Status = (typeof STATUSES)[number]; // "ACTIVE" | "INACTIVE" | "PENDING"

// Now you can iterate AND have type safety
STATUSES.forEach((s) => console.log(s));
```

---

## 🔴 Advanced

### 1. Type Narrowing & Discriminated Unions

**Question:**
Design a type-safe API response handler.

**Answer:**

```typescript
// Discriminated union — shared `status` field with literal types
type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string; statusCode: number };

function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case "loading":
      // TypeScript knows: { status: "loading" }
      showSpinner();
      break;
    case "success":
      // TypeScript knows: { status: "success"; data: T }
      renderData(response.data); // ✅ data is accessible
      break;
    case "error":
      // TypeScript knows: { status: "error"; error: string; statusCode: number }
      showError(response.error); // ✅ error is accessible
      break;
  }
}
```

**The discriminant (`status`)** is a shared property with **literal types** in each variant. TypeScript uses it to narrow the union in each branch — this is exhaustive checking.

**Exhaustiveness checking with `never`:**

```typescript
function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case "loading":
      return;
    case "success":
      return;
    case "error":
      return;
    default:
      const _exhaustive: never = response; // ❌ Error if a case is missing
  }
}
```

---

### 2. Declaration Merging

**Question:**
Augment Express's `Request` type with custom properties.

**Answer:**

```typescript
// types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "admin" | "user";
      };
      requestId: string;
    }
  }
}
export {}; // Required to make this a module

// Now in your middleware
app.use((req, res, next) => {
  req.user = authenticateToken(req); // ✅ TypeScript knows about user
  req.requestId = crypto.randomUUID(); // ✅ TypeScript knows about requestId
  next();
});
```

**How it works:** Interfaces with the same name in the same scope are **merged**. This is unique to interfaces — `type` aliases cannot merge. This is why library types use `interface` — so consumers can extend them.

---

### 3. TypeScript Compiler Architecture

**Question:**
Explain the compilation pipeline.

**Answer:**

```
Source (.ts) → Scanner → Tokens → Parser → AST → Binder → Symbols
                                                    ↓
Type Checker ← Program (AST + Symbols)
    ↓
Emitter → JavaScript (.js) + Declaration Files (.d.ts) + Source Maps
```

**Type checking vs transpilation:**

- **Type checking:** Validates types, resolves generics, checks assignability. This is the slow part.
- **Transpilation:** Strips types, converts syntax. Fast and simple.

**Why `esbuild`/`swc` skip type checking:**
They only do transpilation (strip types + convert syntax), which is ~100x faster. Type checking is done separately via `tsc --noEmit`.

```bash
# Fast: esbuild transpiles in ms
esbuild src/index.ts --bundle --outfile=dist/index.js

# Parallel: tsc checks types without emitting
tsc --noEmit

# Modern workflow: CI runs both
esbuild ... && tsc --noEmit
```

This separation allows faster dev server startup (Vite, Next.js) while still catching type errors in CI.
