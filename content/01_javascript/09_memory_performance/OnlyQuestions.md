# Memory & Performance

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Garbage Collection

**Question:**
How does JavaScript automatically free memory? What algorithm does V8 use and what does "reachable" mean in this context?

### 2. Common Memory Leak Patterns

**Question:**
Your Node.js server's memory usage grows continuously over 24 hours. Name three common patterns that cause memory leaks in JavaScript and how to prevent each.

---

## 🟡 Intermediate

### 1. Debounce vs Throttle

**Question:**
You have both a search input and a scroll-tracking feature on the same page. Which technique (debounce or throttle) do you use for each and why? Implement both from scratch.

### 2. Memoization Trade-offs

**Question:**
Your team memoized a function that computes derived data from API responses, but the app's memory usage spiked in production. What likely went wrong? How do you build a memoization strategy with bounded memory?

### 3. Web Workers

**Question:**
You need to parse and transform a 50MB CSV file in the browser without freezing the UI. How would you use a Web Worker for this? What data can and cannot be transferred between the main thread and a worker?

---

## 🔴 Advanced

### 1. Performance Profiling

**Question:**
A React dashboard renders sluggishly with 10,000 data points. Walk through your debugging workflow using Chrome DevTools' Performance panel. What metrics do you look for and what are common causes of layout thrashing?

### 2. Memory Profiling in Production

**Question:**
How do you detect memory leaks in a production Node.js application? Compare heap snapshots, `process.memoryUsage()`, and `--inspect` approaches. What patterns do you look for in heap snapshot comparisons?
