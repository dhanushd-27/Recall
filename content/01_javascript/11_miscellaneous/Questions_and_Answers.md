# Miscellaneous JavaScript

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. `typeof` vs `instanceof`

**Question:**
Why does `typeof null` return `"object"`? How do you reliably check types?

**Answer:**
**`typeof null === "object"`** is a historical bug from JavaScript's first implementation (1995). Null's type tag was `0`, which was the same as objects. It can't be fixed because it would break existing code.

**Reliable type checking:**

```javascript
typeof "hello"; // "string" ✅
typeof 42; // "number" ✅
typeof true; // "boolean" ✅
typeof undefined; // "undefined" ✅
typeof Symbol(); // "symbol" ✅
typeof BigInt(1); // "bigint" ✅
typeof {}; // "object" ✅
typeof null; // "object" ❌ (bug)
typeof []; // "object" ❌ (arrays are objects)
typeof function () {}; // "function" ✅

// Reliable null check
value === null;

// Array check
Array.isArray(value);

// Instance check
value instanceof Date;
value instanceof Map;

// Most reliable (works across iframes)
Object.prototype.toString.call(value); // "[object Null]", "[object Array]", etc.
```

---

### 2. Strict Mode

**Question:**
What does `"use strict"` change?

**Answer:**
Three key differences:

**1. Accidental globals throw:**

```javascript
// Non-strict: creates global variable silently
function bad() {
  oops = "global";
} // No error!

// Strict: throws ReferenceError
("use strict");
function bad() {
  oops = "global";
} // ❌ ReferenceError
```

**2. `this` defaults to `undefined`:**

```javascript
// Non-strict: this === globalThis (window/global)
function fn() {
  console.log(this);
} // window

// Strict: this === undefined
("use strict");
function fn() {
  console.log(this);
} // undefined
```

**3. Silent failures become errors:**

```javascript
"use strict";
const obj = Object.freeze({ x: 1 });
obj.x = 2; // ❌ TypeError (non-strict: silently fails)

delete Object.prototype; // ❌ TypeError
```

**Note:** ES Modules and class bodies are always in strict mode automatically.

---

### 3. Value vs Reference

**Question:**
Why does modifying a copy also change the original?

**Answer:**

```javascript
// Primitives — copied by value
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 — unchanged ✅

// Objects — copied by reference
const original = { name: "Alice", address: { city: "NYC" } };
const copy = original;
copy.name = "Bob";
console.log(original.name); // "Bob" — also changed! ❌
```

**Cloning approaches:**

| Method                            | Depth   | Handles                                     |
| --------------------------------- | ------- | ------------------------------------------- |
| `{ ...obj }`                      | Shallow | Plain objects only                          |
| `Object.assign({}, obj)`          | Shallow | Plain objects only                          |
| `JSON.parse(JSON.stringify(obj))` | Deep    | No functions, Date, Map, Set, circular refs |
| `structuredClone(obj)`            | Deep ✅ | Date, Map, Set, ArrayBuffer, circular refs  |

```javascript
// Shallow clone — nested objects still shared
const shallow = { ...original };
shallow.address.city = "LA";
console.log(original.address.city); // "LA" — still shared!

// Deep clone (modern)
const deep = structuredClone(original);
deep.address.city = "LA";
console.log(original.address.city); // "NYC" — independent ✅
```

---

## 🟡 Intermediate

### 1. `this` Keyword Mental Model

**Question:**
Four rules for `this`, in order of precedence.

**Answer:**

| Priority | Rule                 | Example                         | `this` value                                 |
| -------- | -------------------- | ------------------------------- | -------------------------------------------- |
| 1        | **`new`** binding    | `new Foo()`                     | New object                                   |
| 2        | **Explicit** binding | `fn.call(obj)` / `fn.bind(obj)` | Specified object                             |
| 3        | **Implicit** binding | `obj.fn()`                      | Object before the dot                        |
| 4        | **Default** binding  | `fn()`                          | `globalThis` (or `undefined` in strict mode) |

**Special case — Arrow functions:** Inherit `this` from enclosing lexical scope (cannot be overridden by `call`/`bind`/`new`).

```javascript
const obj = {
  name: "Alice",
  regular() {
    console.log(this.name);
  },
  arrow: () => {
    console.log(this.name);
  },
};

obj.regular(); // "Alice" — implicit binding
obj.arrow(); // undefined — lexical this (module/global scope)
```

---

### 2. Event Loop & `setTimeout(fn, 0)`

**Question:**
Why doesn't `setTimeout(fn, 0)` execute immediately?

**Answer:**
`setTimeout(fn, 0)` schedules the callback as a **macrotask**. It runs after:

1. The current synchronous code completes.
2. All pending microtasks (Promise callbacks) are drained.
3. The browser performs any pending rendering.

**Minimum delay:** Browsers enforce a minimum delay of **~4ms** (after 5 nested `setTimeout` calls, per the HTML spec). In practice:

- First few: nearly 0ms
- After nesting: ~4ms minimum
- Background tabs: often throttled to 1000ms

**Why this exists:** To prevent infinite loops from blocking the browser and to give the rendering engine a chance to paint.

---

### 3. Modules: ESM vs CommonJS

**Question:**
Practical differences between CJS and ESM.

**Answer:**

| Feature             | CommonJS (`require`)              | ESM (`import`)                                 |
| ------------------- | --------------------------------- | ---------------------------------------------- |
| Loading             | Synchronous                       | Asynchronous                                   |
| Execution           | Runs module on `require()`        | Statically analyzed before execution           |
| Exports             | `module.exports` (mutable object) | `export` (live bindings, read-only)            |
| Top-level `await`   | ❌                                | ✅                                             |
| `this` at top level | `module.exports`                  | `undefined`                                    |
| File extension      | `.js` (default in Node)           | `.mjs` or `"type": "module"` in `package.json` |
| Tree shaking        | ❌ (dynamic)                      | ✅ (static analysis)                           |

**Common migration pitfalls:**

- `require()` calls inside `if` blocks (dynamic imports) → use `await import()`.
- `__dirname` and `__filename` don't exist in ESM → use `import.meta.url`.
- Named exports from CJS may not destructure correctly: `import { readFile } from 'fs'` works but some CJS modules only have a default export.

---

## 🔴 Advanced

### 1. JavaScript Engine Internals

**Question:**
V8's compilation pipeline.

**Answer:**

```
Source Code → Parser → AST → Ignition (bytecode interpreter) → TurboFan (optimizing compiler)
```

1. **Parser:** Converts source to Abstract Syntax Tree (AST). Uses "lazy parsing" — only parses function bodies when they're first called.
2. **Ignition:** Compiles AST to bytecode. Fast startup, collects type feedback.
3. **TurboFan:** Monitors hot functions (called many times). Compiles them to optimized machine code based on observed types.
4. **Deoptimization:** If assumptions are violated (e.g., a function that always received numbers suddenly receives a string), TurboFan throws away the optimized code and falls back to Ignition.

**What triggers deoptimization:**

- **Polymorphic lookups:** Accessing the same property name on objects with different shapes.
- **Type changes:** A variable that was always a number suddenly becomes a string.
- **Hidden class changes:** Using `delete` on object properties.
- **Arguments object manipulation:** Using `arguments` in ways that prevent optimization.

---

### 2. Structured Clone vs JSON

**Question:**
Deep clone complex objects with `structuredClone()`.

**Answer:**

```javascript
const complex = {
  date: new Date(),
  set: new Set([1, 2, 3]),
  map: new Map([["key", "value"]]),
  buffer: new ArrayBuffer(8),
  nested: { deep: { value: 42 } },
};
complex.circular = complex; // Circular reference!

// ❌ JSON — fails on all of these
JSON.parse(JSON.stringify(complex));
// Date → string, Set → {}, Map → {}, ArrayBuffer → {}, circular → throws

// ✅ structuredClone — handles all of these
const clone = structuredClone(complex);
clone.date instanceof Date; // true
clone.set instanceof Set; // true
clone.circular === clone; // true (circular ref preserved)
```

**What `structuredClone` can't handle:**

- ❌ Functions
- ❌ DOM nodes
- ❌ Symbol properties
- ❌ Property descriptors (getters/setters)
- ❌ Prototype chain (always clones as plain object)

---

### 3. WeakRef & FinalizationRegistry

**Question:**
Explain `WeakRef` and `FinalizationRegistry` with a use case.

**Answer:**

```javascript
// WeakRef — holds a reference that DOESN'T prevent GC
class ImageCache {
  #cache = new Map();
  #registry = new FinalizationRegistry((key) => {
    // Called when the cached object is garbage collected
    this.#cache.delete(key);
    console.log(`Cache entry "${key}" was garbage collected`);
  });

  set(key, image) {
    const ref = new WeakRef(image);
    this.#cache.set(key, ref);
    this.#registry.register(image, key); // Register for cleanup
  }

  get(key) {
    const ref = this.#cache.get(key);
    if (!ref) return undefined;

    const value = ref.deref(); // Returns undefined if GC'd
    if (!value) {
      this.#cache.delete(key); // Clean up stale entry
      return undefined;
    }
    return value;
  }
}
```

**How WeakRef differs from regular references:**

- Regular reference: Object stays in memory as long as the reference exists.
- WeakRef: The GC can collect the object at any time. `deref()` returns `undefined` if it was collected.

**⚠️ Warning:** `FinalizationRegistry` callbacks are **not guaranteed** to run promptly (or at all). Don't rely on them for critical cleanup logic.
