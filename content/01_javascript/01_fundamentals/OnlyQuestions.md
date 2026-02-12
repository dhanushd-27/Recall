# JavaScript Fundamentals

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Data Types & Type Mixing

**Question:**
Review the following code snippet. What will be logged to the console and why? How would you fix the error if one occurs?

```javascript
const bigIntVal = 10n;
const numVal = 20;

console.log(bigIntVal + numVal);
```

### 2. Truthy & Falsy Values

**Question:**
You are reviewing a pull request with this configuration logic:

```javascript
// userSettings.timeout is 0 (intentional 0ms timeout)
const timeout = userSettings.timeout || 5000;
```

What is the potential bug here? How would you fix it to respect the user's intent?

### 3. Variables: `var` vs `let`/`const`

**Question:**
What is the output of the following code? Refactor it using modern JavaScript (`let` or `const`) to log `0, 1, 2` sequentially.

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

### 4. `typeof` Quirks

**Question:**
A junior developer is confused by the following results. Explain each one and identify the historical bug.

```javascript
console.log(typeof null); // ?
console.log(typeof undefined); // ?
console.log(typeof NaN); // ?
console.log(typeof function () {}); // ?
```

---

## 🟡 Intermediate

### 1. Scope & Variable Tracing

**Question:**
Consider the following code. What will be logged to the console at line A and line B? Explain your reasoning.

```javascript
let x = 10;

function outer() {
  let x = 20;

  function inner() {
    x++;
    let x = 30; // Line A (Assume executed)
    console.log(x);
  }

  inner();
  console.log(x); // Line B
}
```

### 2. Type Coercion in APIs

**Question:**
You are consuming a third-party API that returns numerical IDs as strings (e.g., `"123"`). You need to use these IDs for calculations.
Which method would you use to convert them: `Number()`, `parseInt()`, or the unary plus `+`? What are the edge cases and trade-offs for each?

### 3. The "Temporal Dead Zone"

**Question:**
Review this snippet. Why does function `b` work, but `a` fails?

```javascript
b(); // Works
a(); // ReferenceError

const a = () => console.log("a");
function b() {
  console.log("b");
}
```

### 4. `structuredClone` vs Spread

**Question:**
Your team is debating how to deep copy a configuration object that contains `Date` objects, `Map` instances, and nested arrays. A colleague proposes `JSON.parse(JSON.stringify(obj))`. What will go wrong? What modern alternative would you recommend?

---

## 🔴 Advanced

### 1. `WeakRef` and `FinalizationRegistry`

**Question:**
You are building a caching layer for expensive DOM computations. Explain how `WeakRef` and `FinalizationRegistry` can help you build a cache that doesn't cause memory leaks. When would you still prefer a `Map`-based LRU cache instead?

### 2. Engine-Level Optimizations

**Question:**
A performance audit shows that a hot function in your Node.js service is being "de-optimized" by V8. What common JavaScript patterns cause V8 to bail out of optimized (TurboFan) code? How would you diagnose this using `--trace-deopt`?

### 3. Proxy-Based Validation

**Question:**
Design a `Proxy`-based schema validator that enforces type constraints on an object at runtime. For example, setting `user.age = "hello"` should throw, but `user.age = 25` should succeed. What are the performance implications of using `Proxy` in hot paths?
