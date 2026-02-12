# JavaScript Arrays

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Array Iteration Methods

**Question:**
You need to iterate over an array of user objects. What modern alternatives to a `for` loop exist?

**Answer:**

| Method      | Returns     | Mutates? | Use Case                                                                       |
| ----------- | ----------- | -------- | ------------------------------------------------------------------------------ |
| `for...of`  | —           | No       | General iteration, supports `break`/`continue`                                 |
| `forEach()` | `undefined` | No       | Side effects (logging, DOM updates)                                            |
| `map()`     | New array   | No       | Transforming each element                                                      |
| `for...in`  | —           | No       | ❌ Not recommended for arrays (iterates enumerable keys, order not guaranteed) |

```javascript
const users = [{ name: "Alice" }, { name: "Bob" }];

// for...of — when you need break/continue
for (const user of users) {
  if (user.name === "Alice") break;
}

// map — when you need transformed results
const names = users.map((u) => u.name); // ["Alice", "Bob"]
```

**Performance note:** For very hot loops (millions of iterations), a plain `for` loop is still the fastest option because it avoids function call overhead.

---

### 2. `map()` vs `forEach()`

**Question:**
Why is `.map()` better than `.forEach()` for transformations?

**Answer:**

```javascript
// ❌ Anti-pattern — using forEach for transformation
const results = [];
items.forEach((item) => {
  results.push(item.toUpperCase());
});

// ✅ Correct — map returns the new array
const results = items.map((item) => item.toUpperCase());
```

**Key differences:**

| Feature   | `map()`              | `forEach()`          |
| --------- | -------------------- | -------------------- |
| Returns   | **New array**        | `undefined`          |
| Chainable | ✅ `.map().filter()` | ❌                   |
| Intent    | Transform data       | Perform side effects |

**When `forEach()` is appropriate:**

- Logging each element.
- Sending analytics events.
- Mutating external state (DOM updates).
- Any operation where you **don't need a return value**.

---

### 3. `slice()` vs `splice()`

**Question:**
Extract the middle 3 elements from an array without modifying the original. Then remove them in-place.

**Answer:**

```javascript
const arr = [1, 2, 3, 4, 5, 6, 7];

// slice — non-destructive (returns new array)
const middle = arr.slice(2, 5); // [3, 4, 5]
console.log(arr); // [1, 2, 3, 4, 5, 6, 7] — unchanged

// splice — destructive (modifies original)
const removed = arr.splice(2, 3); // returns [3, 4, 5]
console.log(arr); // [1, 2, 6, 7] — modified!
```

**Memory tip:** **slice** = **s**afe (doesn't modify), **splice** = **sp**lits in place.

---

### 4. Array Destructuring

**Question:**
Refactor coordinate access to use destructuring.

**Answer:**

```javascript
const coords = [10, 20, 30, 40, 50];

// Basic destructuring
const [x, y] = coords; // x = 10, y = 20

// Skip elements
const [, , z] = coords; // z = 30

// Rest pattern
const [first, ...rest] = coords; // first = 10, rest = [20, 30, 40, 50]

// Default values
const [a, b, c = 0] = [1, 2]; // c = 0

// Swap variables (no temp needed!)
let left = 1,
  right = 2;
[left, right] = [right, left];
```

**Real-world use:** Destructuring function return values — `const [data, error] = await fetchUser()` — is a common pattern in Go-style error handling.

---

## 🟡 Intermediate

### 1. `reduce()` for Complex Transformations

**Question:**
Compute total revenue and per-product totals from an orders array.

**Answer:**

```javascript
const orders = [
  { product: "A", qty: 2, price: 10 },
  { product: "B", qty: 1, price: 25 },
  { product: "A", qty: 3, price: 10 },
];

// Total revenue
const total = orders.reduce((sum, o) => sum + o.qty * o.price, 0); // 75

// Per-product grouping
const grouped = orders.reduce((acc, o) => {
  const revenue = o.qty * o.price;
  acc[o.product] = (acc[o.product] || 0) + revenue;
  return acc;
}, {});
// { A: 50, B: 25 }
```

**When NOT to use `reduce()`:**

- When `.map()` or `.filter()` expresses intent more clearly.
- When the accumulator logic becomes too complex — break it into multiple passes for readability.
- Rule: If your `reduce()` callback is > 5 lines, refactor.

---

### 2. `find()` vs `filter()` Performance

**Question:**
Finding a single record from 100,000 entries — why is `.filter()[0]` inefficient?

**Answer:**

```javascript
// ❌ Scans ALL 100,000 elements, creates an array, takes first
const user = users.filter((u) => u.id === targetId)[0];

// ✅ Stops at the first match — O(1) best case, O(n) worst case
const user = users.find((u) => u.id === targetId);
```

**Performance comparison on 100K records:**

| Method        | Elements Checked (if target is at index 50)      |
| ------------- | ------------------------------------------------ |
| `filter()[0]` | 100,000 (always scans all) + allocates new array |
| `find()`      | 50 (stops at first match)                        |

**For frequent lookups:** Convert the array to a `Map` for O(1) access:

```javascript
const userMap = new Map(users.map((u) => [u.id, u]));
const user = userMap.get(targetId); // O(1)
```

---

### 3. Removing Duplicates

**Question:**
What are the trade-offs between deduplication approaches?

**Answer:**

```javascript
const tags = ["react", "vue", "react", "angular", "vue"];

// Method 1 — Set (fastest, simplest)
const unique1 = [...new Set(tags)]; // ✅ O(n)

// Method 2 — filter + indexOf
const unique2 = tags.filter((tag, i) => tags.indexOf(tag) === i); // ❌ O(n²)

// Method 3 — reduce
const unique3 = tags.reduce(
  (acc, tag) => (acc.includes(tag) ? acc : [...acc, tag]),
  [],
); // ❌ O(n²) — includes() is O(n) per call
```

| Method              | Time Complexity | 10K items | Best For                      |
| ------------------- | --------------- | --------- | ----------------------------- |
| `Set`               | O(n)            | ~0.1ms    | Primitives (strings, numbers) |
| `filter + indexOf`  | O(n²)           | ~50ms     | Small arrays, older engines   |
| `reduce + includes` | O(n²)           | ~50ms     | Never — use Set instead       |

**For objects (dedup by key):**

```javascript
const uniqueById = [...new Map(users.map((u) => [u.id, u])).values()];
```

---

### 4. Immutable Array Operations

**Question:**
Add, remove, and update items in React state without mutation.

**Answer:**

```javascript
const items = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" },
];

// ✅ Add item
const added = [...items, { id: 4, name: "D" }];

// ✅ Remove item (by id)
const removed = items.filter((item) => item.id !== 2);

// ✅ Update item
const updated = items.map((item) =>
  item.id === 2 ? { ...item, name: "Updated" } : item,
);

// ✅ Insert at index
const inserted = [
  ...items.slice(0, 1),
  { id: 5, name: "E" },
  ...items.slice(1),
];
```

**Modern alternative (2024+):** Use `Array.prototype.toSorted()`, `.toReversed()`, `.toSpliced()`, and `.with()` — these return new arrays without mutating:

```javascript
const sorted = items.toSorted((a, b) => a.name.localeCompare(b.name));
const replaced = items.with(1, { id: 2, name: "New" }); // Replace at index 1
```

---

## 🔴 Advanced

### 1. Custom Sort Stability

**Question:**
Sort by `priority`, then by `createdAt` for equal priorities. Is `Array.sort()` stable?

**Answer:**
As of **ES2019**, `Array.sort()` is required to be **stable** (equal elements maintain their relative order). All modern engines comply.

```javascript
const tasks = [
  { name: "A", priority: 2, createdAt: new Date("2026-01-01") },
  { name: "B", priority: 1, createdAt: new Date("2026-01-03") },
  { name: "C", priority: 2, createdAt: new Date("2026-01-02") },
];

tasks.sort((a, b) => {
  if (a.priority !== b.priority) return a.priority - b.priority;
  return a.createdAt - b.createdAt; // Date subtraction returns ms difference
});
// Result: B (p1), A (p2, Jan 1), C (p2, Jan 2)
```

**Time complexity:** V8 uses TimSort — O(n log n) average and worst case, O(n) best case for nearly-sorted data.

**⚠️ Mutation warning:** `.sort()` mutates the original array. Use `.toSorted()` for immutable sorting.

---

### 2. Lazy Evaluation with Generators

**Question:**
Process a 1M element pipeline but only take the first 10 results.

**Answer:**

```javascript
function* lazyPipeline(arr) {
  for (const item of arr) {
    if (item % 2 === 0) {
      // filter: even numbers
      const doubled = item * 2; // map: double
      if (doubled > 100) {
        // filter: > 100
        yield doubled;
      }
    }
  }
}

// Only processes elements until 10 results are found
const results = [];
for (const val of lazyPipeline(hugeArray)) {
  results.push(val);
  if (results.length >= 10) break; // Stop processing!
}
```

**Comparison:**

| Approach                                | Elements Processed (if 10th match is at index 500) |
| --------------------------------------- | -------------------------------------------------- |
| `.filter().map().filter().slice(0, 10)` | 1,000,000 × 3 passes                               |
| Generator pipeline                      | ~500 elements, 1 pass                              |

**Production use:** Data processing pipelines, streaming CSV/JSON parsing, paginated database cursors.

---

### 3. Typed Arrays & Performance

**Question:**
Why use `Float32Array` for audio processing instead of regular arrays?

**Answer:**

| Feature              | Regular Array          | `Float32Array`                |
| -------------------- | ---------------------- | ----------------------------- |
| Memory layout        | Sparse, boxed values   | Contiguous, fixed-size buffer |
| Memory per element   | ~16-24 bytes (boxed)   | 4 bytes (raw float)           |
| 1M elements          | ~16-24 MB              | ~4 MB                         |
| CPU cache efficiency | Poor (pointer chasing) | Excellent (contiguous memory) |
| Type checking        | Per-access             | None (all values are float32) |

```javascript
// Regular array — each number is a heap-allocated object
const samples = new Array(44100).fill(0); // ~700KB

// Typed array — contiguous memory buffer
const samples = new Float32Array(44100); // ~172KB

// Typed arrays work with Web Audio API directly
const audioBuffer = audioCtx.createBuffer(1, 44100, 44100);
const channelData = audioBuffer.getChannelData(0); // Returns Float32Array
```

**Other typed array use cases:**

- **WebGL:** `Uint8Array` for texture data, `Float32Array` for vertex buffers.
- **WebSockets:** `ArrayBuffer` for binary protocol data.
- **Crypto:** `Uint8Array` for raw bytes.
- **Canvas:** `ImageData.data` is a `Uint8ClampedArray`.
