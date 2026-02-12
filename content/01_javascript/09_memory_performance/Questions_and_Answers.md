# Memory & Performance

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Garbage Collection

**Question:**
How does JavaScript automatically free memory?

**Answer:**
JavaScript uses the **Mark-and-Sweep** garbage collection algorithm:

1. **Mark phase:** Start from "roots" (global object, active call stack references) and traverse all reachable objects, marking them.
2. **Sweep phase:** Any object NOT marked as reachable is considered garbage — its memory is freed.

```javascript
function example() {
  const data = { huge: new Array(1_000_000) }; // Allocated
  return data.huge.length;
} // After return, `data` is unreachable → GC can collect it
```

**"Reachable" means:** An object can be accessed through any chain of references starting from a root (global scope, current call stack, closures, event listeners).

**V8-specific:** Uses generational garbage collection — short-lived objects are collected quickly (Minor GC) while long-lived objects are collected less frequently (Major GC).

---

### 2. Common Memory Leak Patterns

**Question:**
Three patterns that cause memory leaks and their fixes.

**Answer:**

**1. Forgotten event listeners:**

```javascript
// ❌ Leak — listener keeps element and its closure in memory
element.addEventListener("click", handler);
// Element is removed from DOM but listener is never removed

// ✅ Fix
element.addEventListener("click", handler, { once: true }); // Auto-removes
// OR: Clean up manually
element.removeEventListener("click", handler);
```

**2. Forgotten timers:**

```javascript
// ❌ Leak — interval keeps running after component unmounts
const id = setInterval(() => updateData(), 1000);

// ✅ Fix
clearInterval(id); // In React: return cleanup from useEffect
```

**3. Accidental globals:**

```javascript
// ❌ Leak — accidental global (no declaration)
function processData() {
  results = computeExpensiveData(); // Missing let/const → global!
}

// ✅ Fix — use strict mode + proper declarations
("use strict");
function processData() {
  const results = computeExpensiveData();
}
```

**4. Closures retaining large objects:**

```javascript
// ❌ Leak — closure keeps entire `data` array alive
function createLogger(data) {
  return () => console.log(data.length);
}

// ✅ Fix — extract only what you need
function createLogger(data) {
  const length = data.length;
  return () => console.log(length);
}
```

---

## 🟡 Intermediate

### 1. Debounce vs Throttle

**Question:**
Search input (debounce) vs scroll tracking (throttle) — implement both.

**Answer:**

```javascript
// Debounce — wait until user STOPS typing
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const handleSearch = debounce((query) => fetchResults(query), 300);

// Throttle — fire at most once per interval
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const handleScroll = throttle(() => trackScrollPosition(), 100);
```

| Technique    | Behavior                   | Use Case                                      |
| ------------ | -------------------------- | --------------------------------------------- |
| **Debounce** | Fires after user stops     | Search input, window resize, form validation  |
| **Throttle** | Fires at regular intervals | Scroll position, mouse move, drag, game loops |

**Decision rule:** If you need the **final** value → debounce. If you need **periodic** updates → throttle.

---

### 2. Memoization Trade-offs

**Question:**
Why did memoization spike memory in production?

**Answer:**
**Likely causes:**

1. **Unbounded cache:** No eviction strategy — cache grows forever with each unique input.
2. **Object key instability:** Using `JSON.stringify` on objects that vary slightly (timestamps, random IDs) → every call creates a new cache entry.
3. **Large return values:** Caching large objects/arrays multiplies memory usage.

**Bounded memoization strategy:**

```javascript
function memoizeWithLimit(fn, maxSize = 100) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);

    const result = fn(...args);
    cache.set(key, result);

    // LRU eviction — Map preserves insertion order
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  };
}
```

**When NOT to memoize:**

- Functions with side effects (not pure).
- Functions with too many unique input combinations.
- When the computation is faster than the cache lookup overhead.

---

### 3. Web Workers

**Question:**
Parse a 50MB CSV in the browser without freezing the UI.

**Answer:**

```javascript
// main.js
const worker = new Worker("csv-worker.js");

worker.postMessage({ file: csvBlob }); // Send data to worker

worker.onmessage = (e) => {
  const { parsed, progress } = e.data;
  if (progress) updateProgressBar(progress);
  if (parsed) renderTable(parsed);
};

// csv-worker.js
self.onmessage = (e) => {
  const { file } = e.data;
  const reader = new FileReaderSync();
  const text = reader.readAsText(file);

  const rows = text.split("\n");
  const total = rows.length;
  const parsed = [];

  rows.forEach((row, i) => {
    parsed.push(row.split(","));
    if (i % 10000 === 0) {
      self.postMessage({ progress: (i / total) * 100 });
    }
  });

  self.postMessage({ parsed });
};
```

**What can be transferred:**

- ✅ Strings, numbers, booleans, arrays, plain objects (serialized via structured clone)
- ✅ `ArrayBuffer` (via transferable objects — zero-copy transfer)
- ❌ Functions, DOM elements, class instances, closures
- ❌ Cannot access the DOM from a worker

---

## 🔴 Advanced

### 1. Performance Profiling

**Question:**
Debug a sluggish React dashboard with 10K data points.

**Answer:**

**Chrome DevTools workflow:**

1. **Performance tab → Record** during the slow interaction.
2. **Look for long tasks** (> 50ms, red triangle in the flame chart).
3. **Common culprits:**

| Problem                   | Symptom                                   | Fix                                    |
| ------------------------- | ----------------------------------------- | -------------------------------------- |
| Layout thrashing          | Purple "Layout" bars after each DOM write | Batch reads before writes              |
| Excessive re-renders      | Many React render calls in flame chart    | `React.memo`, `useMemo`, `useCallback` |
| Large JS execution        | Long yellow "Script" blocks               | Code splitting, Web Workers            |
| Forced synchronous layout | Reading layout props after DOM changes    | Use `requestAnimationFrame`            |

**Layout thrashing example:**

```javascript
// ❌ Thrashing — read/write/read/write forces multiple layouts
items.forEach((item) => {
  const height = item.offsetHeight; // READ → forces layout
  item.style.height = height + 10 + "px"; // WRITE → invalidates layout
});

// ✅ Batched — read all, then write all
const heights = items.map((item) => item.offsetHeight); // All reads
items.forEach((item, i) => {
  item.style.height = heights[i] + 10 + "px"; // All writes
});
```

---

### 2. Memory Profiling in Production

**Question:**
Detect memory leaks in production Node.js.

**Answer:**

**Approach 1 — `process.memoryUsage()` monitoring:**

```javascript
setInterval(() => {
  const { heapUsed, heapTotal, rss } = process.memoryUsage();
  metrics.gauge("memory.heapUsed", heapUsed);
  metrics.gauge("memory.rss", rss);
  // Alert if heapUsed grows > 20% over baseline per hour
}, 30_000);
```

**Approach 2 — Heap snapshots comparison:**

1. Take snapshot at time T1 (baseline).
2. Take snapshot at T2 (after suspected leak period).
3. Compare: filter by "Objects allocated between snapshots."
4. Look for growing object counts — usually closures, arrays, or event listeners.

**Approach 3 — `--inspect` in production (carefully):**

```bash
node --inspect=0.0.0.0:9229 server.js
# Connect Chrome DevTools remotely
```

**⚠️ Warning:** Remote inspect in production adds overhead and exposes a debugging port. Use only temporarily with proper firewall rules.

**Patterns to look for:**

- **Detached DOM trees:** DOM nodes removed from document but still referenced in JS.
- **Growing arrays/maps:** Collections that never get cleaned up.
- **Closures retaining large scopes:** Functions holding references to data they no longer need.
