# Miscellaneous JavaScript

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. `typeof` vs `instanceof`

**Question:**
Why does `typeof null` return `"object"`? How do you reliably check the type of a value in JavaScript?

### 2. Strict Mode

**Question:**
What does `"use strict"` change about JavaScript execution? Give three specific behaviors that differ between strict and non-strict mode.

### 3. Value vs Reference

**Question:**
A developer copies an object with `const copy = original` and is surprised when modifying `copy` also changes `original`. Explain why and how to properly clone objects (shallow and deep).

---

## 🟡 Intermediate

### 1. `this` Keyword Mental Model

**Question:**
The `this` keyword is one of the most confusing parts of JavaScript. Explain the four rules that determine what `this` refers to, in order of precedence.

### 2. Event Loop & `setTimeout(fn, 0)`

**Question:**
Why doesn't `setTimeout(fn, 0)` execute immediately? What is the minimum delay in practice and why?

### 3. Modules: ESM vs CommonJS

**Question:**
Your team is migrating a Node.js server from `require()` to `import/export`. What are the practical differences between CommonJS and ES Modules? What breaks during migration?

---

## 🔴 Advanced

### 1. JavaScript Engine Internals

**Question:**
Explain V8's compilation pipeline: how does JavaScript go from source code to optimized machine code? What are "deoptimizations" and what triggers them?

### 2. Structured Clone vs JSON Serialization

**Question:**
You need to deep clone a complex object that contains `Date`, `Map`, `Set`, `ArrayBuffer`, and circular references. Why is `JSON.parse(JSON.stringify(obj))` insufficient? What is `structuredClone()` and what can it handle?

### 3. WeakRef & FinalizationRegistry

**Question:**
Explain `WeakRef` and `FinalizationRegistry` with a practical use case. How does a WeakRef differ from a regular reference in terms of garbage collection?
