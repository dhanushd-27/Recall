# JavaScript Coding Challenges

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Reverse a String

**Challenge:** Write a function to reverse a string without using `.reverse()`.

```javascript
function reverseString(str) {
  // Your solution
}

reverseString("hello"); // "olleh"
```

**Answer:**

```javascript
// Approach 1 — Array spread + reverse
const reverseString = (str) => [...str].reverse().join("");

// Approach 2 — Reduce (no reverse)
const reverseString = (str) => [...str].reduce((rev, char) => char + rev, "");

// Approach 3 — For loop (most performant for very long strings)
function reverseString(str) {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}
```

**⚠️ Edge case:** `str.split("").reverse().join("")` breaks on emoji and multi-byte characters! `[...str]` handles Unicode correctly because it uses the string iterator.

---

### 2. FizzBuzz

**Challenge:** Print numbers 1-100. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", multiples of both print "FizzBuzz".

**Answer:**

```javascript
// Clean approach — build the string
for (let i = 1; i <= 100; i++) {
  let output = "";
  if (i % 3 === 0) output += "Fizz";
  if (i % 5 === 0) output += "Buzz";
  console.log(output || i);
}
```

**Why this approach is better than `if/else if/else`:** It's more extensible. Adding "Jazz" for multiples of 7 requires one line instead of restructuring all conditions.

---

### 3. Find the Most Frequent Element

**Challenge:** Given an array, find the element that appears most frequently.

```javascript
findMostFrequent([1, 3, 2, 1, 4, 1, 3]); // 1
```

**Answer:**

```javascript
function findMostFrequent(arr) {
  const freq = new Map();
  let maxCount = 0;
  let maxElement = null;

  for (const item of arr) {
    const count = (freq.get(item) || 0) + 1;
    freq.set(item, count);
    if (count > maxCount) {
      maxCount = count;
      maxElement = item;
    }
  }

  return maxElement;
}
```

**Time: O(n), Space: O(n).** Single pass — no need to iterate the map separately.

---

## 🟡 Intermediate

### 1. Flatten a Nested Array

**Challenge:** Flatten an arbitrarily nested array without using `.flat()`.

```javascript
flatten([1, [2, [3, [4]], 5]]); // [1, 2, 3, 4, 5]
```

**Answer:**

```javascript
// Recursive
function flatten(arr) {
  return arr.reduce(
    (acc, item) =>
      Array.isArray(item) ? acc.concat(flatten(item)) : acc.concat(item),
    [],
  );
}

// Iterative (avoids stack overflow on deeply nested arrays)
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.unshift(item);
    }
  }
  return result;
}

// Built-in
arr.flat(Infinity);
```

---

### 2. Implement `Array.map()` from Scratch

**Challenge:** Implement your own `map` function that works like `Array.prototype.map`.

**Answer:**

```javascript
function myMap(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    // Preserve holes in sparse arrays
    if (i in arr) {
      result[i] = callback(arr[i], i, arr);
    }
  }
  return result;
}

// Test
myMap([1, 2, 3], (x) => x * 2); // [2, 4, 6]
```

**Key details often missed:**

- The callback receives three arguments: `(element, index, originalArray)`.
- Sparse arrays should preserve holes (`i in arr` check).
- The original array should not be mutated.

---

### 3. Deep Clone an Object

**Challenge:** Implement a deep clone function that handles nested objects, arrays, Date, Map, Set, and circular references.

**Answer:**

```javascript
function deepClone(obj, seen = new WeakMap()) {
  // Handle primitives and null
  if (obj === null || typeof obj !== "object") return obj;

  // Handle circular references
  if (seen.has(obj)) return seen.get(obj);

  // Handle special types
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Map) {
    const clone = new Map();
    seen.set(obj, clone);
    obj.forEach((val, key) =>
      clone.set(deepClone(key, seen), deepClone(val, seen)),
    );
    return clone;
  }
  if (obj instanceof Set) {
    const clone = new Set();
    seen.set(obj, clone);
    obj.forEach((val) => clone.add(deepClone(val, seen)));
    return clone;
  }

  // Handle arrays and plain objects
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);

  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], seen);
  }

  return clone;
}
```

**In production:** Use `structuredClone(obj)` (built-in since Node 17 / all modern browsers).

---

## 🔴 Advanced

### 1. Implement a Promise-Based `retry`

**Challenge:** Implement a function that retries an async operation up to `n` times with exponential backoff.

```javascript
const data = await retry(() => fetchData(), { retries: 3, baseDelay: 1000 });
```

**Answer:**

```javascript
async function retry(fn, { retries = 3, baseDelay = 1000 } = {}) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;

      const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
      const jitter = delay * Math.random() * 0.1; // Add 0-10% jitter
      await new Promise((r) => setTimeout(r, delay + jitter));
    }
  }

  throw lastError;
}
```

**Why jitter matters:** Without jitter, all retrying clients hit the server at the same time (thundering herd problem). Random jitter spreads out retry attempts.

---

### 2. LRU Cache Implementation

**Challenge:** Implement an LRU (Least Recently Used) cache with O(1) `get` and `put` operations and a max size.

**Answer:**

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map preserves insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    // Evict oldest (first entry in Map)
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}
```

**Why `Map` works here:** JavaScript's `Map` maintains insertion order. By deleting and re-inserting on access, we maintain LRU order. The first entry is always the oldest.

---

### 3. Event Emitter Implementation

**Challenge:** Build a type-safe event emitter with `on`, `off`, `once`, and `emit` methods.

**Answer:**

```javascript
class EventEmitter {
  #listeners = new Map();

  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }
    this.#listeners.get(event).push(callback);
    return () => this.off(event, callback); // Return unsubscribe function
  }

  off(event, callback) {
    const listeners = this.#listeners.get(event);
    if (!listeners) return;
    this.#listeners.set(
      event,
      listeners.filter((cb) => cb !== callback),
    );
  }

  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  emit(event, ...args) {
    const listeners = this.#listeners.get(event);
    if (!listeners) return false;
    listeners.forEach((cb) => cb(...args));
    return true;
  }
}

// Usage
const emitter = new EventEmitter();
const unsub = emitter.on("data", (payload) => console.log(payload));
emitter.once("ready", () => console.log("Ready!"));
emitter.emit("data", { id: 1 }); // Logs: { id: 1 }
emitter.emit("ready"); // Logs: "Ready!"
emitter.emit("ready"); // Nothing — once listener was removed
unsub(); // Unsubscribe from "data"
```

**Key design decisions:**

- Returning an unsubscribe function from `on()` (like React's `useEffect` cleanup).
- Using a wrapper for `once()` to properly remove itself.
- Using `#private` for the listeners map.
