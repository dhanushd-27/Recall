# Error Handling & Strict Mode

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. TypeScript Strict Mode

**Question:**
What does `"strict": true` enable?

**Answer:**
`"strict": true` is a shorthand for enabling all strict type-checking flags:

| Flag                           | What it catches                               |
| ------------------------------ | --------------------------------------------- |
| `strictNullChecks`             | Forces handling `null`/`undefined` explicitly |
| `strictFunctionTypes`          | Enforces correct function parameter variance  |
| `strictBindCallApply`          | Type-checks `bind`, `call`, `apply`           |
| `strictPropertyInitialization` | Class properties must be initialized          |
| `noImplicitAny`                | Error when type would be inferred as `any`    |
| `noImplicitThis`               | Error when `this` type is `any`               |
| `alwaysStrict`                 | Emits `"use strict"` in all files             |
| `useUnknownInCatchVariables`   | `catch (e)` types `e` as `unknown`, not `any` |

**Always use `"strict": true` in new projects.** It catches the majority of type-related bugs.

---

### 2. Error Types in Catch Blocks

**Question:**
Why `catch` errors are `unknown` and how to handle them.

**Answer:**

```typescript
// ❌ With `any` (old behavior) — no type checking
try { ... } catch (error: any) {
  console.log(error.message); // No error — but what if error is a string?
}

// ✅ With `unknown` (safe)
try {
  await fetchData();
} catch (error: unknown) {
  // error.message; // ❌ Error: 'error' is of type 'unknown'

  if (error instanceof Error) {
    console.log(error.message); // ✅ Narrowed to Error
  } else if (typeof error === "string") {
    console.log(error); // ✅ Narrowed to string
  } else {
    console.log("Unknown error", error);
  }
}
```

**Why `unknown`?** In JavaScript, you can `throw` anything — strings, numbers, objects, `null`. The `catch` block can't assume the error is an `Error` instance.

---

## 🟡 Intermediate

### 1. Custom Error Classes

**Question:**
Design an API error hierarchy.

**Answer:**

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    // Fix prototype chain — required for instanceof to work
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" not found`, 404, "NOT_FOUND");
  }
}

class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fields: Record<string, string>,
  ) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

// Usage
function handleError(error: unknown) {
  if (error instanceof ValidationError) {
    console.log(error.fields); // ✅ TypeScript knows about fields
  } else if (error instanceof NotFoundError) {
    console.log(error.statusCode); // 404
  } else if (error instanceof AppError) {
    console.log(error.code); // Generic app error
  }
}
```

**`Object.setPrototypeOf` is essential** — without it, `instanceof` checks fail when targeting ES5 because `Error` subclassing doesn't work correctly with transpiled code.

---

### 2. Result Pattern vs Exceptions

**Question:**
Compare Result types vs throwing.

**Answer:**

```typescript
// Result type — makes errors part of the type signature
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Usage
function parseJSON(input: string): Result<unknown, SyntaxError> {
  try {
    return ok(JSON.parse(input));
  } catch (e) {
    return err(e as SyntaxError);
  }
}

const result = parseJSON('{"x": 1}');
if (result.ok) {
  console.log(result.value); // ✅ TypeScript knows value exists
} else {
  console.log(result.error.message); // ✅ TypeScript knows error exists
}
```

| Feature          | Exceptions (`throw`)           | Result type                           |
| ---------------- | ------------------------------ | ------------------------------------- |
| Error visibility | Hidden (not in type signature) | Explicit in return type               |
| Composability    | Messy with try/catch           | Chainable (`.map`, `.flatMap`)        |
| Performance      | Slow (stack unwinding)         | Fast (regular return)                 |
| Best for         | Unexpected errors (bugs)       | Expected errors (validation, network) |

---

### 3. `satisfies` Operator

**Question:**
What `satisfies` solves.

**Answer:**

```typescript
type Color = "red" | "green" | "blue";
type ColorMap = Record<Color, string | number[]>;

// ❌ Type annotation — loses specific types
const colors: ColorMap = {
  red: "#ff0000",
  green: [0, 255, 0],
  blue: "#0000ff",
};
colors.red.toUpperCase(); // ❌ Error: string | number[] has no toUpperCase

// ❌ as const — no validation against ColorMap
const colors = { red: "#ff0000", grren: [0, 255, 0] } as const;
// Typo "grren" not caught!

// ✅ satisfies — validates structure AND preserves specific types
const colors = {
  red: "#ff0000",
  green: [0, 255, 0],
  blue: "#0000ff",
} satisfies ColorMap;

colors.red.toUpperCase(); // ✅ TypeScript knows red is string
colors.green.map((x) => x); // ✅ TypeScript knows green is number[]
```

**`satisfies` = validate the shape without widening the type.**

---

## 🔴 Advanced

### 1. Type-Safe Error Handling

**Question:**
Declare throwable errors in the type system.

**Answer:**

```typescript
type AsyncResult<T, E extends Error = Error> = Promise<Result<T, E>>;

// Each function declares its error types
async function fetchUser(
  id: string,
): AsyncResult<User, NotFoundError | NetworkError> {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) {
      if (res.status === 404) return err(new NotFoundError("User", id));
      return err(new NetworkError(`HTTP ${res.status}`));
    }
    return ok(await res.json());
  } catch (e) {
    return err(new NetworkError("Network failure"));
  }
}

// Caller MUST handle all error types
const result = await fetchUser("123");
if (!result.ok) {
  // result.error is NotFoundError | NetworkError
  if (result.error instanceof NotFoundError) {
    showNotFound();
  } else {
    showNetworkError();
  }
}
```

---

### 2. `noUncheckedIndexedAccess`

**Question:**
What this flag does and its implications.

**Answer:**

```typescript
// Without noUncheckedIndexedAccess
const arr = [1, 2, 3];
const val = arr[10]; // type: number (no warning!)
val.toFixed(); // Runtime crash: Cannot read property of undefined

// With noUncheckedIndexedAccess
const val = arr[10]; // type: number | undefined ✅
val.toFixed(); // ❌ Error: possibly undefined

// Must check first
if (val !== undefined) {
  val.toFixed(); // ✅
}

// Also affects objects
const obj: Record<string, number> = {};
const x = obj["missing"]; // type: number | undefined ✅
```

**Why not in `strict`?** It's too disruptive for existing codebases — every array access and dynamic object access requires a null check. It's opt-in for new projects.
