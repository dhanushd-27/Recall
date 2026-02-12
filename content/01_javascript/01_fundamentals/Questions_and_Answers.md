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

**Answer:**
This will throw a `TypeError: Cannot mix BigInt and other types, use explicit conversions`.

JavaScript does not automatically coerce `BigInt` to `Number` (or vice versa) in arithmetic operations to avoid precision loss.

**Fix:**
You must explicitly convert one of the operands:

```javascript
console.log(Number(bigIntVal) + numVal); // 30 (Loss of precision possible for huge BigInts)
// OR
console.log(bigIntVal + BigInt(numVal)); // 30n (Result is BigInt)
```

**⚠️ Common Mistake:** Using `Number()` on very large BigInts silently loses precision. Always convert the smaller type _up_ to BigInt when precision matters.

---

### 2. Truthy & Falsy Values

**Question:**
You are reviewing a pull request with this configuration logic:

```javascript
// userSettings.timeout is 0 (intentional 0ms timeout)
const timeout = userSettings.timeout || 5000;
```

What is the potential bug here? How would you fix it to respect the user's intent?

**Answer:**
The bug is that `0` is a **falsy** value in JavaScript. If `userSettings.timeout` is `0`, the `||` (OR) operator will see it as false and return the default `5000`, ignoring the user's setting.

**Fix:**
Use the **Nullish Coalescing Operator** (`??`), which only falls back on `null` or `undefined`, allowing `0`, `false`, or `""` to pass through.

```javascript
const timeout = userSettings.timeout ?? 5000;
```

**Real-world impact:** This bug is extremely common in production code — any setting that can legitimately be `0`, `false`, or `""` is vulnerable. The `??` operator (ES2020) was introduced specifically to solve this class of bugs.

---

### 3. Variables: `var` vs `let`/`const`

**Question:**
What is the output of the following code? Refactor it using modern JavaScript (`let` or `const`) to log `0, 1, 2` sequentially.

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

**Answer:**
**Output:** `3, 3, 3`

**Reason:**
`var` is function-scoped (or global-scoped here), not block-scoped. By the time the `setTimeout` callbacks run (after 100ms), the loop has finished, and the single variable `i` has been incremented to `3`. All callbacks reference this same `i`.

**Fix:**
Use `let`, which is block-scoped. Each iteration of the loop creates a fresh binding for `i`.

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

**Pre-ES6 alternative (IIFE):**

```javascript
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
```

---

### 4. `typeof` Quirks

**Question:**
A junior developer is confused by the following results. Explain each one and identify the historical bug.

```javascript
console.log(typeof null); // ?
console.log(typeof undefined); // ?
console.log(typeof NaN); // ?
console.log(typeof function () {}); // ?
```

**Answer:**

| Expression            | Result        | Explanation                                                                                                                      |
| --------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `typeof null`         | `"object"`    | **Historical bug** from JS v1.0 — `null`'s internal type tag was `0` (same as objects). Never fixed for backwards compatibility. |
| `typeof undefined`    | `"undefined"` | Correct. `undefined` is its own type.                                                                                            |
| `typeof NaN`          | `"number"`    | `NaN` is technically a special IEEE 754 floating-point value — it _is_ a number type, just not a valid one.                      |
| `typeof function(){}` | `"function"`  | Functions get their own `typeof` result, even though they are technically objects.                                               |

**Production tip:** Never use `typeof x === "object"` to check for objects without also checking `x !== null`.

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

**Answer:**
**Output:** This code throws a `ReferenceError` before reaching Line A.

**Reason:**
Inside `inner()`, we declare `let x = 30`. This shadows the outer `x`. However, due to the **Temporal Dead Zone (TDZ)**, the variable `x` is hoisted to the top of the block but remains uninitialized until the declaration line is reached. Accessing `x` (in `x++`) _before_ the declaration throws an error.

**Key takeaway:** `let` and `const` are hoisted but **not initialized**. The region between the block start and the declaration is the TDZ.

**Follow-up:**
If we remove `let x = 30` from `inner`, then `x++` modifies the `x` from `outer` scope (closure). Line B would log `21`.

---

### 2. Type Coercion in APIs

**Question:**
You are consuming a third-party API that returns numerical IDs as strings (e.g., `"123"`). You need to use these IDs for calculations.
Which method would you use to convert them: `Number()`, `parseInt()`, or the unary plus `+`? What are the edge cases and trade-offs for each?

**Answer:**

| Method                  | Behavior                                                                      | Edge Cases                                                  |
| ----------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `Number("123")`         | Strict conversion. Returns `NaN` for non-numeric strings (except whitespace). | `Number("") → 0`, `Number("123px") → NaN`                   |
| `+"123"` (unary plus)   | Identical behavior to `Number()`.                                             | Same as above.                                              |
| `parseInt("123px", 10)` | Parses until it hits a non-digit. Extracts leading numbers.                   | `parseInt("") → NaN`, `parseInt("0x1A") → 26` (hex parsing) |

**Recommendation:**

- Use `Number()` or `+` if you expect strictly valid numbers and want to **fail fast** on garbage data.
- Use `parseInt(str, 10)` — always with radix `10` — if you need to extract numbers from mixed strings.
- For API data, prefer `Number()` because it's stricter and explicit about failures.

**⚠️ Common Mistake:** Forgetting the radix in `parseInt("08")` — in older engines it parsed as octal.

---

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

**Answer:**

- **Function Declarations (`b`)** are fully hoisted — the entire function body is moved to the top of the scope, so it can be called before definition.
- **Variables declared with `const` (`a`)** are hoisted but stay in the **TDZ** until the line of code is executed. Calling `a` before initialization fails.

**Trade-off in codebase style:**
Teams that use `function` declarations get hoisting convenience but lose arrow function's lexical `this`. Teams that use `const` arrow functions get consistency but must define functions before use.

---

### 4. `structuredClone` vs Spread

**Question:**
Your team is debating how to deep copy a configuration object that contains `Date` objects, `Map` instances, and nested arrays. A colleague proposes `JSON.parse(JSON.stringify(obj))`. What will go wrong? What modern alternative would you recommend?

**Answer:**
**Problems with `JSON.parse(JSON.stringify(obj))`:**

| Type          | What happens                                         |
| ------------- | ---------------------------------------------------- |
| `Date`        | Serialized to string, not restored as `Date`         |
| `Map` / `Set` | Serialized to `{}` (empty object)                    |
| `undefined`   | Stripped from objects, converted to `null` in arrays |
| `RegExp`      | Serialized to `{}`                                   |
| Functions     | Stripped entirely                                    |
| Circular refs | Throws `TypeError`                                   |

**Modern solution — `structuredClone()` (2022+):**

```javascript
const copy = structuredClone(original);
```

- ✅ Handles `Date`, `Map`, `Set`, `ArrayBuffer`, `RegExp`
- ✅ Handles circular references
- ❌ Cannot clone functions, DOM nodes, or `Error` objects
- Available in all modern browsers and Node.js 17+

**When to use what:**

- **Shallow copy:** Spread `{ ...obj }` or `Object.assign()`
- **Deep copy of serializable data:** `structuredClone()`
- **Complex cloning with functions:** Use a library like `lodash.cloneDeep`

---

## 🔴 Advanced

### 1. `WeakRef` and `FinalizationRegistry`

**Question:**
You are building a caching layer for expensive DOM computations. Explain how `WeakRef` and `FinalizationRegistry` can help you build a cache that doesn't cause memory leaks. When would you still prefer a `Map`-based LRU cache instead?

**Answer:**

```javascript
const cache = new Map();
const registry = new FinalizationRegistry((key) => {
  cache.delete(key); // Cleanup when target is GC'd
});

function getCachedResult(key, computeFn) {
  const ref = cache.get(key);
  if (ref) {
    const value = ref.deref();
    if (value !== undefined) return value;
  }

  const result = computeFn();
  cache.set(key, new WeakRef(result));
  registry.register(result, key);
  return result;
}
```

**How it works:**

- `WeakRef` holds a weak reference to the cached value — it doesn't prevent garbage collection.
- `FinalizationRegistry` runs a callback when the referenced object is GC'd, letting you clean up the cache entry.

**When to prefer LRU Map instead:**

- When caching **primitive values** (WeakRef only works with objects).
- When you need **deterministic eviction** — GC timing is unpredictable.
- When you need **cache hit guarantees** within a time window.

**⚠️ Caution:** `FinalizationRegistry` callbacks are non-deterministic and may never run. Never rely on them for critical cleanup.

---

### 2. Engine-Level Optimizations

**Question:**
A performance audit shows that a hot function in your Node.js service is being "de-optimized" by V8. What common JavaScript patterns cause V8 to bail out of optimized (TurboFan) code? How would you diagnose this using `--trace-deopt`?

**Answer:**

**Patterns that cause de-optimization:**

1. **Changing object shapes (hidden classes):** Adding/deleting properties after construction.
2. **Polymorphic call sites:** Calling a function with different argument types across invocations.
3. **`arguments` object leaking:** Passing `arguments` to other functions prevents optimization.
4. **`try/catch` in hot paths:** Historically de-optimized (modern V8 handles this better).
5. **`delete` operator:** Changes object shape, forces dictionary mode.
6. **Megamorphic property access:** Accessing properties on objects with too many different shapes.

**Diagnosis:**

```bash
node --trace-deopt --trace-opt app.js 2>&1 | grep "DEOPT"
```

**Best practices for hot paths:**

- Keep object shapes consistent (always initialize all properties in constructors).
- Use monomorphic functions (same argument types).
- Avoid `delete` — use `obj.key = undefined` instead.
- Pre-allocate arrays with known sizes.

---

### 3. Proxy-Based Validation

**Question:**
Design a `Proxy`-based schema validator that enforces type constraints on an object at runtime. For example, setting `user.age = "hello"` should throw, but `user.age = 25` should succeed. What are the performance implications of using `Proxy` in hot paths?

**Answer:**

```javascript
function createValidated(schema, data = {}) {
  return new Proxy(data, {
    set(target, prop, value) {
      const expectedType = schema[prop];
      if (expectedType && typeof value !== expectedType) {
        throw new TypeError(
          `Property "${prop}" must be ${expectedType}, got ${typeof value}`,
        );
      }
      target[prop] = value;
      return true;
    },
    get(target, prop) {
      if (!(prop in target) && prop in schema) {
        return undefined; // Known property, not yet set
      }
      return target[prop];
    },
  });
}

// Usage
const user = createValidated(
  { name: "string", age: "number", active: "boolean" },
  { name: "Alice", age: 30, active: true },
);

user.age = 31; // ✅ Works
user.age = "thirty"; // ❌ TypeError
```

**Performance implications:**

- Proxy traps add ~5-10x overhead per property access compared to plain objects.
- V8 cannot inline or optimize Proxy traps with TurboFan.
- **Use Proxies for:** Development-time validation, API boundaries, configuration objects.
- **Avoid Proxies for:** Hot loops, render paths, high-frequency data processing.
- **Alternative for production:** Use a compilation step (TypeScript) or schema validation at API boundaries only (Zod, Yup).
