# JavaScript Closures & Scope

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Scope Types

**Question:**
What are the three main types of scope in JavaScript?

**Answer:**

| Scope        | Created By              | Visibility                |
| ------------ | ----------------------- | ------------------------- |
| **Global**   | Top-level declarations  | Everywhere in the program |
| **Function** | `function` keyword      | Inside the function only  |
| **Block**    | `{}` with `let`/`const` | Inside the block only     |

```javascript
const globalVar = "global"; // Global scope

function example() {
  const funcVar = "function"; // Function scope

  if (true) {
    const blockVar = "block"; // Block scope
    var notBlockScoped = "oops"; // Function scope (var ignores blocks!)
  }

  console.log(notBlockScoped); // ✅ "oops" — var leaks out of blocks
  console.log(blockVar); // ❌ ReferenceError
}
```

**Key insight:** `var` is function-scoped (ignores `if`/`for` blocks), while `let`/`const` are block-scoped. This is why `let` was introduced.

---

### 2. Closure Definition

**Question:**
What is a closure?

**Answer:**
A closure is a function that **remembers and accesses variables from its outer scope**, even after the outer function has finished executing.

```javascript
function createGreeter(greeting) {
  // `greeting` is "closed over" — retained in memory
  return function (name) {
    return `${greeting}, ${name}!`;
  };
}

const hello = createGreeter("Hello");
const hola = createGreeter("Hola");

hello("Alice"); // "Hello, Alice!"
hola("Bob"); // "Hola, Bob!"
```

**What's happening under the hood:**

- When `createGreeter("Hello")` returns, its execution context is popped from the call stack.
- But the returned function maintains a reference to `greeting` through its **lexical environment** (closure).
- The garbage collector cannot collect `greeting` because it's still referenced.

**Every function in JavaScript is a closure** — it always maintains a reference to the scope in which it was created.

---

## 🟡 Intermediate

### 1. Data Privacy with Closures

**Question:**
Create a function `createSecret(secret)` that returns an object with `getSecret()` and `setSecret(newSecret)` methods. The secret should not be directly accessible.

**Answer:**

```javascript
function createSecret(initialSecret) {
  let secret = initialSecret; // Private — only accessible via closures

  return {
    getSecret() {
      return secret;
    },
    setSecret(newSecret) {
      if (typeof newSecret !== "string" || newSecret.length === 0) {
        throw new Error("Secret must be a non-empty string");
      }
      secret = newSecret;
    },
  };
}

const vault = createSecret("myPassword123");
vault.getSecret(); // "myPassword123"
vault.setSecret("newPassword456");
vault.getSecret(); // "newPassword456"
vault.secret; // undefined — cannot access directly!
```

**This is the "revealing module pattern"** — one of the most important design patterns in pre-ES6 JavaScript. It provides:

- **Encapsulation** — `secret` is truly private.
- **Controlled access** — validation can be added to setters.
- **Interface stability** — internal implementation can change without breaking consumers.

**Modern alternative:** Private class fields (`#secret`), available since ES2022.

---

### 2. Closure in Loops

**Question:**
Why does this log `3, 3, 3`? How does `let` fix it?

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

**Answer:**

**With `var`:** There is only **one** `i` variable (function-scoped). All three callbacks close over the **same** `i`. By the time the timeouts fire, `i` is `3`.

**With `let`:** Each loop iteration creates a **new** `i` binding (block-scoped). Each callback closes over its own `i`.

```javascript
// Conceptually, let creates this:
{
  let i = 0;
  setTimeout(() => console.log(i), 100); // Captures i = 0
}
{
  let i = 1;
  setTimeout(() => console.log(i), 100); // Captures i = 1
}
{
  let i = 2;
  setTimeout(() => console.log(i), 100); // Captures i = 2
}
```

**Pre-ES6 fix (IIFE):**

```javascript
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 100);
  })(i); // Immediately invoke with current i
}
```

---

### 3. Module Pattern

**Question:**
Implement a `Counter` module using closures that exposes `increment()`, `decrement()`, and `getCount()`.

**Answer:**

```javascript
const Counter = (function () {
  let count = 0; // Private state

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    },
  };
})(); // Immediately Invoked Function Expression (IIFE)

Counter.increment(); // 1
Counter.increment(); // 2
Counter.decrement(); // 1
Counter.getCount(); // 1
Counter.count; // undefined — private!
```

**Why this pattern was important:**

- Before ES Modules (`import/export`), JavaScript had no native module system.
- The IIFE + closure pattern was the only way to create private state.
- Libraries like jQuery, Lodash, and Backbone were built this way.
- Node.js's `require()` wraps each file in a function for the same reason.

---

## 🔴 Advanced

### 1. Memory Leaks with Closures

**Question:**
How can closures cause memory leaks? Give a specific example and how to fix it.

**Answer:**

```javascript
// ❌ Memory leak — closures retain references to entire outer scope
function createHandler() {
  const hugeData = new Array(1_000_000).fill("x"); // 1M strings

  return function handleClick() {
    // Only uses hugeData.length, but closure retains ALL of hugeData
    console.log("Data size:", hugeData.length);
  };
}

// The handler keeps hugeData alive as long as handler exists
const handler = createHandler();
document.addEventListener("click", handler);
// hugeData (millions of strings) can NEVER be garbage collected
```

**Fix strategies:**

```javascript
// Fix 1: Extract only what you need
function createHandler() {
  const hugeData = new Array(1_000_000).fill("x");
  const length = hugeData.length; // Extract needed value

  return function handleClick() {
    console.log("Data size:", length); // Only captures `length`
  };
  // hugeData is now eligible for GC after createHandler returns
}

// Fix 2: Nullify the reference
function createHandler() {
  let hugeData = new Array(1_000_000).fill("x");
  const length = hugeData.length;
  hugeData = null; // Allow GC

  return function handleClick() {
    console.log("Data size:", length);
  };
}

// Fix 3: Remove event listeners when done
const handler = createHandler();
element.addEventListener("click", handler);
// Later:
element.removeEventListener("click", handler);
```

**Detection tools:**

- Chrome DevTools → Memory tab → Heap Snapshot.
- Node.js: `--inspect` + Chrome DevTools, or `process.memoryUsage()`.
- Look for retained size growing over time in heap snapshots.

---

### 2. React Hooks & Stale Closures

**Question:**
Why does clicking the button always log `0`? How do you fix it?

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // Always logs 0!
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{count}</p>;
}
```

**Answer:**
**The problem:** The `useEffect` callback captures the initial `count` value (`0`) in its closure. Since the dependency array is `[]`, this effect never re-runs, so `count` inside the interval callback is **always** `0`.

**Fix 1 — Functional updater (recommended):**

```javascript
useEffect(() => {
  const id = setInterval(() => {
    setCount((prev) => prev + 1); // Always uses latest state
  }, 1000);
  return () => clearInterval(id);
}, []); // Safe — no stale dependency
```

**Fix 2 — Use a ref for the latest value:**

```javascript
const countRef = useRef(count);
countRef.current = count; // Always update the ref

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current); // Always latest
  }, 1000);
  return () => clearInterval(id);
}, []);
```

**Why this happens:**

- React hooks rely on closures to capture state values.
- Each render creates a new closure with that render's state.
- `useEffect` with `[]` only captures the closure from the **first** render.
- The `setCount(prev => prev + 1)` pattern bypasses the closure by receiving the latest state from React directly.

**Rule of thumb:** If you reference state inside `useEffect` but don't include it in deps, you have a stale closure. The ESLint `exhaustive-deps` rule catches this.

---

### 3. Closure-Based State Machines

**Question:**
Implement a traffic light state machine using closures.

**Answer:**

```javascript
function createTrafficLight() {
  const transitions = {
    green: "yellow",
    yellow: "red",
    red: "green",
  };
  let currentState = "green";

  return {
    next() {
      currentState = transitions[currentState];
      return currentState;
    },
    getState() {
      return currentState;
    },
    reset() {
      currentState = "green";
    },
  };
}

const light = createTrafficLight();
light.getState(); // "green"
light.next(); // "yellow"
light.next(); // "red"
light.next(); // "green"
```

**Closure vs Class with private fields:**

| Feature             | Closure Pattern                         | Class with `#private`             |
| ------------------- | --------------------------------------- | --------------------------------- |
| Truly private       | ✅ No access at all                     | ✅ `#field` is private            |
| Memory per instance | Each instance gets new function objects | Methods shared on prototype       |
| `instanceof` check  | ❌                                      | ✅                                |
| Serialization       | ❌ Functions can't be serialized        | ❌ Same                           |
| Best for            | Small, self-contained utilities         | Complex objects with many methods |

**When to use closures for state machines:**

- Simple, self-contained state (like this example).
- When you want zero external dependencies.
- When you want guaranteed encapsulation without relying on `#private` support.

**For complex state machines:** Use libraries like XState that provide visual debugging, type safety, and hierarchical/parallel states.
