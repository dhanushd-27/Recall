# TypeScript Interfaces

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Defining Interfaces

**Question:**
How do you define an interface with required and optional properties?

**Answer:**

```typescript
interface User {
  id: string; // Required
  name: string; // Required
  email: string; // Required
  phone?: string; // Optional — may be undefined
  avatar?: string; // Optional
}

// ✅ Valid — optional properties omitted
const user: User = { id: "1", name: "Alice", email: "a@b.com" };

// ❌ Error — missing required property
const bad: User = { id: "1", name: "Alice" }; // Missing 'email'
```

**Optional vs `undefined`:**

```typescript
interface A {
  x?: number;
} // x can be missing or undefined
interface B {
  x: number | undefined;
} // x MUST be present, but can be undefined

const a: A = {}; // ✅ — x can be absent
const b: B = {}; // ❌ — x must be explicitly set
const b2: B = { x: undefined }; // ✅
```

---

### 2. Readonly Properties

**Question:**
Enforce immutability with `readonly`.

**Answer:**

```typescript
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly features: readonly string[];
}

const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  features: ["auth", "logging"],
};

config.apiUrl = "hacked"; // ❌ Error: Cannot assign to 'apiUrl'
config.features.push("new"); // ❌ Error: 'push' does not exist on 'readonly string[]'
```

**⚠️ `readonly` is shallow:** Nested objects need their own `readonly` modifiers or use `Readonly<T>` recursively.

**Deep readonly utility:**

```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

---

## 🟡 Intermediate

### 1. Interface Extension & Composition

**Question:**
Compose multiple interfaces into a `User` type.

**Answer:**

```typescript
interface BaseEntity {
  id: string;
}

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface SoftDeletable {
  deletedAt: Date | null;
  isDeleted: boolean;
}

// Extension — single inheritance chain
interface User extends BaseEntity, Timestamped, SoftDeletable {
  name: string;
  email: string;
}

// Intersection — equivalent but no declaration merging
type User = BaseEntity &
  Timestamped &
  SoftDeletable & {
    name: string;
    email: string;
  };
```

| Feature             | `extends`                      | `&` Intersection          |
| ------------------- | ------------------------------ | ------------------------- |
| Conflict handling   | ❌ Error on incompatible types | Silently produces `never` |
| Declaration merging | ✅                             | ❌                        |
| Readability         | Explicit hierarchy             | Flatter, more flexible    |
| Error messages      | Clearer                        | Can be confusing          |

**Recommendation:** Use `extends` for object shapes with clear hierarchy. Use `&` for ad-hoc composition.

---

### 2. Function Types in Interfaces

**Question:**
Define a type-safe API client interface.

**Answer:**

```typescript
interface RequestConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, body: unknown): Promise<T>;
  put<T>(url: string, body: unknown): Promise<T>;
  delete(url: string): Promise<void>;

  // Generic catch-all
  request<T>(config: RequestConfig): Promise<T>;
}

// Implementation
class HttpClient implements ApiClient {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(url);
    return res.json();
  }
  // ... other methods
}
```

**Call signatures (callable interface):**

```typescript
interface Formatter {
  (value: string): string; // Call signature
  locale: string; // Property
}
```

---

### 3. Declaration Merging

**Question:**
Why can you write the same interface name twice?

**Answer:**
TypeScript **merges** interfaces with the same name in the same scope — their members are combined.

```typescript
interface Window {
  myApp: {
    version: string;
    debug: boolean;
  };
}

// Now TypeScript knows about window.myApp
window.myApp.version; // ✅ No error
```

**Essential use cases:**

- **Augmenting global types:** Adding properties to `Window`, `Document`.
- **Extending library types:** Adding fields to Express `Request`, Prisma models.
- **Module augmentation:** Adding custom types to third-party packages.

**⚠️ `type` aliases CANNOT merge — this is the key architectural difference.** Libraries expose `interface` specifically to allow consumers to extend their types.

---

## 🔴 Advanced

### 1. Interfaces vs Abstract Classes

**Question:**
When to use each for contracts.

**Answer:**

| Feature                | Interface                  | Abstract Class            |
| ---------------------- | -------------------------- | ------------------------- |
| Runtime existence      | ❌ Erased at compile time  | ✅ Exists at runtime      |
| `instanceof` check     | ❌                         | ✅                        |
| Method implementations | ❌ (only signatures)       | ✅ (can provide defaults) |
| Multiple inheritance   | ✅ (`implements` multiple) | ❌ (single `extends`)     |
| Constructor            | ❌                         | ✅                        |
| Bundle size impact     | Zero                       | Adds code                 |

**Use `interface` when:** You only need a type contract (most cases).
**Use `abstract class` when:** You need shared method implementations, constructor logic, or runtime `instanceof` checks.

```typescript
// Interface — pure contract
interface Logger {
  log(message: string): void;
  error(message: string): void;
}

// Abstract class — shared implementation
abstract class BaseLogger {
  abstract log(message: string): void;

  error(message: string): void {
    this.log(`[ERROR] ${message}`); // Default implementation
  }
}
```

---

### 2. Hybrid Types

**Question:**
Define a callable value with properties.

**Answer:**

```typescript
interface Counter {
  (start: number): string; // Callable
  count: number; // Property
  reset(): void; // Method
}

function createCounter(): Counter {
  const fn = ((start: number) => {
    fn.count += start;
    return `Count: ${fn.count}`;
  }) as Counter;

  fn.count = 0;
  fn.reset = () => {
    fn.count = 0;
  };

  return fn;
}

const counter = createCounter();
counter(5); // "Count: 5" — called as function
counter.count; // 5 — accessed as property
counter.reset(); // Called as method
```

**Real-world examples:**

- jQuery's `$` — function + object with methods
- Express's `app` — callable + has `.get()`, `.post()` methods
- Chai's `expect()` — returns callable assertion chains
