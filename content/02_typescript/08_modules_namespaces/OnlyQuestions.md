# Modules & Namespaces

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. ES Modules in TypeScript

**Question:**
Explain `import`/`export` syntax in TypeScript. What is the difference between named exports and default exports? Which does the community prefer and why?

### 2. Module Resolution

**Question:**
You write `import { User } from "./models"` but TypeScript can't find the module. Explain how TypeScript resolves module paths. What role do `baseUrl` and `paths` in `tsconfig.json` play?

---

## 🟡 Intermediate

### 1. Barrel Files

**Question:**
What is a barrel file (`index.ts` that re-exports)? When does this pattern help and when does it hurt (bundle size, circular dependencies)?

### 2. Dynamic Imports & Code Splitting

**Question:**
Show how to use `import()` for lazy loading in TypeScript. How does TypeScript type a dynamically imported module?

### 3. Namespaces vs Modules

**Question:**
When would you ever use `namespace` in modern TypeScript? Why does the TypeScript team recommend modules over namespaces?

---

## 🔴 Advanced

### 1. Module Augmentation

**Question:**
You need to add custom methods to a third-party library's types from a separate file. Explain `declare module` augmentation with a practical example.

### 2. Path Mapping & Project References

**Question:**
In a monorepo, you have shared packages. How do `paths`, `references`, and `composite` in `tsconfig.json` work together to enable cross-package imports with proper type checking?
