# TypeScript Type System

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Primitive Types

**Question:**
What are TypeScript's primitive types?

**Answer:**

| TS Type     | JS Runtime                  | Example             |
| ----------- | --------------------------- | ------------------- |
| `string`    | `typeof === "string"`       | `"hello"`           |
| `number`    | `typeof === "number"`       | `42`, `3.14`        |
| `boolean`   | `typeof === "boolean"`      | `true`, `false`     |
| `null`      | `typeof === "object"` (bug) | `null`              |
| `undefined` | `typeof === "undefined"`    | `undefined`         |
| `symbol`    | `typeof === "symbol"`       | `Symbol("id")`      |
| `bigint`    | `typeof === "bigint"`       | `9007199254740991n` |

**TypeScript-only types (no runtime equivalent):**

| Type      | Purpose                                       |
| --------- | --------------------------------------------- |
| `void`    | Function returns nothing                      |
| `never`   | Function never returns (throws/infinite loop) |
| `unknown` | Safe alternative to `any`                     |
| `any`     | Opt out of type checking                      |

**⚠️ Common mistake:** `String` (capital S) is the wrapper object type — always use lowercase `string`.

---

### 2. Union & Intersection Types

**Question:**
Difference between union (`|`) and intersection (`&`).

**Answer:**

```typescript
// Union — value can be ONE of the types
type StringOrNumber = string | number;
const id: StringOrNumber = "abc"; // ✅
const id2: StringOrNumber = 123; // ✅

// Intersection — value must satisfy ALL types
type Timestamped = { createdAt: Date; updatedAt: Date };
type Named = { name: string };
type TimestampedUser = Named & Timestamped;
// { name: string; createdAt: Date; updatedAt: Date }
```

**Real-world use cases:**

- **Union:** Function that accepts multiple input types, discriminated unions for state management.
- **Intersection:** Composing object types (mixins), adding metadata to existing types.

---

### 3. Literal Types

**Question:**
How do literal types improve safety?

**Answer:**

```typescript
// ❌ Broad type — accepts any string
function setDirection(dir: string) {}
setDirection("uup"); // No error — typo not caught!

// ✅ Literal type — only specific values allowed
function setDirection(dir: "up" | "down" | "left" | "right") {}
setDirection("uup"); // ❌ Error: Argument is not assignable
```

**Literal types apply to:** strings, numbers, booleans, `null`, `undefined`.

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type StatusCode = 200 | 201 | 400 | 404 | 500;
type Toggle = true | false; // same as boolean, but explicit
```

**`as const` for literal inference:**

```typescript
const config = { endpoint: "/api", retries: 3 } as const;
// Type: { readonly endpoint: "/api"; readonly retries: 3 }
// Without `as const`: { endpoint: string; retries: number }
```

---

## 🟡 Intermediate

### 1. Tuple Types

**Question:**
When to use tuples vs objects for multiple return values.

**Answer:**

```typescript
// Tuple — positional, concise
function useState<T>(initial: T): [T, (val: T) => void] {
  let state = initial;
  return [
    state,
    (val) => {
      state = val;
    },
  ];
}
const [count, setCount] = useState(0); // Destructuring by position

// Object — named, self-documenting
function useFetch<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  return { data: null, loading: true, error: null };
}
const { data, loading } = useFetch("/api/users"); // Destructuring by name
```

| Feature       | Tuple                            | Object                                    |
| ------------- | -------------------------------- | ----------------------------------------- |
| Access        | By position (`[0]`, `[1]`)       | By name (`.data`, `.loading`)             |
| Readability   | Low (what's `result[2]`?)        | High (`.error` is clear)                  |
| Extensibility | Adding positions is breaking     | Adding properties is backwards-compatible |
| Best for      | 2-3 values (React hooks pattern) | 3+ values, complex returns                |

---

### 2. Index Signatures & `Record`

**Question:**
Compare index signatures with `Record`.

**Answer:**

```typescript
// Index signature
interface WordCount {
  [word: string]: number;
}

// Record — shorthand for the same thing
type WordCount = Record<string, number>;

// Usage
const counts: WordCount = { hello: 5, world: 3 };
```

**When they differ:**

```typescript
// Record allows union keys — index signatures don't
type Permissions = Record<"read" | "write" | "delete", boolean>;
// { read: boolean; write: boolean; delete: boolean }

// Index signature allows additional known properties
interface Config {
  version: string; // known property
  [key: string]: string | number; // dynamic properties (must be compatible)
}
```

---

### 3. `keyof` and `typeof` Operators

**Question:**
Derive types from runtime values.

**Answer:**

```typescript
// typeof — extract type from a value
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
};
type Config = typeof config;
// { apiUrl: string; timeout: number; retries: number }

// keyof — extract union of keys
type ConfigKey = keyof Config; // "apiUrl" | "timeout" | "retries"

// Combined — type-safe object access
function getConfig<K extends keyof Config>(key: K): Config[K] {
  return config[key];
}
getConfig("apiUrl"); // type: string ✅
getConfig("timeout"); // type: number ✅
getConfig("invalid"); // ❌ Error
```

**This eliminates duplication:** Define the source of truth once (runtime value), derive all types from it.

---

## 🔴 Advanced

### 1. Conditional Types

**Question:**
Implement `NonNullableDeep<T>`.

**Answer:**

```typescript
type NonNullableDeep<T> = T extends null | undefined
  ? never
  : T extends object
    ? { [K in keyof T]: NonNullableDeep<T[K]> }
    : T;

// Usage
type User = {
  name: string | null;
  address: {
    city: string | undefined;
    zip: number | null;
  } | null;
};

type CleanUser = NonNullableDeep<User>;
// { name: string; address: { city: string; zip: number } }
```

**How `extends` works in conditional types:**
`A extends B ? X : Y` means: "If A is assignable to B, then X, else Y."

It's a ternary operator at the type level, evaluated during type checking.

---

### 2. Mapped Types

**Question:**
Create `Mutable<T>` and `Optional<T, K>`.

**Answer:**

```typescript
// Mutable — remove readonly from all properties
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Optional — make specific keys optional
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Usage
type ReadonlyUser = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
};

type EditableUser = Mutable<ReadonlyUser>;
// { id: string; name: string; email: string } — no readonly

type FlexibleUser = Optional<User, "email" | "phone">;
// email and phone are optional, others remain required
```

**Key modifiers:** `+readonly`, `-readonly`, `+?`, `-?` add or remove modifiers in mapped types.

---

### 3. Template Literal Types

**Question:**
Type-safe event names with template literals.

**Answer:**

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type MouseEvent = EventName<"click" | "move" | "down">;
// "onClick" | "onMove" | "onDown"

// Advanced: CSS property type
type CSSProperty = `${string}-${string}`;
const prop: CSSProperty = "background-color"; // ✅
const bad: CSSProperty = "color"; // ❌

// Build getter/setter types from properties
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }
```

**Intrinsic string types:** `Capitalize`, `Uncapitalize`, `Uppercase`, `Lowercase` — built-in type-level string transformations.
