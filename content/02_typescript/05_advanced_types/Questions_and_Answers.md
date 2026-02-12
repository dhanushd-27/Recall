# TypeScript Advanced Types

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Union & Intersection Types

**Question:**
Model a Button that can be either a link or a regular button.

**Answer:**

```typescript
type LinkButton = {
  variant: "link";
  href: string;
  target?: "_blank" | "_self";
};

type ActionButton = {
  variant: "button";
  onClick: () => void;
  disabled?: boolean;
};

type ButtonProps = LinkButton | ActionButton;

// Usage — TypeScript narrows based on variant
function Button(props: ButtonProps) {
  if (props.variant === "link") {
    return <a href={props.href}>{/* ... */}</a>; // ✅ href available
  }
  return <button onClick={props.onClick}>{/* ... */}</button>; // ✅ onClick available
}
```

This is a **discriminated union** — the `variant` property acts as the discriminant.

---

### 2. Type Aliases for Complex Types

**Question:**
Eliminate type duplication with aliases.

**Answer:**

```typescript
// ❌ Before — repeated everywhere
async function fetchUser(): Promise<{ data: User; error: Error | null }> { ... }
async function fetchOrders(): Promise<{ data: Order[]; error: Error | null }> { ... }

// ✅ After — reusable generic type alias
type Result<T> = {
  data: T;
  error: Error | null;
};

async function fetchUser(): Promise<Result<User>> { ... }
async function fetchOrders(): Promise<Result<Order[]>> { ... }
```

---

## 🟡 Intermediate

### 1. Conditional Types

**Question:**
Create `IsString<T>` and `ExtractStrings<T>`.

**Answer:**

```typescript
// Type-level conditional
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
type C = IsString<"hello">; // true (literal extends string)

// Extract only string members from a union
type ExtractStrings<T> = T extends string ? T : never;

type Mixed = string | number | "hello" | boolean;
type OnlyStrings = ExtractStrings<Mixed>; // string | "hello"
```

**How it works:** `T extends U ? X : Y` checks if `T` is assignable to `U`. When `T` is a union, the conditional **distributes** over each member independently.

---

### 2. `infer` Keyword

**Question:**
Extract types using `infer`.

**Answer:**

```typescript
// Extract function return type
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type A = MyReturnType<() => string>; // string
type B = MyReturnType<(x: number) => boolean>; // boolean

// Extract Promise resolved type (like Awaited)
type MyAwaited<T> =
  T extends Promise<infer U>
    ? U extends Promise<any>
      ? MyAwaited<U> // Recursively unwrap nested promises
      : U
    : T;

type C = MyAwaited<Promise<string>>; // string
type D = MyAwaited<Promise<Promise<number>>>; // number

// Extract array element type
type ElementOf<T> = T extends (infer E)[] ? E : never;
type E = ElementOf<string[]>; // string
```

**`infer` creates a type variable** that TypeScript fills in by pattern matching. It only works inside the `extends` clause of a conditional type.

---

### 3. Distributive Conditional Types

**Question:**
Why does `Exclude` work on unions?

**Answer:**

```typescript
type Exclude<T, U> = T extends U ? never : T;

// When T is a union, it distributes:
type Result = Exclude<"a" | "b" | "c", "a">;
// Becomes:
// ("a" extends "a" ? never : "a") | ("b" extends "a" ? never : "b") | ("c" extends "a" ? never : "c")
// = never | "b" | "c"
// = "b" | "c"
```

**Disabling distribution:** Wrap `T` in a tuple.

```typescript
// Distributive (default)
type ToArray<T> = T extends any ? T[] : never;
type A = ToArray<string | number>; // string[] | number[]

// Non-distributive (wrapped in tuple)
type ToArray<T> = [T] extends [any] ? T[] : never;
type B = ToArray<string | number>; // (string | number)[]
```

---

## 🔴 Advanced

### 1. Recursive Types

**Question:**
Implement `DeepPartial<T>`.

**Answer:**

```typescript
type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends Map<infer K, infer V>
      ? Map<DeepPartial<K>, DeepPartial<V>>
      : T extends Set<infer U>
        ? Set<DeepPartial<U>>
        : T extends object
          ? { [K in keyof T]?: DeepPartial<T[K]> }
          : T;

// Usage
interface Config {
  db: { host: string; port: number; ssl: { enabled: boolean; cert: string } };
  cache: { ttl: number };
}

type PartialConfig = DeepPartial<Config>;
// All properties at every level are optional
const config: PartialConfig = { db: { ssl: { enabled: true } } }; // ✅
```

---

### 2. Type-Level Programming

**Question:**
Implement `TupleToUnion` and `UnionToIntersection`.

**Answer:**

```typescript
// TupleToUnion — simple indexed access
type TupleToUnion<T extends any[]> = T[number];

type A = TupleToUnion<[string, number, boolean]>; // string | number | boolean

// UnionToIntersection — uses contravariance trick
type UnionToIntersection<U> = (
  U extends any ? (arg: U) => void : never
) extends (arg: infer I) => void
  ? I
  : never;

type B = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a: 1 } & { b: 2 }
```

**How `UnionToIntersection` works:**

1. Distribute the union into function types: `((arg: {a:1}) => void) | ((arg: {b:2}) => void)`
2. Infer the parameter type — function parameters are **contravariant**
3. Contravariance forces the inferred type to be the **intersection**

---

### 3. Branded / Nominal Types

**Question:**
Prevent mixing up structurally identical types.

**Answer:**

```typescript
// Brand pattern — adds a phantom property
type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

// Constructor functions
function UserId(id: string): UserId { return id as UserId; }
function OrderId(id: string): OrderId { return id as OrderId; }

// Usage
function getUser(id: UserId): User { ... }

const userId = UserId("user_123");
const orderId = OrderId("order_456");

getUser(userId);   // ✅
getUser(orderId);  // ❌ Error: OrderId is not assignable to UserId
getUser("raw");    // ❌ Error: string is not assignable to UserId
```

**The `__brand` property never exists at runtime** — it's a phantom type that only exists in the type system. This prevents accidental type mixing without any runtime overhead.

**Real-world use cases:** Database IDs, currencies (`USD` vs `EUR` amounts), validated strings (email, URL), sanitized HTML.
