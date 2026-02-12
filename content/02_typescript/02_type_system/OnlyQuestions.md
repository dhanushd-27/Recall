# TypeScript Type System

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Primitive Types

**Question:**
What are TypeScript's primitive types? How do they differ from JavaScript's runtime types?

### 2. Union & Intersection Types

**Question:**
Explain the difference between `string | number` (union) and `TypeA & TypeB` (intersection) with real-world examples. When would you use each?

### 3. Literal Types

**Question:**
What are literal types and how do they make your code safer than using broad types like `string` or `number`?

---

## 🟡 Intermediate

### 1. Tuple Types

**Question:**
Your function returns multiple values: a data object and a loading boolean. Should you use a tuple, an object, or separate returns? What are the trade-offs?

### 2. Index Signatures & `Record`

**Question:**
You need to type a dictionary-like object where keys are dynamic strings and values are numbers. Compare index signatures `{ [key: string]: number }` with `Record<string, number>`. When should you use each?

### 3. `keyof` and `typeof` Operators

**Question:**
Given an API response object, use `keyof` and `typeof` to derive types from runtime values. How does this reduce type duplication?

---

## 🔴 Advanced

### 1. Conditional Types

**Question:**
Implement a `NonNullableDeep<T>` type that recursively removes `null` and `undefined` from all properties (including nested ones). Explain the `extends` keyword in the context of conditional types.

### 2. Mapped Types

**Question:**
Create a `Mutable<T>` type that removes `readonly` from all properties (the opposite of `Readonly<T>`). Then create a `Optional<T, K>` type that makes specific keys optional while keeping others required.

### 3. Template Literal Types

**Question:**
Build a type-safe event system where event names follow the pattern `on${Capitalize<string>}` (e.g., `onClick`, `onFocus`). How do template literal types work at the type level?
