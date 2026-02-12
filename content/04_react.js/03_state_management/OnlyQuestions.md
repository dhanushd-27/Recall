# State Management

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Lifting State Up

**Question:**
Two sibling components need to share state. Explain "lifting state up" and why it's the first solution to try before reaching for global state.

### 2. Context API

**Question:**
What is `React.createContext` and `useContext`? When is Context the right tool vs when should you use a state management library?

---

## 🟡 Intermediate

### 1. Context Performance

**Question:**
A developer puts the entire app state into a single Context. Every component re-renders on any state change. How do you fix this? Explain Context splitting, memoization, and when to move to external state.

### 2. Zustand vs Redux vs Jotai

**Question:**
Compare modern state management libraries. When would you choose Zustand, Redux Toolkit, or Jotai? What are their trade-offs in terms of boilerplate, performance, and dev experience?

---

## 🔴 Advanced

### 1. Server State vs Client State

**Question:**
What is "server state" and how does TanStack Query (React Query) change the way you think about state management? How does it handle caching, revalidation, and optimistic updates?

### 2. State Machines with XState

**Question:**
When is a state machine (XState) better than `useState`/`useReducer`? Design a state machine for a multi-step checkout flow with validation, error recovery, and payment processing.
