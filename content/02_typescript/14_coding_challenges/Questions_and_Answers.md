# TypeScript Coding Challenges

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Type-Safe `groupBy`

**Challenge:** Implement a type-safe `groupBy` function that groups array elements by a key.

```typescript
groupBy(
  [
    { name: "Alice", dept: "eng" },
    { name: "Bob", dept: "eng" },
    { name: "Carol", dept: "design" },
  ],
  "dept",
);
// { eng: [{...}, {...}], design: [{...}] }
```

**Answer:**

```typescript
function groupBy<T, K extends keyof T>(
  items: T[],
  key: K,
): Record<string, T[]> {
  return items.reduce(
    (groups, item) => {
      const value = String(item[key]);
      (groups[value] ??= []).push(item);
      return groups;
    },
    {} as Record<string, T[]>,
  );
}
```

**Key TypeScript features used:** Generic constraint `K extends keyof T` ensures only valid keys are accepted.

---

### 2. Type-Safe `pick` and `omit`

**Challenge:** Implement runtime `pick` and `omit` functions with full type safety.

**Answer:**

```typescript
function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
}

function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

// Usage
const user = { id: "1", name: "Alice", password: "secret", email: "a@b.com" };
const publicUser = omit(user, ["password"]); // type: { id, name, email }
const credentials = pick(user, ["email", "password"]); // type: { email, password }
```

---

## 🟡 Intermediate

### 1. Type-Safe Event Emitter

**Challenge:** Build a fully type-safe event emitter where event names and their payload types are enforced.

**Answer:**

```typescript
type EventMap = {
  userLogin: { userId: string; timestamp: Date };
  userLogout: { userId: string };
  error: { message: string; code: number };
};

class TypedEmitter<T extends Record<string, any>> {
  private listeners = new Map<keyof T, Set<Function>>();

  on<K extends keyof T>(
    event: K,
    handler: (payload: T[K]) => void,
  ): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
    return () => this.listeners.get(event)?.delete(handler);
  }

  emit<K extends keyof T>(event: K, payload: T[K]): void {
    this.listeners.get(event)?.forEach((handler) => handler(payload));
  }
}

// Usage
const emitter = new TypedEmitter<EventMap>();
emitter.on("userLogin", (payload) => {
  console.log(payload.userId); // ✅ TypeScript knows the shape
});
emitter.emit("userLogin", { userId: "123", timestamp: new Date() }); // ✅
emitter.emit("userLogin", { wrong: "shape" }); // ❌ Type error
emitter.emit("nonexistent", {}); // ❌ Type error
```

---

### 2. Builder Pattern with Types

**Challenge:** Create a type-safe query builder where methods chain and the final type reflects what was configured.

**Answer:**

```typescript
type QueryConfig = {
  table?: string;
  where?: string;
  orderBy?: string;
  limit?: number;
};

class QueryBuilder<T extends QueryConfig = {}> {
  private config: QueryConfig = {};

  from<Table extends string>(table: Table): QueryBuilder<T & { table: Table }> {
    this.config.table = table;
    return this as any;
  }

  where(condition: string): QueryBuilder<T & { where: string }> {
    this.config.where = condition;
    return this as any;
  }

  orderBy(field: string): QueryBuilder<T & { orderBy: string }> {
    this.config.orderBy = field;
    return this as any;
  }

  limit(n: number): QueryBuilder<T & { limit: number }> {
    this.config.limit = n;
    return this as any;
  }

  // Only callable when table is set
  build(this: QueryBuilder<{ table: string } & QueryConfig>): string {
    let sql = `SELECT * FROM ${this.config.table}`;
    if (this.config.where) sql += ` WHERE ${this.config.where}`;
    if (this.config.orderBy) sql += ` ORDER BY ${this.config.orderBy}`;
    if (this.config.limit) sql += ` LIMIT ${this.config.limit}`;
    return sql;
  }
}

new QueryBuilder()
  .from("users")
  .where("age > 18")
  .orderBy("name")
  .limit(10)
  .build(); // ✅ "SELECT * FROM users WHERE age > 18 ORDER BY name LIMIT 10"

new QueryBuilder().where("age > 18").build(); // ❌ Error: Property 'table' is missing
```

---

## 🔴 Advanced

### 1. Implement a Type-Safe `path` Accessor

**Challenge:** Create a function that accesses nested object properties using a dot-separated string path, with full type inference for the return type.

**Answer:**

```typescript
type PathOf<T, Path extends string> = Path extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? PathOf<T[Head], Tail>
    : never
  : Path extends keyof T
    ? T[Path]
    : never;

function get<T extends object, P extends string>(
  obj: T,
  path: P,
): PathOf<T, P> {
  return path.split(".").reduce((acc: any, key) => acc?.[key], obj);
}

// Usage
const config = {
  db: {
    host: "localhost",
    port: 5432,
    credentials: { user: "admin", password: "secret" },
  },
  cache: { ttl: 3600 },
};

const host = get(config, "db.host"); // type: string ✅
const port = get(config, "db.port"); // type: number ✅
const user = get(config, "db.credentials.user"); // type: string ✅
const bad = get(config, "db.invalid"); // type: never ❌
```

---

### 2. Type-Safe State Machine

**Challenge:** Implement a state machine where transitions are enforced at the type level — invalid state transitions cause compile-time errors.

**Answer:**

```typescript
type Transitions = {
  idle: "loading";
  loading: "success" | "error";
  success: "idle";
  error: "idle" | "loading";
};

type State = keyof Transitions;

class StateMachine<S extends State> {
  constructor(private state: S) {}

  transition<Next extends Transitions[S]>(
    next: Next,
  ): StateMachine<Next & State> {
    console.log(`${this.state} → ${next}`);
    return new StateMachine(next as Next & State);
  }

  getState(): S {
    return this.state;
  }
}

// Usage
const machine = new StateMachine("idle");
const loading = machine.transition("loading"); // ✅ idle → loading
const success = loading.transition("success"); // ✅ loading → success
const back = success.transition("idle"); // ✅ success → idle

// machine.transition("success"); // ❌ Error: "success" not in "loading"
// loading.transition("idle");    // ❌ Error: "idle" not in "success" | "error"
```

This enforces that you can only make valid state transitions — invalid ones are caught at compile time before your code even runs.
