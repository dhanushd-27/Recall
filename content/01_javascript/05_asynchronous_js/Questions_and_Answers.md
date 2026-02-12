# JavaScript Asynchronous

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. The Event Loop (High Level)

**Question:**
In simple terms, how does JavaScript handle asynchronous operations (like fetching data) if it is single-threaded?

**Answer:**
JavaScript delegates async operations (networking, timers, file I/O) to the **browser/runtime (Web APIs / libuv)**. When the operation completes, a callback is placed in a **Queue**. The **Event Loop** constantly checks if the main Call Stack is empty; if so, it moves the callback from the Queue to the Stack for execution.

**Visual model:**

```
Call Stack  →  Web APIs (fetch, setTimeout, etc.)
    ↑               ↓
Event Loop  ←  Callback Queue (macrotasks)
    ↑
Microtask Queue (Promises, queueMicrotask)
```

**Key insight:** JavaScript is single-threaded, but the _runtime environment_ is not. Network requests, timers, and I/O run on separate threads in the browser/Node.js.

---

### 2. Promises vs Callbacks

**Question:**
Why do we prefer Promises (and async/await) over callbacks?

**Answer:**

1. **Avoids Callback Hell:** Deeply nested callbacks (pyramid of doom) are hard to read and debug.
2. **Standardized Error Handling:** `.catch()` or `try/catch` vs checking `err` in every callback.
3. **Composability:** `Promise.all`, `Promise.race` make coordinating multiple tasks easier.
4. **Return values:** Promises can be returned, stored, and chained — callbacks cannot.

**Callback hell example:**

```javascript
// ❌ Callback hell
getUser(id, (err, user) => {
  getOrders(user.id, (err, orders) => {
    getOrderDetails(orders[0].id, (err, details) => {
      // 3 levels deep, error handling repeated
    });
  });
});

// ✅ Promise chain (flat)
getUser(id)
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .catch((err) => console.error(err));
```

---

## 🟡 Intermediate

### 1. Async/Await & Error Handling

**Question:**
Refactor the following code to use `async/await`. What are the trade-offs between `try/catch` and `.catch()` patterns?

**Answer:**

```javascript
async function getUserData(id) {
  try {
    const res = await fetch(`/api/user/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch user:", err.message);
    throw err; // Re-throw so callers can handle it
  }
}
```

**`try/catch` vs `.catch()` trade-offs:**

| Pattern                     | Pros                                  | Cons                                                  |
| --------------------------- | ------------------------------------- | ----------------------------------------------------- |
| `try/catch`                 | Familiar, catches sync + async errors | Can be verbose, catches _all_ errors (including bugs) |
| `.catch()` on await         | Only catches that specific promise    | Less readable when chaining multiple awaits           |
| Wrapper function (Go-style) | Clean, no nesting                     | Unconventional in JS                                  |

**Go-style pattern (used in some codebases):**

```javascript
async function to(promise) {
  try {
    return [await promise, null];
  } catch (err) {
    return [null, err];
  }
}

const [user, err] = await to(fetchUser(id));
if (err) return handleError(err);
```

---

### 2. Promise Combinators

**Question:**
Compare all four Promise combinators with real-world scenarios.

**Answer:**

| Combinator             | Resolves When                         | Rejects When                      | Use Case                                     |
| ---------------------- | ------------------------------------- | --------------------------------- | -------------------------------------------- |
| `Promise.all()`        | **All** resolve                       | **Any** rejects (fail-fast)       | Loading all resources for a page             |
| `Promise.allSettled()` | **All** settle (resolve or reject)    | Never (always resolves)           | Batch operations where partial failure is OK |
| `Promise.race()`       | **First** settles (resolve or reject) | **First** rejects                 | Timeout pattern                              |
| `Promise.any()`        | **First** resolves                    | **All** reject (`AggregateError`) | Fastest CDN/mirror selection                 |

**Timeout pattern with `Promise.race()`:**

```javascript
async function fetchWithTimeout(url, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms),
  );
  return Promise.race([fetch(url), timeout]);
}
```

---

### 3. Sequential vs Parallel Execution

**Question:**
A developer writes this code to fetch 5 users. Why is it slow? Refactor it.

**Answer:**

```javascript
// ❌ Sequential — each fetch waits for the previous one
async function getUsers(ids) {
  const users = [];
  for (const id of ids) {
    const user = await fetchUser(id); // Blocks on each
    users.push(user);
  }
  return users;
}
// If each fetch takes 200ms → 5 × 200ms = 1000ms total

// ✅ Parallel — all fetches start simultaneously
async function getUsers(ids) {
  return Promise.all(ids.map((id) => fetchUser(id)));
}
// 5 fetches in parallel → ~200ms total (limited by slowest)
```

**When you actually NEED sequential:**

- When each request depends on the previous result.
- When the API has rate limits.
- When order of side effects matters.

**Controlled concurrency (limit parallel requests):**

```javascript
async function mapWithConcurrency(items, fn, concurrency = 3) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const p = fn(item).then((result) => {
      executing.delete(p);
      return result;
    });
    executing.add(p);
    results.push(p);

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}
```

---

## 🔴 Advanced

### 1. Event Loop Internals (Microtasks vs Macrotasks)

**Question:**
What is the order of execution? Explain the queue priorities.

```javascript
console.log("Start");

setTimeout(() => console.log("Timeout"), 0);

Promise.resolve()
  .then(() => console.log("Promise 1"))
  .then(() => console.log("Promise 2"));

queueMicrotask(() => console.log("Microtask"));

console.log("End");
```

**Answer:**
**Output:** `Start`, `End`, `Promise 1`, `Microtask`, `Promise 2`, `Timeout`

**Execution breakdown:**

1. `"Start"` — synchronous, runs immediately.
2. `setTimeout` — callback placed in **macrotask queue**.
3. `Promise.resolve().then(...)` — callback placed in **microtask queue**.
4. `queueMicrotask(...)` — callback placed in **microtask queue**.
5. `"End"` — synchronous, runs immediately.
6. **Call stack is now empty** → Event loop drains microtask queue:
   - `"Promise 1"` logs → `.then()` chain adds `"Promise 2"` to microtask queue
   - `"Microtask"` logs
   - `"Promise 2"` logs (added by the previous microtask)
7. **Microtask queue is empty** → Event loop takes from macrotask queue:
   - `"Timeout"` logs

**Rule:** Microtasks are **always** drained before the next macrotask.

---

### 2. Implementing `Promise.all()` from Scratch

**Question:**
Implement `Promise.all` with proper edge case handling.

**Answer:**

```javascript
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    // Handle non-array iterables
    const arr = Array.from(promises);

    if (arr.length === 0) return resolve([]);

    const results = new Array(arr.length);
    let completed = 0;

    arr.forEach((p, index) => {
      // Wrap non-promise values with Promise.resolve
      Promise.resolve(p)
        .then((val) => {
          results[index] = val; // Preserve order
          completed++;
          if (completed === arr.length) resolve(results);
        })
        .catch(reject); // Fail fast on first rejection
    });
  });
}
```

**Edge cases handled:**

- ✅ Empty array → resolves with `[]`
- ✅ Non-promise values → wrapped with `Promise.resolve()`
- ✅ Order preserved → results stored at correct index
- ✅ Fail-fast → first rejection rejects the outer promise

**⚠️ Common bugs in naive implementations:**

- Using `push()` instead of index assignment → wrong order.
- Not handling the empty array case → promise never resolves.
- Not wrapping values with `Promise.resolve()` → crashes on non-promise inputs.

---

### 3. Async Generators & Streaming

**Question:**
Implement paginated API fetching with async generators.

**Answer:**

```javascript
async function* fetchAllPages(baseUrl) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${baseUrl}?page=${page}`);
    const data = await res.json();

    yield data.items; // Yield one page at a time

    hasMore = data.hasNextPage;
    page++;
  }
}

// Consumer — processes pages lazily
for await (const pageItems of fetchAllPages("/api/products")) {
  renderProducts(pageItems);
  // Can break early without fetching remaining pages
}
```

**Comparison with upfront fetching:**

| Approach              | Memory         | Time to First Render | Network                  |
| --------------------- | -------------- | -------------------- | ------------------------ |
| Fetch all pages first | O(total items) | Slow (waits for all) | All pages fetched        |
| Async generator       | O(page size)   | Fast (first page)    | Only fetches as consumed |

**Production use cases:**

- Paginated database queries
- Streaming large CSV/JSON files
- Real-time log tailing
- Social media feed loading

---

### 4. AbortController for Request Cancellation

**Question:**
Cancel in-flight requests when a user navigates away.

**Answer:**

```javascript
class RequestManager {
  constructor() {
    this.controller = new AbortController();
  }

  async fetch(url) {
    const res = await fetch(url, { signal: this.controller.signal });
    return res.json();
  }

  cancelAll() {
    this.controller.abort();
    // Create a new controller for future requests
    this.controller = new AbortController();
  }
}

// Usage in React
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/data", { signal: controller.signal })
    .then((res) => res.json())
    .then(setData)
    .catch((err) => {
      if (err.name !== "AbortError") throw err;
      // Silently ignore aborted requests
    });

  return () => controller.abort(); // Cleanup on unmount
}, []);
```

**What happens when you abort:**

- The `fetch` promise rejects with an `AbortError`.
- The browser **actually cancels** the HTTP request (visible in DevTools as "canceled").
- The TCP connection may be reused for other requests.

**⚠️ Common mistake:** Not checking `err.name === "AbortError"` in catch blocks — this leads to spurious error logging/toasts when users navigate normally.
