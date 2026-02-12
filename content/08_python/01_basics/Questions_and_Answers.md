# Python Basics

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Python Fundamentals

**Question:** Dynamic typing and type hints.

**Answer:**

```python
# Dynamic typing — no declarations needed
x = 42          # int
x = "hello"     # now str — no error!

# Type hints (Python 3.10+) — optional but recommended
def greet(name: str, age: int) -> str:
    return f"Hello {name}, you are {age}"

# Duck typing — "if it walks like a duck..."
def get_length(obj):
    return len(obj)  # Works on str, list, dict — anything with __len__

get_length("hello")  # 5
get_length([1, 2, 3]) # 3
```

| Feature        | Python                   | TypeScript              |
| -------------- | ------------------------ | ----------------------- |
| Type system    | Dynamic (optional hints) | Static (compile-time)   |
| Type checking  | `mypy` (separate tool)   | `tsc` (built-in)        |
| Runtime impact | None (hints are ignored) | None (types are erased) |

---

### 2. Data Structures

**Question:** Built-in structures.

**Answer:**

| Python  | JS Equivalent    | Mutable | Ordered   | Use case                  |
| ------- | ---------------- | ------- | --------- | ------------------------- |
| `list`  | `Array`          | ✅      | ✅        | General collection        |
| `tuple` | — (freeze array) | ❌      | ✅        | Fixed data, dict keys     |
| `set`   | `Set`            | ✅      | ❌        | Unique values, membership |
| `dict`  | `Object` / `Map` | ✅      | ✅ (3.7+) | Key-value mapping         |

```python
# List comprehension — like JS .map().filter()
squares = [x**2 for x in range(10) if x % 2 == 0]

# Dict
user = {"name": "Alice", "age": 30}
user.get("email", "N/A")  # Safe access with default

# Tuple unpacking
x, y, z = (1, 2, 3)  # Like JS destructuring
```

---

## 🟡 Intermediate

### 1. Comprehensions & Generators

**Question:** Memory-efficient processing.

**Answer:**

```python
# List comprehension — creates entire list in memory
squares = [x**2 for x in range(10_000_000)]  # ~80MB

# Generator expression — lazy, yields one value at a time
squares = (x**2 for x in range(10_000_000))  # ~0MB until iterated

# Generator function
def read_large_file(path):
    with open(path) as f:
        for line in f:
            yield line.strip()  # Process one line at a time

# Process 10GB file with constant memory
for line in read_large_file("huge.log"):
    if "ERROR" in line:
        print(line)
```

---

### 2. Decorators

**Question:** Logging execution time.

**Answer:**

```python
import functools
import time

def timer(func):
    @functools.wraps(func)  # Preserve original function metadata
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def process_data(data):
    time.sleep(1)
    return len(data)

process_data([1, 2, 3])  # "process_data took 1.0012s"

# Stacking decorators
@timer          # Applied second (outer)
@cache          # Applied first (inner)
def expensive(n):
    return sum(range(n))
```

---

## 🔴 Advanced

### 1. Async Python

**Question:** `asyncio` vs Node.js event loop.

**Answer:**

```python
import asyncio
import aiohttp

async def fetch(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

# Concurrent requests — like Promise.all
async def fetch_all(urls: list[str]):
    results = await asyncio.gather(*[fetch(url) for url in urls])
    return results

asyncio.run(fetch_all(["https://api.a.com", "https://api.b.com"]))
```

| Feature     | Python asyncio             | Node.js                      |
| ----------- | -------------------------- | ---------------------------- |
| Event loop  | Must be started explicitly | Always running               |
| Ecosystem   | Growing (aiohttp, asyncpg) | Mature (everything is async) |
| CPU-bound   | Use `ProcessPoolExecutor`  | Use Worker Threads           |
| Default I/O | Synchronous (blocking)     | Asynchronous (non-blocking)  |

---

### 2. Package Management

**Question:** Modern Python tooling.

**Answer:**

| Tool     | Speed            | Lock file                   | Resolver   | Recommended       |
| -------- | ---------------- | --------------------------- | ---------- | ----------------- |
| `pip`    | Slow             | `requirements.txt` (manual) | Basic      | Legacy            |
| `poetry` | Medium           | `poetry.lock`               | SAT solver | Good              |
| `uv`     | Very fast (Rust) | `uv.lock`                   | Modern     | ✅ 2026 standard  |
| `conda`  | Slow             | `environment.yml`           | SAT solver | Data science only |

```bash
# uv — 10-100x faster than pip
uv init my-project
uv add fastapi uvicorn
uv run python main.py
```
