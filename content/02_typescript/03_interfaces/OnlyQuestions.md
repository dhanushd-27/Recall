# TypeScript Interfaces

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Defining Interfaces

**Question:**
How do you define an interface for a user object? What is the difference between required and optional properties?

### 2. Readonly Properties

**Question:**
You have a configuration object that should never be modified after initialization. How do you use `readonly` to enforce this at the type level?

---

## 🟡 Intermediate

### 1. Interface Extension & Composition

**Question:**
You have `BaseEntity`, `Timestamped`, and `SoftDeletable` interfaces. Show how to compose them into a `User` interface using `extends`. How does this compare to intersection types (`&`)?

### 2. Function Types in Interfaces

**Question:**
Define an interface for an API client that has methods with different signatures: `get(url)`, `post(url, body)`, and a generic `request(config)`. Include overloaded signatures.

### 3. Declaration Merging

**Question:**
Why can you write the same `interface` name twice and have TypeScript merge them? Give a practical example where this is essential (e.g., augmenting `Window` or a library's types).

---

## 🔴 Advanced

### 1. Interfaces vs Abstract Classes

**Question:**
When should you use an `interface` vs an `abstract class` for defining contracts? What are the runtime and compile-time differences?

### 2. Hybrid Types

**Question:**
How do you define an interface for a value that is both callable as a function AND has properties? Give an example using Express's `app` object or jQuery's `$`.
