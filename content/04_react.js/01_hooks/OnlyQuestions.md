# React Hooks

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. `useState` & `useEffect`

**Question:**
Explain how `useState` and `useEffect` work. What is the mental model for the dependency array in `useEffect`?

### 2. Rules of Hooks

**Question:**
What are the "Rules of Hooks" and why do they exist? What happens if you call a hook inside a condition or loop?

---

## 🟡 Intermediate

### 1. `useRef` vs `useState`

**Question:**
When should you use `useRef` instead of `useState`? Give three distinct use cases for `useRef` beyond holding DOM references.

### 2. `useMemo` & `useCallback`

**Question:**
A junior developer adds `useMemo` and `useCallback` to every component "for performance." Why is this often counter-productive? When are these hooks genuinely needed?

### 3. Custom Hooks

**Question:**
Design a custom `useDebounce(value, delay)` hook. What makes a good custom hook? How do you test one?

---

## 🔴 Advanced

### 1. `useReducer` vs `useState`

**Question:**
When does `useReducer` become a better choice than multiple `useState` calls? Design a complex form state with `useReducer` that handles validation, dirty tracking, and submission.

### 2. `useSyncExternalStore`

**Question:**
What problem does `useSyncExternalStore` solve? How does it relate to "tearing" in concurrent rendering? When do you need it vs `useState`?

### 3. The `use` Hook (React 19)

**Question:**
What is the new `use()` hook in React 19? How does it differ from `useContext` and `await` for promises? What new patterns does it enable?
