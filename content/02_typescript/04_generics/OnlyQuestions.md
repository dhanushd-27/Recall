# TypeScript Generics

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Why Generics?

**Question:**
You have a function that wraps any value in an array. Without generics, you'd type it as `(value: any) => any[]`. Why is this problematic? Rewrite it with generics.

### 2. Generic Functions

**Question:**
Write a generic `first<T>(arr: T[]): T | undefined` function. Why is this safer than `first(arr: any[]): any`?

---

## 🟡 Intermediate

### 1. Generic Constraints

**Question:**
Write a function `getProperty(obj, key)` that returns the value of any property from an object, but only if the key actually exists on that object. Use `extends keyof` to enforce this.

### 2. Generic Interfaces & Classes

**Question:**
Design a generic `Repository<T>` interface for database operations (CRUD). It should work with any entity type. Then implement it for a `User` entity.

### 3. Default Type Parameters

**Question:**
Create a generic `ApiResponse<T = unknown, E = Error>` type where `T` defaults to `unknown` and `E` defaults to `Error`. When are default type parameters useful?

---

## 🔴 Advanced

### 1. Generic Utility Type Implementation

**Question:**
Implement `Pick<T, K>`, `Omit<T, K>`, and `Partial<T>` from scratch using mapped types and generics. Explain how each works internally.

### 2. Higher-Order Generic Functions

**Question:**
Write a generic `pipe` function that takes two functions and returns their composition, with full type inference:

```typescript
const fn = pipe(
  (x: string) => x.length, // string → number
  (n: number) => n > 5, // number → boolean
);
fn("hello world"); // true — TypeScript infers the full chain
```

### 3. Variance & Covariance

**Question:**
Explain covariance and contravariance in TypeScript generics. Why can you assign `string[]` to `(string | number)[]` but not a `(value: string | number) => void` to `(value: string) => void`?
