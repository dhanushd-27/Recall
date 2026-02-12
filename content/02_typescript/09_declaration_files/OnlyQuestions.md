# Declaration Files

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. What Are Declaration Files?

**Question:**
What is a `.d.ts` file? Why do some npm packages include them while others need `@types/` packages?

### 2. The `declare` Keyword

**Question:**
What does `declare` mean in TypeScript? When do you use `declare const`, `declare function`, and `declare module`?

---

## 🟡 Intermediate

### 1. Writing Declaration Files

**Question:**
You have a JavaScript utility library without types. Write a declaration file for a module that exports a function `formatDate(date: Date, format: string): string` and a constant `VERSION: string`.

### 2. Triple-Slash Directives

**Question:**
What are `/// <reference types="..." />` and `/// <reference path="..." />`? When are they still needed in modern TypeScript projects?

### 3. Ambient Declarations

**Question:**
Your app uses a global `config` object injected by the server at runtime. How do you declare its type so TypeScript recognizes `window.config.apiUrl`?

---

## 🔴 Advanced

### 1. Declaration File Generation

**Question:**
Explain the `declaration`, `declarationMap`, and `emitDeclarationOnly` compiler options. How do you publish a TypeScript library with both JS and `.d.ts` output?

### 2. Conditional Types in Declaration Files

**Question:**
How do library authors use conditional types and overloads in `.d.ts` files to provide different type signatures based on input types (e.g., `document.querySelector` returning different element types)?
