# TypeScript Advanced Types

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Union & Intersection Types

**Question:**
When building a component system, you need a `Button` prop type that can be either a link-button (with `href`) or a regular button (with `onClick`). How do union types help model this?

### 2. Type Aliases for Complex Types

**Question:**
You find this type repeated across your codebase: `Promise<{ data: T; error: Error | null }>`. How do you use a type alias to eliminate duplication?

---

## 🟡 Intermediate

### 1. Conditional Types

**Question:**
Create a type `IsString<T>` that evaluates to `true` if `T` is `string` and `false` otherwise. Then extend it to create `ExtractStrings<T>` that filters a union to only string members.

### 2. `infer` Keyword

**Question:**
Using `infer`, create a type that extracts the return type of a function and a type that extracts the resolved type of a Promise (`Awaited`-like). Explain how `infer` works in conditional type branches.

### 3. Distributive Conditional Types

**Question:**
Why does `Exclude<"a" | "b" | "c", "a">` produce `"b" | "c"`? Explain how conditional types distribute over union types and when to disable this behavior.

---

## 🔴 Advanced

### 1. Recursive Types

**Question:**
Create a `DeepPartial<T>` type that makes all properties optional at every level of nesting. How do you handle arrays, Maps, and Sets within the recursion?

### 2. Type-Level Programming

**Question:**
Implement a type `TupleToUnion<T>` that converts `[string, number, boolean]` to `string | number | boolean`. Then implement `UnionToIntersection<U>` — which is notoriously tricky.

### 3. Branded / Nominal Types

**Question:**
TypeScript uses structural typing, so `type UserId = string` and `type OrderId = string` are interchangeable. How do you create "branded" types that are structurally incompatible to prevent mixing up IDs?
