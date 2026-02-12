# ES6+ Features

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Spread & Rest Operators

**Question:**
Explain the difference between the spread and rest operators.

**Answer:**
Both use `...` syntax but serve opposite purposes:

**Spread — "expands" elements:**

```javascript
// Array spreading
const arr = [1, 2, 3];
const copy = [...arr, 4, 5]; // [1, 2, 3, 4, 5]

// Object spreading
const base = { a: 1, b: 2 };
const extended = { ...base, c: 3 }; // { a: 1, b: 2, c: 3 }

// Function call
Math.max(...arr); // 3
```

**Rest — "collects" elements:**

```javascript
// Function parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

// Destructuring remainder
const [first, ...rest] = [1, 2, 3, 4]; // first = 1, rest = [2, 3, 4]
const { id, ...otherProps } = user; // Extract id, collect the rest
```

**⚠️ Common mistake:** Spread creates a **shallow** copy. Nested objects are still shared by reference.

---

### 2. Template Literals

**Question:**
What capabilities do template literals provide beyond interpolation?

**Answer:**

**1. Multi-line strings:**

```javascript
const html = `
  <div>
    <p>Hello, ${name}</p>
  </div>
`;
```

**2. Expression embedding:**

```javascript
const total = `Total: $${(price * qty).toFixed(2)}`;
```

**3. Tagged templates (advanced):**
A function that processes template literal parts:

```javascript
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : "";
    return result + str + value;
  }, "");
}

const name = "Alice";
highlight`Hello, ${name}!`; // "Hello, <mark>Alice</mark>!"
```

**Real-world tagged template uses:**

- **CSS-in-JS:** `styled.div\`color: red;\`` (styled-components)
- **SQL:** `sql\`SELECT \* FROM users WHERE id = ${id}\`` (safely parameterized)
- **GraphQL:** `gql\`query { user { name } }\``
- **i18n:** `t\`Hello, ${name}\``

---

### 3. Destructuring

**Question:**
Refactor the function to use destructuring with defaults.

**Answer:**

```javascript
// ❌ Before
function createUser(options) {
  const name = options.name;
  const age = options.age || 18;
  const role = options.role || "user";
}

// ✅ After — destructuring with defaults in parameter
function createUser({ name, age = 18, role = "user" } = {}) {
  console.log(name, age, role);
}

createUser({ name: "Alice" }); // "Alice", 18, "user"
createUser(); // undefined, 18, "user" (the `= {}` handles no argument)
```

**Advanced patterns:**

```javascript
// Nested destructuring
const { address: { city, zip } = {} } = user;

// Rename during destructuring
const { name: userName, id: userId } = apiResponse;

// Computed property destructuring
const key = "dynamicKey";
const { [key]: value } = obj;
```

**⚠️ The `= {}` default is critical:** Without it, calling `createUser()` with no argument throws because you can't destructure `undefined`.

---

## 🟡 Intermediate

### 1. `Map` vs Object and `Set` vs Array

**Question:**
Compare `Map` vs Object and `Set` vs Array for common use cases.

**Answer:**

**`Map` vs Object:**

| Feature       | `Map`                                 | Object                       |
| ------------- | ------------------------------------- | ---------------------------- |
| Key types     | **Any** (objects, functions, numbers) | String/Symbol only           |
| Key order     | Insertion order guaranteed            | Insertion order (mostly)     |
| Size          | `map.size`                            | `Object.keys(obj).length`    |
| Iteration     | Directly iterable (`for...of`)        | Need `Object.entries()`      |
| Performance   | Better for frequent add/delete        | Better for static structures |
| Serialization | Manual (`JSON.stringify` won't work)  | Native JSON support          |

```javascript
// Map — ideal for caching with non-string keys
const cache = new Map();
cache.set(userObj, computeResult); // Object as key!
cache.set("/api/users", data); // String key also fine

// Object — ideal for static config
const config = { theme: "dark", lang: "en" };
```

**`Set` vs Array for uniqueness:**

```javascript
// Array — O(n) lookup
const tags = ["react", "vue"];
if (!tags.includes("react")) tags.push("react"); // ❌ O(n) check

// Set — O(1) lookup
const tagSet = new Set(["react", "vue"]);
tagSet.add("react"); // Automatically deduplicated
tagSet.has("react"); // O(1) ✅
```

---

### 2. Symbols

**Question:**
How do Symbols prevent name collisions in a plugin system?

**Answer:**

```javascript
// Plugin A
const pluginAMeta = Symbol("pluginA");
sharedObj[pluginAMeta] = { version: "1.0" };

// Plugin B — same description, but a DIFFERENT Symbol
const pluginBMeta = Symbol("pluginB");
sharedObj[pluginBMeta] = { version: "2.0" };

// No collision — each Symbol is unique
sharedObj[pluginAMeta]; // { version: "1.0" }
sharedObj[pluginBMeta]; // { version: "2.0" }

// Symbols are hidden from normal enumeration
Object.keys(sharedObj); // [] — Symbols not included
JSON.stringify(sharedObj); // "{}" — Symbols not included
Object.getOwnPropertySymbols(sharedObj); // [Symbol(pluginA), Symbol(pluginB)]
```

**`Symbol()` vs `Symbol.for()`:**

| Method              | Scope                                  | Use Case                        |
| ------------------- | -------------------------------------- | ------------------------------- |
| `Symbol("desc")`    | Unique per call                        | Private keys, no sharing needed |
| `Symbol.for("key")` | Global registry (shared across realms) | Cross-module communication      |

```javascript
Symbol("foo") === Symbol("foo"); // false — always unique
Symbol.for("foo") === Symbol.for("foo"); // true — same registry key
```

---

### 3. Optional Chaining & Nullish Coalescing

**Question:**
Refactor deeply nested property access safely.

**Answer:**

```javascript
// ❌ Before — verbose and error-prone
const street =
  user && user.address && user.address.street ? user.address.street : "Unknown";

// ✅ After — optional chaining + nullish coalescing
const street = user?.address?.street ?? "Unknown";
```

**Why `?.` is better than `&&` chaining:**

| Expression      | `0`          | `""`         | `false`      | `null`/`undefined` |
| --------------- | ------------ | ------------ | ------------ | ------------------ |
| `value && next` | Stops ❌     | Stops ❌     | Stops ❌     | Stops ✅           |
| `value?.next`   | Continues ✅ | Continues ✅ | Continues ✅ | Stops ✅           |

`?.` only short-circuits on `null` or `undefined`, while `&&` short-circuits on any falsy value.

**Works with methods and arrays too:**

```javascript
user?.getProfile?.(); // Method call
users?.[0]?.name; // Array access
user?.address?.toString?.(); // Multiple optional levels
```

---

## 🔴 Advanced

### 1. Generators & Iterators

**Question:**
Implement a custom `Range` iterable.

**Answer:**

```javascript
class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  // Implement the iterable protocol
  [Symbol.iterator]() {
    let current = this.start;
    const { end, step } = this;

    return {
      next() {
        if (current <= end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { done: true };
      },
    };
  }
}

// Usage
[...new Range(1, 5)]; // [1, 2, 3, 4, 5]
[...new Range(0, 10, 3)]; // [0, 3, 6, 9]

for (const n of new Range(1, 3)) {
  console.log(n); // 1, 2, 3
}
```

**Generator shorthand:**

```javascript
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) {
      yield i;
    }
  }
}
```

**The iterator protocol requires:** An object with a `next()` method that returns `{ value, done }`.

---

### 2. Proxy & Reflect for Reactivity

**Question:**
Build a simple reactive system using Proxy (like Vue 3's core).

**Answer:**

```javascript
function reactive(target, onChange) {
  return new Proxy(target, {
    set(obj, prop, value, receiver) {
      const oldValue = obj[prop];
      const result = Reflect.set(obj, prop, value, receiver);
      if (oldValue !== value) {
        onChange(prop, value, oldValue);
      }
      return result;
    },
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver);
      // Deep reactivity — wrap nested objects
      if (typeof value === "object" && value !== null) {
        return reactive(value, onChange);
      }
      return value;
    },
  });
}

// Usage
const state = reactive(
  { count: 0, user: { name: "Alice" } },
  (prop, newVal, oldVal) => {
    console.log(`${prop} changed: ${oldVal} → ${newVal}`);
  },
);

state.count = 1; // "count changed: 0 → 1"
state.user.name = "Bob"; // "name changed: Alice → Bob"
```

**Why Reflect?** `Reflect.set()` ensures correct behavior with inherited properties and returns a boolean indicating success. Always use `Reflect` inside Proxy traps for correct semantics.

**Performance implications:**

- ~5-10x slower than direct property access.
- V8 cannot optimize (inline) Proxy traps.
- Vue 3 mitigates this by only wrapping reactive state, not all objects.

---

### 3. WeakMap for Private Data

**Question:**
How were `WeakMap`s used for truly private instance data?

**Answer:**

```javascript
const _private = new WeakMap();

class User {
  constructor(name, ssn) {
    this.name = name; // Public
    _private.set(this, { ssn }); // Private — keyed to instance
  }

  getSSN(pin) {
    if (pin !== "1234") throw new Error("Invalid PIN");
    return _private.get(this).ssn;
  }
}

const user = new User("Alice", "123-45-6789");
user.name; // "Alice" — public
user.ssn; // undefined — not on the object
_private.get(user); // Only accessible if you have the WeakMap reference
```

**WeakMap vs Closure for private data:**

| Feature                    | WeakMap                                 | Closure                              |
| -------------------------- | --------------------------------------- | ------------------------------------ |
| Memory per instance        | Shared methods on prototype ✅          | New function objects per instance ❌ |
| Garbage collection         | Auto-collected when instance is GC'd ✅ | Held until closure is released       |
| 1000 instances, 10 methods | 1 WeakMap + shared prototype            | 10,000 new function objects          |
| Access from subclasses     | Possible (if WeakMap is accessible)     | Not possible                         |

**Modern alternative:** `#private` class fields (ES2022) provide the same guarantee without the WeakMap boilerplate.
