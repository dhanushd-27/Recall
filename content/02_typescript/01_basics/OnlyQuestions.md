# TypeScript Basics

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Why TypeScript?

**Question:**
A team lead asks why you would introduce TypeScript into an existing JavaScript project. What concrete problems does TypeScript solve? When might TypeScript NOT be the right choice?

### 2. Type Annotations vs Inference

**Question:**
When should you explicitly annotate types versus letting TypeScript infer them? Give examples where inference is sufficient and where explicit annotations are necessary.

### 3. `any` vs `unknown`

**Question:**
Your codebase has dozens of `any` types. A senior engineer asks you to replace them. What is the difference between `any` and `unknown`? When is `unknown` the correct choice?

---

## 🟡 Intermediate

### 1. `type` vs `interface`

**Question:**
In a code review, two developers disagree: one uses `type` for everything, the other uses `interface`. What are the practical differences? When does it matter which one you choose?

### 2. Utility Types in Practice

**Question:**
You have an existing `User` type and need to create several derived types: one for creating users (no `id`), one for partial updates, and one for displaying users (no `password`). Which utility types do you use?

```typescript
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};
```

### 3. Enums vs Union Types

**Question:**
Your team debates whether to use `enum` or string literal union types for status values. Compare the runtime behavior, bundle size, and type safety of each approach. Which do you recommend for a modern TypeScript project?

---

## 🔴 Advanced

### 1. Type Narrowing & Discriminated Unions

**Question:**
Design a type-safe API response handler using discriminated unions. The API can return `success`, `error`, or `loading` states. Show how TypeScript narrows the type in each branch.

### 2. Declaration Merging

**Question:**
You're extending a third-party library's types to add custom properties. How does declaration merging work with interfaces? Give an example of augmenting Express's `Request` type.

### 3. TypeScript Compiler Architecture

**Question:**
Explain the TypeScript compilation pipeline. What is the difference between type checking and transpilation? Why can you run TypeScript with `--noCheck` or tools like `esbuild` that skip type checking?
