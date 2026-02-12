# Asynchronous Patterns

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Callbacks → Promises → Async/Await

**Question:** Evolution of async code.

**Answer:**

```javascript
// Callbacks — "callback hell"
fs.readFile("a.txt", (err, a) => {
  if (err) return handleError(err);
  fs.readFile("b.txt", (err, b) => {
    if (err) return handleError(err);
    console.log(a + b);
  });
});

// Promises — chainable
readFile("a.txt")
  .then((a) => readFile("b.txt").then((b) => a + b))
  .then(console.log)
  .catch(handleError);

// Async/Await — readable ✅
async function read() {
  const a = await readFile("a.txt");
  const b = await readFile("b.txt");
  console.log(a + b);
}
```

**Always use async/await** in 2026. It's the clearest pattern.

---

### 2. Async Error Handling

**Question:** Error handling in async code.

**Answer:**

```javascript
// ✅ try/catch with async/await
async function fetchUser(id) {
  try {
    const user = await db.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("User", id);
    return user;
  } catch (error) {
    logger.error("fetchUser failed", { id, error });
    throw error; // Re-throw for caller to handle
  }
}

// ⚠️ Unhandled rejections crash Node.js (v15+)
process.on("unhandledRejection", (reason, promise) => {
  logger.fatal("Unhandled rejection", { reason });
  process.exit(1);
});
```

---

## 🟡 Intermediate

### 1. Concurrency Patterns

**Question:** Promise combinators with timeouts.

**Answer:**

```javascript
// Fetch from multiple services with timeout
async function fetchWithTimeout(urls, timeoutMs = 5000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), timeoutMs),
  );

  const results = await Promise.race([
    Promise.allSettled(urls.map((url) => fetch(url).then((r) => r.json()))),
    timeout,
  ]);

  return results.filter((r) => r.status === "fulfilled").map((r) => r.value);
}
```

| Combinator           | Resolves when                  | Use case                         |
| -------------------- | ------------------------------ | -------------------------------- |
| `Promise.all`        | ALL fulfill                    | Parallel independent requests    |
| `Promise.allSettled` | ALL settle (fulfill or reject) | Batch operations (some may fail) |
| `Promise.race`       | FIRST settles                  | Timeouts, fastest source         |
| `Promise.any`        | FIRST fulfills                 | Fallback sources                 |

---

### 2. Event Emitter

**Question:** Event-driven order processing.

**Answer:**

```javascript
import { EventEmitter } from "node:events";

class OrderProcessor extends EventEmitter {
  async process(order) {
    this.emit("order:received", order);
    const validated = await this.validate(order);
    this.emit("order:validated", validated);
    const paid = await this.charge(validated);
    this.emit("order:paid", paid);
    this.emit("order:complete", paid);
  }
}

const processor = new OrderProcessor();
processor.on("order:received", (o) => logger.info("New order", o));
processor.on("order:paid", (o) => emailService.sendReceipt(o));
processor.on("order:complete", (o) => inventoryService.decrement(o));
```

---

## 🔴 Advanced

### 1. AsyncLocalStorage

**Question:** Request-scoped context.

**Answer:**

```javascript
import { AsyncLocalStorage } from "node:async_hooks";

const requestContext = new AsyncLocalStorage();

// Middleware — sets context for entire request lifecycle
app.use((req, res, next) => {
  const context = { requestId: crypto.randomUUID(), userId: req.user?.id };
  requestContext.run(context, next);
});

// Any function can access context without passing it
function logger(message) {
  const ctx = requestContext.getStore();
  console.log(`[${ctx?.requestId}] ${message}`);
}

// Deep in the call stack — no context parameter needed
async function processOrder(order) {
  logger("Processing order"); // Automatically includes requestId
}
```

---

### 2. Backpressure

**Question:** What happens when you ignore backpressure.

**Answer:**

```javascript
// ❌ Ignoring backpressure — memory grows unbounded
readable.on("data", (chunk) => {
  writable.write(chunk); // If writable is slow, data buffers in memory
});

// ✅ pipe() handles backpressure automatically
readable.pipe(writable);
// When writable's buffer is full, pipe pauses readable
// When writable drains, pipe resumes readable

// ✅ Manual backpressure handling
readable.on("data", (chunk) => {
  const canContinue = writable.write(chunk);
  if (!canContinue) {
    readable.pause(); // Stop reading
    writable.once("drain", () => readable.resume()); // Resume when ready
  }
});
```
