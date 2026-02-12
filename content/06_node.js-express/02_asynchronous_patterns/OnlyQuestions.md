# Asynchronous Patterns

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Callbacks vs Promises vs Async/Await

**Question:** Trace the evolution from callback to Promise to async/await in Node.js. Why does each exist and which should you use today?

### 2. Error Handling in Async Code

## **Question:** How do you properly handle errors in async functions? What happens when a Promise rejects without a catch handler? What is `unhandledRejection`?

## 🟡 Intermediate

### 1. Concurrency Patterns

**Question:** Compare `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`. When do you use each? Show a real-world example of fetching data from multiple services with a timeout.

### 2. Event Emitter Patterns

## **Question:** How does `EventEmitter` work under the hood? Design an event-driven architecture for an order processing system.

## 🔴 Advanced

### 1. AsyncLocalStorage

**Question:** What is `AsyncLocalStorage`? How does it enable request-scoped context (like request IDs for logging) without passing context through every function?

### 2. Backpressure in Streams

**Question:** What is backpressure? When does it occur and how does Node.js handle it automatically with `pipe()`? What happens when you ignore backpressure signals?
