# TypeScript Classes

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Class Basics & Access Modifiers

**Question:**
Difference between `public`, `private`, `protected`, and `#private`.

**Answer:**

| Modifier            | Access             | Runtime enforcement      | Subclass access |
| ------------------- | ------------------ | ------------------------ | --------------- |
| `public` (default)  | Everywhere         | No                       | ✅              |
| `private`           | Class only         | ❌ (TS-only, bypassable) | ❌              |
| `protected`         | Class + subclasses | ❌ (TS-only)             | ✅              |
| `#private` (ES2022) | Class only         | ✅ (truly private)       | ❌              |

```typescript
class User {
  public name: string; // Accessible everywhere
  private password: string; // TS-only private (compiled away)
  protected role: string; // Accessible in subclasses
  #ssn: string; // True runtime private

  constructor(name: string, password: string, ssn: string) {
    this.name = name;
    this.password = password;
    this.role = "user";
    this.#ssn = ssn;
  }
}

const user = new User("Alice", "pass", "123");
user.name; // ✅
user.password; // ❌ TS Error (but accessible at runtime via user["password"])
user.#ssn; // ❌ Syntax Error — truly private at runtime
```

**Recommendation:** Use `#private` for sensitive data. Use `private` keyword for general encapsulation.

---

### 2. Constructor Shorthand

**Question:**
TypeScript's parameter property shorthand.

**Answer:**

```typescript
// ❌ Verbose
class User {
  id: string;
  name: string;
  email: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

// ✅ Shorthand — access modifiers in constructor parameters
class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    private password?: string,
  ) {}
}
// TypeScript automatically creates and assigns properties
```

---

## 🟡 Intermediate

### 1. Abstract Classes vs Interfaces

**Question:**
Logging system — abstract class vs interface.

**Answer:**

```typescript
// Abstract class — shared implementation
abstract class BaseLogger {
  protected level: string = "info";

  abstract log(message: string): void; // Must implement

  error(message: string): void {
    // Default implementation
    this.log(`[ERROR] ${message}`);
  }

  setLevel(level: string): void {
    this.level = level;
  }
}

class ConsoleLogger extends BaseLogger {
  log(message: string): void {
    console.log(`[${this.level}] ${message}`);
  }
}

// Interface — pure contract
interface Logger {
  log(message: string): void;
  error(message: string): void;
}
```

**Choose abstract class when:** You have shared behavior or state (like `setLevel`).
**Choose interface when:** You only need a contract with no shared logic.

---

### 2. `implements` vs `extends`

**Question:**
Difference and multiple inheritance.

**Answer:**

```typescript
// extends — inherit implementation (single only)
class Dog extends Animal {
  bark() { console.log("Woof!"); }
}

// implements — satisfy a contract (multiple allowed)
class Dog implements IAnimal, ISerializable {
  name: string;
  speak() { ... }  // Must implement
  serialize() { ... }  // Must implement
}
```

| Feature        | `extends`            | `implements`                   |
| -------------- | -------------------- | ------------------------------ |
| Inherits code  | ✅                   | ❌ (must implement everything) |
| Multiple       | ❌ (single class)    | ✅ (multiple interfaces)       |
| Runtime effect | ✅ (prototype chain) | ❌ (type-only)                 |

---

### 3. Generic Classes

**Question:**
Type-safe `Stack<T>`.

**Answer:**

```typescript
class Stack<T> {
  #items: T[] = [];

  push(item: T): void {
    this.#items.push(item);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  peek(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  isEmpty(): boolean {
    return this.#items.length === 0;
  }

  get size(): number {
    return this.#items.length;
  }
}

const numStack = new Stack<number>();
numStack.push(1); // ✅
numStack.push("a"); // ❌ Error: string is not number
numStack.pop(); // type: number | undefined
```

---

## 🔴 Advanced

### 1. Mixins Pattern

**Question:**
Compose behavior from multiple sources.

**Answer:**

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

// Mixin factory functions
function Timestamped<T extends Constructor>(Base: T) {
  return class extends Base {
    createdAt = new Date();
    updatedAt = new Date();
  };
}

function SoftDeletable<T extends Constructor>(Base: T) {
  return class extends Base {
    deletedAt: Date | null = null;
    softDelete() {
      this.deletedAt = new Date();
    }
    restore() {
      this.deletedAt = null;
    }
  };
}

// Compose mixins
class BaseEntity {
  id = crypto.randomUUID();
}

class User extends SoftDeletable(Timestamped(BaseEntity)) {
  constructor(public name: string) {
    super();
  }
}

const user = new User("Alice");
user.id; // From BaseEntity
user.createdAt; // From Timestamped
user.softDelete(); // From SoftDeletable
```

---

### 2. Singleton Pattern

**Question:**
Implement type-safe Singleton.

**Answer:**

```typescript
class Database {
  private static instance: Database;

  private constructor(private readonly connectionString: string) {}

  static getInstance(connStr?: string): Database {
    if (!Database.instance) {
      if (!connStr)
        throw new Error("Connection string required for first init");
      Database.instance = new Database(connStr);
    }
    return Database.instance;
  }

  query(sql: string): void {
    console.log(`Executing: ${sql}`);
  }
}

const db = Database.getInstance("postgres://...");
const db2 = Database.getInstance(); // Same instance
// new Database(); // ❌ Error — constructor is private
```

**Modern alternatives to Singleton:**

- **Module-level constants** — ES modules are singletons by default: `export const db = createConnection()`.
- **Dependency injection** — frameworks like NestJS, InversifyJS manage instance lifecycle.
- **Singleton makes testing hard** — you can't swap implementations. DI is preferred in production.
