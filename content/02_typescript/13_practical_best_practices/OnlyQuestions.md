# Practical Best Practices

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. `tsconfig.json` Essentials

**Question:**
What are the most important `tsconfig.json` options for a new project? Explain `target`, `module`, `moduleResolution`, `strict`, and `outDir`.

### 2. Avoiding Common Mistakes

**Question:**
List five common TypeScript mistakes juniors make (e.g., using `any` everywhere, ignoring strict mode) and how to fix them.

---

## 🟡 Intermediate

### 1. Type-Safe API Contracts

**Question:**
How do you share types between a frontend and backend in a full-stack TypeScript project? Compare approaches: shared package in a monorepo, code generation from OpenAPI, and tRPC.

### 2. Writing Good Generic Code

**Question:**
What are the guidelines for writing readable generic types? When do generics become over-engineered? Show a refactoring from an overly generic function to a cleaner one.

### 3. Migration Strategy

**Question:**
You're tasked with migrating a 100k-line JavaScript codebase to TypeScript. Describe your phased migration plan. How do `allowJs`, `checkJs`, and `// @ts-check` help in incremental adoption?

---

## 🔴 Advanced

### 1. Performance Optimization

**Question:**
Your TypeScript project takes 60 seconds to type-check. What tools and strategies do you use to diagnose and improve type-checking performance? (Hint: `--generateTrace`, project references, type simplification.)

### 2. TypeScript with Build Tools

**Question:**
Compare the TypeScript compilation approaches of Vite, esbuild, SWC, and `tsc`. Which ones type-check? Which ones don't? How do you set up a modern build pipeline that's both fast and type-safe?
