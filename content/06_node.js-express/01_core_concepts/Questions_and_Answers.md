# Node.js Core Concepts

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Event Loop

**Question:** How the event loop works.

**Answer:**
The event loop processes callbacks in phases:

```
   ┌───────────────────────────┐
┌─>│         timers            │ ← setTimeout, setInterval
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │     pending callbacks     │ ← I/O callbacks deferred
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │         poll              │ ← Incoming I/O, connections
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │         check             │ ← setImmediate
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │     close callbacks       │ ← socket.on("close")
│  └──────────┬────────────────┘
└─────────────┘
```

| Function             | When it runs                            | Priority            |
| -------------------- | --------------------------------------- | ------------------- |
| `process.nextTick()` | After current operation, before any I/O | Highest (microtask) |
| `Promise.then()`     | After nextTick, before I/O              | Microtask           |
| `setTimeout(fn, 0)`  | Timers phase                            | Normal              |
| `setImmediate()`     | Check phase (after poll)                | Normal              |

---

### 2. Modules System

**Question:** CJS vs ESM.

**Answer:**

```javascript
// CommonJS
const fs = require("fs");
module.exports = { readFile: fs.readFile };

// ES Modules
import fs from "node:fs";
export const readFile = fs.readFile;
```

| Feature           | CJS (`require`)     | ESM (`import`)                          |
| ----------------- | ------------------- | --------------------------------------- |
| Loading           | Synchronous         | Asynchronous                            |
| Top-level `await` | ❌                  | ✅                                      |
| Tree-shaking      | ❌                  | ✅                                      |
| `__dirname`       | ✅ Built-in         | ❌ Use `import.meta.dirname` (Node 21+) |
| Interop           | Can `require()` CJS | Can `import` CJS, can't `require()` ESM |

**Enable ESM:** Add `"type": "module"` to `package.json` or use `.mjs` extension.

---

## 🟡 Intermediate

### 1. Streams

**Question:** When streams beat loading into memory.

**Answer:**

```javascript
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

// Stream a 10GB file — constant memory usage (~64KB buffer)
await pipeline(
  createReadStream("input.log"), // Readable
  createGzip(), // Transform
  createWriteStream("output.log.gz"), // Writable
);
```

| Approach     | 10GB file memory | Time to first byte |
| ------------ | ---------------- | ------------------ |
| `readFile()` | 10GB+            | After full read    |
| Stream       | ~64KB            | Immediately        |

---

### 2. Worker Threads

**Question:** CPU-intensive processing.

**Answer:**

```javascript
// main.js
import { Worker } from "node:worker_threads";

function processImage(imagePath) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./image-worker.js", {
      workerData: { imagePath },
    });
    worker.on("message", resolve);
    worker.on("error", reject);
  });
}

// image-worker.js
import { parentPort, workerData } from "node:worker_threads";
const result = heavyImageProcessing(workerData.imagePath);
parentPort.postMessage(result);
```

| Solution       | Use case                                | Overhead |
| -------------- | --------------------------------------- | -------- |
| Worker Threads | CPU-bound (same process, shared memory) | Low      |
| Cluster        | Multi-core HTTP serving                 | Medium   |
| Child Process  | Isolated tasks, different languages     | High     |

---

## 🔴 Advanced

### 1. Memory Management

**Question:** Diagnosing memory leaks.

**Answer:**

```bash
# Start with inspector
node --inspect --max-old-space-size=4096 server.js

# Take heap snapshots via Chrome DevTools
# 1. Open chrome://inspect
# 2. Take Heap Snapshot → use app → Take another
# 3. Compare snapshots to find growing objects
```

**Common leak sources:**

- Event listeners not removed.
- Global caches without eviction.
- Closures capturing large objects.
- Uncleared timers/intervals.

```javascript
// Monitor memory
setInterval(() => {
  const { rss, heapUsed, heapTotal } = process.memoryUsage();
  console.log(
    `RSS: ${rss / 1e6}MB, Heap: ${heapUsed / 1e6}/${heapTotal / 1e6}MB`,
  );
}, 5000);
```

---

### 2. Native Addons vs WASM

**Question:** When to go native.

**Answer:**

| Approach            | Performance        | Portability           | Complexity |
| ------------------- | ------------------ | --------------------- | ---------- |
| N-API addon (C/C++) | Best               | ❌ Per-platform build | High       |
| WASM (Rust/C)       | Good (~90% native) | ✅ Cross-platform     | Medium     |
| Pure JS             | Baseline           | ✅                    | Low        |

**Use WASM** for most performance-critical code — it's nearly as fast as native with cross-platform compatibility. Use N-API only for system-level access (GPU, hardware).
