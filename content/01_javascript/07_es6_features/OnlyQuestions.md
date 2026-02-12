# ES6+ Features

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Spread & Rest Operators

**Question:**
A junior developer is confused when `...` appears to do two different things in their codebase. Explain the difference between the spread and rest operators. Show an example of each.

### 2. Template Literals

**Question:**
Beyond simple string interpolation, what other capabilities do template literals provide? Show how tagged template literals work and give a real-world use case.

### 3. Destructuring

**Question:**
Refactor the following function to use destructuring in the parameter list. Handle default values for missing properties.

```javascript
function createUser(options) {
  const name = options.name;
  const age = options.age || 18;
  const role = options.role || "user";
  // ...
}
```

---

## 🟡 Intermediate

### 1. `Map` vs Object and `Set` vs Array

**Question:**
You need to cache API responses by URL (string key) and also track a list of unique user IDs. Should you use a `Map`/`Set` or plain Objects/Arrays? What are the performance and ergonomic differences?

### 2. Symbols

**Question:**
Your team is building a plugin system where plugins can register metadata on shared objects without risking name collisions. How would `Symbol` solve this? What is the difference between `Symbol()` and `Symbol.for()`?

### 3. Optional Chaining & Nullish Coalescing

**Question:**
Refactor this deeply nested property access to be safe and concise. What is the difference between `?.` and `&&` chaining?

```javascript
const street =
  user && user.address && user.address.street ? user.address.street : "Unknown";
```

---

## 🔴 Advanced

### 1. Generators & Iterators

**Question:**
Implement a custom `Range` iterable that can be used with `for...of` loops and the spread operator. For example: `[...new Range(1, 5)]` should produce `[1, 2, 3, 4, 5]`. What is the iterator protocol?

### 2. Proxy & Reflect

**Question:**
Build a reactive system using `Proxy` and `Reflect` that detects property changes and triggers callbacks. This is the core mechanism behind Vue 3's reactivity. What are the performance implications?

### 3. WeakMap & WeakSet for Private Data

**Question:**
Before `#private` class fields, how were `WeakMap`s used to store truly private instance data? What advantage does `WeakMap` have over closures for this pattern when dealing with many instances?
