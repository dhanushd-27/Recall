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

**Answer:**
**Why Impure:**

1. It modifies an external variable (`total`) — this is a **side effect**.
2. It depends on external state. Calling `addToTotal(5)` twice yields different results (`5`, then `10`).

**Refactored (Pure):**
A pure function depends only on its inputs and returns a new value without side effects.

```javascript
function add(currentTotal, amount) {
  return currentTotal + amount;
}
```

**Why this matters in production:**

- Pure functions are **testable** — same input always produces the same output.
- They enable **memoization** — safe to cache results.
- They make code **parallelizable** — no shared mutable state.
- React's rendering model relies heavily on pure component functions.

---

### 2. Higher-Order Functions

**Question:**
Write a function `createMultiplier(n)` that returns a new function. The returned function should take a number `x` and return `x * n`.

```javascript
const double = createMultiplier(2);
console.log(double(5)); // Should log 10
```

**Answer:**
This demonstrates a **Closure** and a **Higher-Order Function** (a function that returns or accepts functions).

```javascript
function createMultiplier(n) {
  return function (x) {
    return x * n;
  };
}
// Arrow function version:
// const createMultiplier = (n) => (x) => x * n;
```

**Real-world use cases:**

- **Middleware factories** in Express: `app.use(cors(options))`
- **Event handler factories** in React: `onClick={handleItemClick(id)}`
- **Configuration-based utilities**: `const api = createFetcher(baseURL)`

---

### 3. Function Expressions vs Declarations

**Question:**
Your teammate writes all utility functions as `const fn = () => {}` while another uses `function fn() {}`. During a code review, a bug is found — a function is called before its definition. Which style caused the bug and why?

**Answer:**
The **function expression** (`const fn = () => {}`) caused the bug.

| Style                 | Hoisting Behavior                                                               |
| --------------------- | ------------------------------------------------------------------------------- |
| `function fn() {}`    | Fully hoisted — can be called before definition                                 |
| `const fn = () => {}` | Variable hoisted but in TDZ — calling before definition throws `ReferenceError` |

**When to choose which:**

- **Function declarations:** When you want hoisting convenience and don't need lexical `this`.
- **Arrow function expressions:** When you need lexical `this` binding (event handlers, callbacks inside classes), and when you want to enforce top-down code reading order.
- **Team convention matters most** — consistency beats individual preference.

---

## 🟡 Intermediate

### 1. Arrow Functions & `this` Context

**Question:**
You have a class where a method loses its `this` context when passed as a callback. How do you fix this?

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
btn.addEventListener("click", handler.handleClick); // 'this' is wrong
```

**Answer:**
**Fix 1 — Bind in Constructor:**

```javascript
constructor() {
  this.clicked = false;
  this.handleClick = this.handleClick.bind(this);
}
```

**Fix 2 — Class Fields with Arrow Function (preferred):**

```javascript
handleClick = () => {
  this.clicked = true;
};
```

**Why arrow functions fix it:**
Standard functions have their own `this` context determined by _how_ they are called. When passed as a callback, `this` becomes `undefined` (strict mode) or the DOM element.

**Arrow functions** do not have their own `this` — they inherit it lexically from the scope they were defined in (the class instance).

**Trade-off:** Arrow function class fields create a new function instance per object (not on the prototype), so they use more memory in classes with many instances. For UI components, this is negligible.

---

### 2. Function Currying

**Question:**
Write a practical `logger` function that uses currying. It should accept a log level first, then the message.

```javascript
const infoLog = logger("INFO");
infoLog("System started"); // Output: [INFO] System started
```

**Answer:**

```javascript
const logger = (level) => (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
};
```

**Why currying matters:**
This pattern allows **partial application** — configuring a generic function once to create specialized versions. This is widely used in:

- **Middleware configuration:** `app.use(rateLimit({ max: 100 }))`
- **Redux action creators:** `const addTodo = createAction("ADD_TODO")`
- **Functional pipelines:** `data.map(formatWith("USD"))`

**Generic curry utility:**

```javascript
const curry = (fn) => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};
```

---

### 3. Function Composition

**Question:**
You have three data transformation functions that need to run in sequence. Write a `pipe` utility to chain them.

**Answer:**

```javascript
const pipe =
  (...fns) =>
  (input) =>
    fns.reduce((acc, fn) => fn(acc), input);

// Usage
const trim = (s) => s.trim();
const toLowerCase = (s) => s.toLowerCase();
const addPrefix = (s) => `user_${s}`;

const normalizeUsername = pipe(trim, toLowerCase, addPrefix);
normalizeUsername("  Alice  "); // "user_alice"
```

**`compose` vs `pipe`:**

| Utility   | Direction    | Usage                                         |
| --------- | ------------ | --------------------------------------------- |
| `pipe`    | Left → Right | More intuitive, reads like a pipeline         |
| `compose` | Right → Left | Mathematical convention, used in FP libraries |

```javascript
const compose =
  (...fns) =>
  (input) =>
    fns.reduceRight((acc, fn) => fn(acc), input);
```

**Production benefits:**

- Each function is independently testable.
- Transformations can be reordered or extended without modifying existing code.
- Used extensively in RxJS, Ramda, and data processing pipelines.

---

## 🔴 Advanced

### 1. Memoization Implementation

**Question:**
Implement a generic `memoize` function. Address production concerns around key generation, memory, and non-serializable arguments.

**Answer:**

```javascript
function memoize(fn, options = {}) {
  const { maxSize = 100, keyFn = JSON.stringify } = options;
  const cache = new Map();

  function memoized(...args) {
    const key = keyFn(args);

    if (cache.has(key)) {
      // Move to end for LRU behavior
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const result = fn.apply(this, args);
    cache.set(key, result);

    // Evict oldest entry if over limit
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }

  memoized.cache = cache;
  memoized.clear = () => cache.clear();
  return memoized;
}
```

**Why `JSON.stringify` is bad for production:**

1. **Performance:** `JSON.stringify` is O(n) — slow for large objects.
2. **Memory leaks:** Without eviction, the cache grows unbounded.
3. **Non-serializable args:** Fails on functions, circular references, `Date`, `Map`, `Set`.
4. **Key collisions:** `{a: 1, b: 2}` and `{b: 2, a: 1}` produce different keys.

**Better key strategies:**

- For primitives: `args.join('|')`
- For single object arg: Use a `WeakMap` (auto-GC'd)
- For complex args: Custom `keyFn` based on domain knowledge

---

### 2. Debounce with Leading/Trailing Options

**Question:**
Implement a `debounce` function that supports `leading` and `trailing` invocation.

**Answer:**

```javascript
function debounce(func, delay, { leading = false, trailing = true } = {}) {
  let timeoutId = null;
  let lastArgs = null;

  function debounced(...args) {
    const callNow = leading && !timeoutId;
    lastArgs = args;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (trailing && lastArgs) {
        func.apply(this, lastArgs);
        lastArgs = null;
      }
    }, delay);

    if (callNow) {
      func.apply(this, args);
      lastArgs = null;
    }
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastArgs = null;
  };

  return debounced;
}
```

**Leading vs Trailing:**

| Mode                   | Behavior                                              | Use Case                             |
| ---------------------- | ----------------------------------------------------- | ------------------------------------ |
| **Trailing** (default) | Fires _after_ the user stops                          | Search input autocomplete            |
| **Leading**            | Fires _immediately_ on first call, ignores subsequent | Submit button anti-double-click      |
| **Both**               | Fires immediately and again after the delay           | Rare, for UI feedback + final action |

---

### 3. Throttle with Cancel & Flush

**Question:**
Implement a production-grade throttle with `.cancel()` and `.flush()`.

**Answer:**

```javascript
function throttle(func, limit) {
  let inThrottle = false;
  let lastArgs = null;
  let lastThis = null;
  let timeoutId = null;

  function throttled(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      timeoutId = setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          throttled.apply(lastThis, lastArgs);
          lastArgs = null;
          lastThis = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastThis = this;
    }
  }

  throttled.cancel = () => {
    clearTimeout(timeoutId);
    inThrottle = false;
    lastArgs = null;
    lastThis = null;
  };

  throttled.flush = () => {
    if (lastArgs) {
      clearTimeout(timeoutId);
      func.apply(lastThis, lastArgs);
      inThrottle = false;
      lastArgs = null;
      lastThis = null;
    }
  };

  return throttled;
}
```

**Throttle vs Debounce decision:**

| Scenario                 | Technique    | Why                                                |
| ------------------------ | ------------ | -------------------------------------------------- |
| Scroll position tracking | **Throttle** | Need periodic updates, not just the final position |
| Window resize handler    | **Debounce** | Only need the final size                           |
| API rate limiting        | **Throttle** | Enforce max calls per interval                     |
| Search-as-you-type       | **Debounce** | Wait for user to stop typing                       |
| Drag-and-drop position   | **Throttle** | Need smooth, periodic updates                      |

**`.flush()` use case:** On page unload, flush any pending analytics events.
**`.cancel()` use case:** When a component unmounts, cancel any pending invocations to prevent state updates on unmounted components.
