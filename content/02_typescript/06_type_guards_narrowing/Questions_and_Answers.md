# Type Guards & Narrowing

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Built-in Type Guards

**Question:**
When to use `typeof`, `instanceof`, and `in`.

**Answer:**

```typescript
// typeof — primitives
function format(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // ✅ Narrowed to string
  }
  return value.toFixed(2); // ✅ Narrowed to number
}

// instanceof — class instances
function getArea(shape: Circle | Rectangle) {
  if (shape instanceof Circle) {
    return Math.PI * shape.radius ** 2; // ✅ Narrowed to Circle
  }
  return shape.width * shape.height; // ✅ Narrowed to Rectangle
}

// in — property existence
function move(vehicle: Car | Boat) {
  if ("wheels" in vehicle) {
    vehicle.drive(); // ✅ Narrowed to Car (has wheels)
  } else {
    vehicle.sail(); // ✅ Narrowed to Boat
  }
}
```

| Guard        | Works on        | Checks              |
| ------------ | --------------- | ------------------- |
| `typeof`     | Primitives      | Runtime type string |
| `instanceof` | Class instances | Prototype chain     |
| `in`         | Objects         | Property existence  |

---

### 2. Truthiness Narrowing

**Question:**
When truthiness narrowing gives false safety.

**Answer:**

```typescript
function greet(name: string | null | undefined) {
  if (name) {
    console.log(name.toUpperCase()); // ✅ Narrowed to string
  }
}
```

**⚠️ Danger with falsy values:**

```typescript
function displayCount(count: number | null) {
  if (count) {
    // ❌ This skips count === 0, which is a valid number!
    console.log(`Count: ${count}`);
  }

  // ✅ Correct — check for null explicitly
  if (count !== null) {
    console.log(`Count: ${count}`); // Handles 0 correctly
  }
}
```

**Falsy values in JavaScript:** `0`, `""`, `NaN`, `null`, `undefined`, `false`. All get filtered out by truthiness checks.

---

## 🟡 Intermediate

### 1. User-Defined Type Guards

**Question:**
Validate unknown API responses with type guards.

**Answer:**

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Type guard — returns `value is User`
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as any).id === "string" &&
    "name" in value &&
    typeof (value as any).name === "string" &&
    "email" in value &&
    typeof (value as any).email === "string"
  );
}

// Usage
const data: unknown = await res.json();
if (isUser(data)) {
  console.log(data.name); // ✅ TypeScript knows data is User
} else {
  throw new Error("Invalid user data");
}
```

**Why `value is User` is essential:** Without it, the return type is just `boolean` — TypeScript wouldn't narrow the type in the `if` block. The type predicate tells TypeScript "if this returns true, treat the value as `User`."

**Production alternative:** Use Zod or Valibot for schema validation with automatic type inference.

```typescript
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});
const user = UserSchema.parse(data); // Throws if invalid, returns typed User
```

---

### 2. Discriminated Union Narrowing

**Question:**
Calculate area with exhaustive switch.

**Answer:**

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return 0.5 * shape.base * shape.height;
    default:
      // Exhaustiveness check — errors if a case is missing
      const _exhaustive: never = shape;
      throw new Error(`Unknown shape: ${(_exhaustive as any).kind}`);
  }
}
```

**How exhaustiveness works:** After all known cases, `shape` should be `never` (no remaining types). If you add a new shape to the union without adding a case, TypeScript errors because `shape` is not `never`.

---

### 3. `asserts` Type Guards

**Question:**
Assertion functions with `asserts`.

**Answer:**

```typescript
function assertNonNull<T>(
  value: T | null | undefined,
  message?: string,
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message ?? "Value is null or undefined");
  }
}

// Usage — narrows type AFTER the call
const user: User | null = getUser();
assertNonNull(user, "User not found"); // Throws if null
console.log(user.name); // ✅ TypeScript knows user is User (not null)
```

**`asserts value is T` vs `value is T`:**

| Feature      | `value is T` (type guard) | `asserts value is T`                |
| ------------ | ------------------------- | ----------------------------------- |
| Returns      | `boolean`                 | `void` (throws on failure)          |
| Usage        | `if (isUser(x)) { ... }`  | `assertUser(x); // continues`       |
| Control flow | Narrows inside `if` block | Narrows for all code after the call |
| Best for     | Conditional logic         | Fail-fast validation                |

---

## 🔴 Advanced

### 1. Control Flow Analysis Limitations

**Question:**
When TypeScript's narrowing fails.

**Answer:**

```typescript
function process(value: string | number) {
  if (typeof value === "string") {
    // ✅ Narrowed to string here

    setTimeout(() => {
      // ❌ TypeScript re-widens to string | number inside callbacks!
      // TypeScript can't guarantee `value` hasn't been reassigned
      value.toUpperCase(); // This works because value is const, but...
    }, 0);
  }
}

// The real problem — mutable variables
let value: string | number = "hello";
if (typeof value === "string") {
  someAsyncFn(() => {
    value.toUpperCase(); // ❌ Error — value might have changed
  });
  value = 42; // This is why TS is conservative
}
```

**Workaround:** Use `const` variables or extract into local constants:

```typescript
function process(value: string | number) {
  if (typeof value === "string") {
    const str = value; // const — TypeScript narrows permanently
    setTimeout(() => {
      str.toUpperCase(); // ✅ Always string
    }, 0);
  }
}
```

---

### 2. Branded Type Guards

**Question:**
Create a validated email branded type.

**Answer:**

```typescript
type ValidEmail = string & { readonly __brand: "ValidEmail" };

function isValidEmail(value: string): value is ValidEmail {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sendEmail(to: ValidEmail, subject: string) {
  // Safe — guaranteed to be validated
  fetch("/api/send", { method: "POST", body: JSON.stringify({ to, subject }) });
}

// Usage
const input = "user@example.com";
if (isValidEmail(input)) {
  sendEmail(input, "Welcome!"); // ✅ input is ValidEmail
}

sendEmail("not-validated", "Hey"); // ❌ Error: string is not ValidEmail
```

**This pattern combines:**

- Runtime validation (regex check)
- Compile-time safety (branded type)
- Zero runtime overhead (brand is phantom)
