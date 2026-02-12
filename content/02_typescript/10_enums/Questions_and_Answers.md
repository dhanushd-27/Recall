# TypeScript Enums

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Numeric vs String Enums

**Question:**
Difference between numeric and string enums.

**Answer:**

```typescript
// Numeric enum — auto-increments from 0
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

// String enum — explicit values required
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
}
```

| Feature             | Numeric                    | String             |
| ------------------- | -------------------------- | ------------------ |
| Auto-increment      | ✅                         | ❌ Must set values |
| Reverse mapping     | ✅ `Direction[0] === "Up"` | ❌                 |
| Readability in logs | ❌ (`0`, `1`, `2`)         | ✅ (`"ACTIVE"`)    |
| Debugging           | Harder                     | Easier             |

**Recommendation:** Use string enums if you use enums at all — the values are self-documenting.

---

### 2. Enum Basics

**Question:**
How enums compile to JavaScript.

**Answer:**

```typescript
// TypeScript
enum Color {
  Red,
  Green,
  Blue,
}

// Compiled JavaScript (IIFE pattern)
var Color;
(function (Color) {
  Color[(Color["Red"] = 0)] = "Red";
  Color[(Color["Green"] = 1)] = "Green";
  Color[(Color["Blue"] = 2)] = "Blue";
})(Color || (Color = {}));

// This creates a bidirectional mapping:
// Color.Red === 0
// Color[0] === "Red"
```

**Using as a type:**

```typescript
function paint(color: Color) {
  console.log(`Painting with ${Color[color]}`);
}
paint(Color.Red); // ✅
paint(5); // ❌ Error (with --strict)
```

---

## 🟡 Intermediate

### 1. `const enum` vs Regular Enum

**Question:**
How `const enum` differs.

**Answer:**

```typescript
// Regular enum — generates runtime object
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
let d = Direction.Up; // Compiles to: let d = Direction.Up;

// const enum — inlined at compile time
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}
let d = Direction.Up; // Compiles to: let d = 0;
```

| Feature               | Regular              | `const enum`                       |
| --------------------- | -------------------- | ---------------------------------- |
| Runtime object        | ✅ Yes               | ❌ No (erased)                     |
| Bundle size           | Larger               | Zero (inlined)                     |
| Iteration             | ✅ `Object.values()` | ❌ No runtime object               |
| `.d.ts` compatibility | ✅                   | ⚠️ Issues with `--isolatedModules` |

**Avoid `const enum` when:**

- Using `--isolatedModules` (required by esbuild, Vite, Next.js).
- Publishing a library (consumers can't use `const enum` from `.d.ts`).

---

### 2. Enum Alternatives

**Question:**
Modern alternatives to enums.

**Answer:**

```typescript
// ❌ Enum — generates runtime code
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

// ✅ Union type — zero runtime cost
type Status = "ACTIVE" | "INACTIVE" | "PENDING";

// ✅ as const object — iterable + typed
const STATUS = {
  Active: "ACTIVE",
  Inactive: "INACTIVE",
  Pending: "PENDING",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];
// "ACTIVE" | "INACTIVE" | "PENDING"

// Iterate over values
Object.values(STATUS).forEach((s) => console.log(s));
```

| Approach          | Runtime      | Tree-shakeable | Iterable | Type-safe |
| ----------------- | ------------ | -------------- | -------- | --------- |
| `enum`            | ✅ (object)  | ❌             | ✅       | ✅        |
| `const enum`      | ❌ (inlined) | ✅             | ❌       | ✅        |
| Union type        | ❌ (erased)  | ✅             | ❌       | ✅        |
| `as const` object | ✅ (object)  | ✅             | ✅       | ✅        |

**Recommendation:** Use `as const` objects when you need runtime values. Use union types when you don't.

---

### 3. Reverse Mapping

**Question:**
Reverse mapping and safe iteration.

**Answer:**

```typescript
enum Color {
  Red,
  Green,
  Blue,
}

// Reverse mapping (numeric only)
Color[0]; // "Red"
Color.Red; // 0

// ⚠️ Iterating is tricky — includes reverse mappings
Object.keys(Color); // ["0", "1", "2", "Red", "Green", "Blue"]
Object.values(Color); // ["Red", "Green", "Blue", 0, 1, 2]

// Safe iteration for numeric enums
const numericValues = Object.values(Color).filter((v) => typeof v === "number");
// [0, 1, 2]

// String enums don't have this problem
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}
Object.values(Status); // ["ACTIVE", "INACTIVE"] ✅
```

---

## 🔴 Advanced

### 1. Computed & Heterogeneous Enums

**Question:**
Computed values and mixed enums.

**Answer:**

```typescript
// Computed values
enum FileAccess {
  None = 0,
  Read = 1 << 0, // 1
  Write = 1 << 1, // 2
  Execute = 1 << 2, // 4
  ReadWrite = Read | Write, // 3 — bitwise OR
}

// Check permissions with bitwise AND
function canRead(access: FileAccess): boolean {
  return (access & FileAccess.Read) !== 0;
}
canRead(FileAccess.ReadWrite); // true

// Heterogeneous enums (DON'T do this)
enum Mixed {
  No = 0,
  Yes = "YES", // ⚠️ Mixing types is technically valid but confusing
}
```

**Bit flag enums** are a legitimate use case where enums genuinely add value over alternatives.

---

### 2. Type vs Value Space

**Question:**
Enums exist in both type and value space.

**Answer:**

```typescript
enum Color {
  Red,
  Green,
  Blue,
}

// Color as a TYPE — restriction on what values a variable can hold
let c: Color = Color.Red; // ✅

// Color as a VALUE — a runtime object you can reference
console.log(Color.Red); // 0
console.log(Color[0]); // "Red"
typeof Color; // "object" at runtime

// type aliases only exist in type space
type MyColor = "red" | "green" | "blue";
// console.log(MyColor); // ❌ Error — doesn't exist at runtime
```

**Tree-shaking issue:** Because enums generate runtime code (IIFE), bundlers can't easily determine if the enum is unused. This means unused enums may end up in your bundle. Union types and `as const` objects don't have this problem.
