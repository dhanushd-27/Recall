# JavaScript Functions

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Pure Functions

**Question:**
Refactor the following function to be a **Pure Function**. Why is it currently impure?

```javascript
let total = 0;

function addToTotal(amount) {
  total += amount;
  return total;
}
```

### 2. Higher-Order Functions

**Question:**
Write a function `createMultiplier(n)` that returns a new function. The returned function should take a number `x` and return `x * n`.

```javascript
const double = createMultiplier(2);
console.log(double(5)); // Should log 10
```

### 3. Function Expressions vs Declarations

**Question:**
Your teammate writes all utility functions as `const fn = () => {}` while another uses `function fn() {}`. During a code review, a bug is found — a function is called before its definition. Which style caused the bug and why? When would you choose one over the other?

---

## 🟡 Intermediate

### 1. Arrow Functions & `this` Context

**Question:**
You have a class component (or object) where a method loses its `this` context when passed as a callback.

```javascript
class ButtonHandler {
  constructor() {
    this.clicked = false;
  }

  handleClick() {
    this.clicked = true;
    console.log("Clicked:", this.clicked);
  }
}

const handler = new ButtonHandler();
const btn = document.querySelector("button");

// Problem: 'this' is undefined or the button element inside handleClick
btn.addEventListener("click", handler.handleClick);
```

How do you fix this? Explain why the arrow function solution works.

### 2. Function Currying

**Question:**
Write a practical `logger` function that uses currying. It should accept a log level (e.g., "INFO", "ERROR") first, and then the message.

**Goal:**

```javascript
const infoLog = logger("INFO");
infoLog("System started"); // Output: [INFO] System started
```

### 3. Function Composition

**Question:**
You have three data transformation functions that need to run in sequence: `trim`, `toLowerCase`, and `addPrefix`. Write a `compose` (right-to-left) or `pipe` (left-to-right) utility to chain them. What is the advantage of this pattern in production data pipelines?

---

## 🔴 Advanced

### 1. Memoization Implementation

**Question:**
Implement a generic `memoize` function that caches the results of expensive function calls. Address these production concerns:

- Why is `JSON.stringify` for cache keys bad in production?
- How would you add a max cache size (LRU eviction)?
- What happens with object arguments that are referentially different but structurally identical?

### 2. Debounce with Leading/Trailing Options

**Question:**
Implement a `debounce` function that supports both `leading` and `trailing` invocation options. Explain the difference and give a real-world scenario for each mode.

### 3. Throttle with Cancel & Flush

**Question:**
Implement a production-grade `throttle` function that includes `.cancel()` and `.flush()` methods. When would you use throttle over debounce in a scroll-heavy application?
