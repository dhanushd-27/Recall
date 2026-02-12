# Error Handling

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. `try...catch...finally`

**Question:**
A junior developer wraps an entire 200-line function in a single `try...catch`. Why is this problematic? What are best practices for scoping error handling?

### 2. Custom Error Classes

**Question:**
Your REST API returns different error types (validation errors, auth errors, not-found errors). How would you create custom error classes to handle each differently? Why not just use string messages?

---

## 🟡 Intermediate

### 1. Error Handling in Async Code

**Question:**
Compare error handling approaches for async operations: `try/catch` with `await`, `.catch()` on promises, and unhandled rejection listeners. What happens if you forget to handle a rejected promise?

### 2. Error Boundaries in Production

**Question:**
Your React application crashes with a white screen when a component throws during rendering. How do you prevent one broken component from crashing the entire app? What are the design considerations for error boundaries?

### 3. Graceful Degradation

**Question:**
Your app fetches data from three independent APIs on page load. If one API fails, should the entire page show an error? Design an error handling strategy that shows partial data with degraded functionality.

---

## 🔴 Advanced

### 1. Global Error Handling Strategy

**Question:**
Design a global error handling system for a production Node.js application. It should handle synchronous errors, unhandled promise rejections, and uncaught exceptions differently. How do you ensure errors are logged, reported, and don't crash the server?

### 2. Error Serialization & Monitoring

**Question:**
You need to send JavaScript errors to an error monitoring service (like Sentry). What information do you capture from an `Error` object? Why is `error.stack` unreliable in production (minified code) and how do you solve this?
