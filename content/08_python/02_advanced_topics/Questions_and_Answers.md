# Python Advanced Topics

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Classes & OOP

**Question:** Python OOP vs JavaScript classes.

**Answer:**

```python
# Traditional class
class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

    def greet(self) -> str:
        return f"Hi, I'm {self.name}"

# Dataclass — less boilerplate (like TypeScript interfaces + runtime)
from dataclasses import dataclass

@dataclass
class User:
    name: str
    email: str
    age: int = 0  # Default value

    def greet(self) -> str:
        return f"Hi, I'm {self.name}"

# Inheritance
class Admin(User):
    role: str = "admin"
```

`@dataclass` auto-generates `__init__`, `__repr__`, `__eq__` — similar to how TypeScript interfaces define structure, but with runtime validation.

---

### 2. Exception Handling

**Question:** Python vs JavaScript error handling.

**Answer:**

```python
# Python has try/except/else/finally
try:
    result = risky_operation()
except ValueError as e:      # Specific exception
    handle_value_error(e)
except (TypeError, KeyError): # Multiple types
    handle_other()
except Exception as e:        # Catch-all (broad)
    logger.error(f"Unexpected: {e}")
    raise                     # Re-raise
else:
    print("No error!")        # Only runs if NO exception
finally:
    cleanup()                 # Always runs

# Custom exceptions
class AppError(Exception):
    def __init__(self, message: str, code: int):
        super().__init__(message)
        self.code = code

class NotFoundError(AppError):
    def __init__(self, resource: str, id: str):
        super().__init__(f"{resource} {id} not found", 404)
```

---

## 🟡 Intermediate

### 1. Context Managers

**Question:** The `with` statement.

**Answer:**

```python
# Built-in — file handling
with open("data.txt") as f:
    data = f.read()
# File is automatically closed, even on exceptions

# Custom class-based
class DatabaseConnection:
    def __enter__(self):
        self.conn = create_connection()
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()
        return False  # Don't suppress exceptions

with DatabaseConnection() as db:
    db.execute("SELECT 1")

# Decorator-based (simpler)
from contextlib import contextmanager

@contextmanager
def timer(label):
    start = time.perf_counter()
    yield  # Code inside "with" block runs here
    elapsed = time.perf_counter() - start
    print(f"{label}: {elapsed:.4f}s")

with timer("query"):
    db.execute("SELECT * FROM users")
```

---

### 2. FastAPI

**Question:** FastAPI vs Express.

**Answer:**

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr

app = FastAPI()

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: int = Field(ge=0, le=150)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

@app.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate):
    result = await db.users.create(user.model_dump())
    return result

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await db.users.find(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

| Feature      | FastAPI                | Express             |
| ------------ | ---------------------- | ------------------- |
| Validation   | Built-in (Pydantic)    | Manual (Zod/Joi)    |
| OpenAPI docs | Auto-generated `/docs` | Manual (Swagger)    |
| Type safety  | Full (Python hints)    | Depends on TS setup |
| Async        | Native `asyncio`       | Native event loop   |
| Performance  | Very fast (Starlette)  | Fast                |

---

## 🔴 Advanced

### 1. GIL & Concurrency

**Question:** GIL impact on concurrency.

**Answer:**

| Task Type                 | Solution                          | Why                               |
| ------------------------- | --------------------------------- | --------------------------------- |
| I/O-bound (network, file) | `asyncio` or `threading`          | GIL is released during I/O        |
| CPU-bound (computation)   | `multiprocessing`                 | Separate processes, separate GILs |
| Mixed                     | `asyncio` + `ProcessPoolExecutor` | Best of both                      |

```python
# CPU-bound — use multiprocessing
from multiprocessing import Pool

def process_image(path):
    # Heavy computation — runs in separate process
    return transform(load(path))

with Pool(processes=4) as pool:
    results = pool.map(process_image, image_paths)

# I/O-bound — use asyncio
async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [session.get(url) for url in urls]
        return await asyncio.gather(*tasks)
```

**Note:** Python 3.13 introduces a free-threaded mode (no GIL) as an experimental feature.

---

### 2. Metaprogramming

**Question:** Practical metaprogramming.

**Answer:**

```python
# __getattr__ — dynamic attribute access (used in ORMs)
class DotDict:
    def __init__(self, data: dict):
        self._data = data

    def __getattr__(self, name):
        try:
            return self._data[name]
        except KeyError:
            raise AttributeError(f"No attribute '{name}'")

config = DotDict({"host": "localhost", "port": 5432})
config.host  # "localhost" — attribute-style access

# Descriptors — used by @property, ORMs, validation
class Validated:
    def __init__(self, validator):
        self.validator = validator

    def __set_name__(self, owner, name):
        self.name = name

    def __set__(self, instance, value):
        if not self.validator(value):
            raise ValueError(f"Invalid value for {self.name}: {value}")
        instance.__dict__[self.name] = value

class User:
    age = Validated(lambda x: 0 <= x <= 150)
    email = Validated(lambda x: "@" in x)

user = User()
user.age = 25     # ✅
user.age = -1     # ❌ ValueError
```
