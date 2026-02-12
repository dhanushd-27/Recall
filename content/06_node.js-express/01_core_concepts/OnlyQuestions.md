# Node.js Core Concepts

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Event Loop

**Question:** Explain the Node.js event loop. What are the phases (timers, I/O callbacks, poll, check, close) and how does `setTimeout` vs `setImmediate` vs `process.nextTick` differ?

### 2. Modules System

## **Question:** Compare CommonJS (`require`) and ES Modules (`import`). How do you use ESM in Node.js? What issues arise when mixing CJS and ESM?

## 🟡 Intermediate

### 1. Streams

**Question:** What are Node.js streams? Explain Readable, Writable, Transform, and Duplex streams. When do streams outperform loading data into memory?

### 2. Worker Threads

## **Question:** When should you use Worker Threads vs the Cluster module vs child processes? Design a solution for CPU-intensive image processing that doesn't block the event loop.

## 🔴 Advanced

### 1. Memory Management

**Question:** How does V8's garbage collector work in Node.js? How do you diagnose and fix memory leaks using `--inspect`, heap snapshots, and `process.memoryUsage()`?

### 2. Native Addons & N-API

**Question:** When would you write a native addon for Node.js? Compare N-API, `node-addon-api`, and WASM for performance-critical code.
