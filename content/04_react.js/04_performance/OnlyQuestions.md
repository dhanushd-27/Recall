# React Performance

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Re-Rendering

**Question:**
What causes a React component to re-render? How does React's reconciliation algorithm decide what DOM updates to make?

### 2. Keys in Lists

**Question:**
Why does React need `key` props on list items? What happens when you use array index as a key?

---

## 🟡 Intermediate

### 1. `React.memo` & When to Skip It

**Question:**
What does `React.memo` do? When does it genuinely improve performance vs when is it wasted effort?

### 2. Code Splitting & Lazy Loading

**Question:**
How do `React.lazy` and `Suspense` enable code splitting? Design a route-based code splitting strategy for a large application.

---

## 🔴 Advanced

### 1. React Compiler (React 19)

**Question:**
What is the React Compiler (formerly React Forget)? How does it auto-memoize components and eliminate the need for `useMemo`/`useCallback`?

### 2. Profiling & Debugging

**Question:**
Your React app has noticeable jank. Walk through the debugging process using React DevTools Profiler, Chrome Performance tab, and `why-did-you-render`. What are the most common causes of poor performance?
