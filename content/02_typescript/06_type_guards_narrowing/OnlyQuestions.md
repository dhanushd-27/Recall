# Type Guards & Narrowing

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Built-in Type Guards

**Question:**
What are the built-in type guard operators (`typeof`, `instanceof`, `in`) and when do you use each?

### 2. Truthiness Narrowing

**Question:**
Why does checking `if (value)` narrow `string | null | undefined` to `string`? When does truthiness narrowing give you a false sense of security?

---

## 🟡 Intermediate

### 1. User-Defined Type Guards

**Question:**
Write a type guard function `isUser(value: unknown): value is User` that validates an unknown API response at runtime. Why is the `value is User` return type essential?

### 2. Discriminated Union Narrowing

**Question:**
You have a `Shape` union type (`Circle | Rectangle | Triangle`). Write a function that calculates the area using a `switch` on the discriminant. How do you ensure the switch is exhaustive?

### 3. `asserts` Type Guards

**Question:**
Write an `assertNonNull<T>(value: T | null | undefined): asserts value is T` function. How does `asserts` differ from `value is T`? When would you use assertion functions?

---

## 🔴 Advanced

### 1. Control Flow Analysis Limitations

**Question:**
Show a scenario where TypeScript's control flow analysis fails to narrow a type correctly (e.g., callback-based narrowing). How do you work around it?

### 2. Branded Type Guards

**Question:**
Combine branded types with type guards to create a validated email type. The type guard should validate the email format at runtime and narrow the type to `ValidEmail` at compile time.
