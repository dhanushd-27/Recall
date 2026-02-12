# TypeScript Coding Challenges

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Type-Safe `groupBy`

**Challenge:** Implement a type-safe `groupBy<T, K extends keyof T>(items: T[], key: K)` function that groups array elements by a key.

### 2. Type-Safe `pick` and `omit`

**Challenge:** Implement runtime `pick` and `omit` functions with full type safety using generics and `keyof`.

---

## 🟡 Intermediate

### 1. Type-Safe Event Emitter

**Challenge:** Build a fully type-safe event emitter where event names and handler payload types are enforced at compile time. Invalid event names or wrong payloads should cause type errors.

### 2. Builder Pattern with Types

**Challenge:** Create a type-safe query builder where methods chain and the `build()` method can only be called when required fields (like `table`) are set. Invalid build calls should cause compile-time errors.

---

## 🔴 Advanced

### 1. Type-Safe Path Accessor

**Challenge:** Create a `get(obj, "db.credentials.user")` function that accesses nested properties using a dot-separated path string, with the return type automatically inferred from the path.

### 2. Type-Safe State Machine

**Challenge:** Implement a state machine where valid transitions are defined as a type and invalid state transitions cause compile-time errors (e.g., you can go from `idle` → `loading` but NOT `idle` → `success`).
