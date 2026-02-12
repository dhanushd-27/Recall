# Error Handling & Strict Mode

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. TypeScript Strict Mode

**Question:**
What does `"strict": true` enable in `tsconfig.json`? List the individual flags it includes and what each catches.

### 2. Error Types

**Question:**
In TypeScript, `catch` blocks type the error as `unknown` by default. Why is this safer than `any`? How do you properly handle caught errors?

---

## 🟡 Intermediate

### 1. Custom Error Classes

**Question:**
Design a custom error hierarchy for an API: `AppError`, `NotFoundError`, `ValidationError`, `AuthenticationError`. How do you make `instanceof` checks work correctly with custom errors?

### 2. Result Pattern vs Exceptions

**Question:**
Compare throwing errors vs returning `Result<T, E>` types. When is each approach better? How does TypeScript's type system help with the Result pattern?

### 3. `satisfies` Operator

**Question:**
What problem does the `satisfies` operator (TS 4.9+) solve that `as const` and type annotations don't? Give a practical example.

---

## 🔴 Advanced

### 1. Type-Safe Error Handling

**Question:**
Design a type-safe error handling system where each function declares the errors it can throw (similar to Java's checked exceptions but using TypeScript's type system).

### 2. `noUncheckedIndexedAccess`

**Question:**
What does the `noUncheckedIndexedAccess` compiler option do? How does it change the way you work with arrays and objects? Why isn't it included in `strict`?
