# JavaScript Objects & Prototypes

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Object Creation & Layout

**Question:**
How do you create an object in JavaScript? Why is using `new Object()` generally discouraged compared to object literals?

**Answer:**
**Ways to create:**

1. **Object Literal:** `const obj = { key: "value" };` _(Preferred)_
2. **`Object.create()`:** `const obj = Object.create(null);`
3. **Constructor:** `function Person() {}; const p = new Person();`
4. **`new Object()`:** `const obj = new Object();`

**Why literal is better:**

- More concise and readable.
- Potentially faster (engine optimizations for literal forms).
- Avoids scope lookup overhead for `Object` constructor.
- `new Object(value)` has surprising behavior: `new Object(1)` returns a `Number` wrapper, not a plain object.

---

### 2. Accessing Properties

**Question:**
What is the difference between `obj.key` and `obj['key']`? When _must_ you use bracket notation?

**Answer:**

| Notation               | Pros                           | Constraints                    |
| ---------------------- | ------------------------------ | ------------------------------ |
| `obj.key` (dot)        | Cleaner, easier to read        | Key must be a valid identifier |
| `obj['key']` (bracket) | Dynamic access, any string key | Slightly more verbose          |

**Must use brackets when:**

1. The key is stored in a variable: `obj[myKeyVar]`
2. The key contains special characters or spaces: `obj["user name"]`
3. The key starts with a number: `obj["2ndPlace"]`
4. Using computed keys: `obj[\`item\_${id}\`]`

**Real-world example:** Dynamically accessing form fields — `formData[fieldName]` — is impossible with dot notation.

---

### 3. Spread vs `Object.assign`

**Question:**
You need to merge two configuration objects. What is the difference between `Object.assign()` and spread `{ ...a, ...b }`?

**Answer:**

```javascript
const defaults = { theme: "dark", lang: "en" };
const userPrefs = { lang: "fr", fontSize: 14 };

// Both produce: { theme: "dark", lang: "fr", fontSize: 14 }
const merged1 = Object.assign({}, defaults, userPrefs);
const merged2 = { ...defaults, ...userPrefs };
```

| Feature                 | `Object.assign`              | Spread `{...}`            |
| ----------------------- | ---------------------------- | ------------------------- |
| Mutates target?         | ✅ Yes (first arg)           | ❌ No (always new object) |
| Copies setters?         | ✅ Invokes setters on target | ❌ Just copies values     |
| Works with non-objects? | Coerces to object            | Skips primitives          |

**Rule of thumb:** Use spread for immutable merges (React state), use `Object.assign(target, ...)` only when you intentionally want to mutate the target.

---

## 🟡 Intermediate

### 1. Prototype Chain

**Question:**
Explain how property lookup works in JavaScript. If I access `obj.toString()`, where does the engine find it?

**Answer:**

1. The engine checks if `obj` has its own property named `toString`.
2. If not, it looks at `obj.__proto__` (the prototype — `Object.prototype` for plain objects).
3. If not found there, it looks at `obj.__proto__.__proto__`.
4. This continues until it finds the property or reaches `null` (end of chain).

`toString` is usually found on `Object.prototype`.

**Prototype chain for a plain object:**

```
obj → Object.prototype → null
```

**For an array:**

```
arr → Array.prototype → Object.prototype → null
```

**Performance note:** Long prototype chains slow down property lookups. V8 optimizes common chains with **inline caches**, but megamorphic lookups (accessing properties on objects with many different shapes) force V8 into slower generic paths.

---

### 2. Deep Equality

**Question:**
Why does `{ a: 1 } === { a: 1 }` return `false`? How would you check if two objects are structurally equal?

**Answer:**
**Reason:** Objects are reference types. The `===` operator compares **memory references**, not content. Two different objects in memory are never equal, even if their contents are identical.

**Approaches to compare:**

| Method                                    | Pros               | Cons                                           |
| ----------------------------------------- | ------------------ | ---------------------------------------------- |
| `JSON.stringify(a) === JSON.stringify(b)` | Simple             | Fails on key order, `undefined`, `Date`, `Map` |
| Recursive deep comparison                 | Full control       | Complex to implement correctly                 |
| `lodash.isEqual(a, b)`                    | Handles edge cases | External dependency                            |
| Node.js `assert.deepStrictEqual`          | Built-in for tests | Only for Node.js, throws on mismatch           |

**⚠️ Common mistake:** `JSON.stringify` is _not_ order-stable. `{a:1, b:2}` and `{b:2, a:1}` produce different strings. Use `Object.keys(obj).sort()` first if using this approach.

---

### 3. Object.freeze vs Object.seal

**Question:**
You are building a configuration module that should not be modified at runtime. Should you use `Object.freeze` or `Object.seal`?

**Answer:**

| Feature                  | `Object.freeze()` | `Object.seal()` |
| ------------------------ | ----------------- | --------------- |
| Add properties           | ❌                | ❌              |
| Remove properties        | ❌                | ❌              |
| Modify values            | ❌                | ✅              |
| Re-configure descriptors | ❌                | ❌              |

**Use `Object.freeze()` for configs** — it's fully immutable.

**⚠️ Critical gotcha:** `Object.freeze()` is **shallow**. Nested objects are NOT frozen:

```javascript
const config = Object.freeze({ db: { host: "localhost" } });
config.db.host = "hacked"; // ✅ This WORKS!
```

**Deep freeze utility:**

```javascript
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach((val) => {
    if (typeof val === "object" && val !== null && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  });
  return obj;
}
```

---

### 4. Property Descriptors

**Question:**
Using `Object.defineProperty()`, create a read-only `id` property on a user object that doesn't show up in `for...in` loops or `JSON.stringify()`.

**Answer:**

```javascript
const user = { name: "Alice" };

Object.defineProperty(user, "id", {
  value: "usr_abc123",
  writable: false, // Cannot be reassigned
  enumerable: false, // Hidden from for...in and JSON.stringify
  configurable: false, // Cannot be deleted or reconfigured
});

console.log(user.id); // "usr_abc123"
console.log(JSON.stringify(user)); // '{"name":"Alice"}' — id is hidden
user.id = "hacked"; // Silently fails (or throws in strict mode)
```

**Production use cases:**

- Internal tracking IDs on public API objects.
- Framework metadata (React's `$$typeof` on elements is non-enumerable).
- Library internals that shouldn't leak into serialization.

---

## 🔴 Advanced

### 1. Prototypal Inheritance Mechanics

**Question:**
How would you implement inheritance without `class` or `extends`?

**Answer:**

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  console.log(`${this.name} makes a noise.`);
};

function Dog(name) {
  Animal.call(this, name); // Call parent constructor ("super")
}

// Inherit prototype
Dog.prototype = Object.create(Animal.prototype);
// Reset constructor pointer
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function () {
  console.log(`${this.name} barks.`);
};
```

**`Object.create(Animal.prototype)` vs `new Animal()` for prototype setup:**

| Method                            | What happens                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| `Object.create(Animal.prototype)` | Creates an object linked to `Animal.prototype` **without running the constructor** ✅            |
| `new Animal()`                    | Runs the constructor, potentially adding unwanted instance properties or causing side effects ❌ |

Always use `Object.create()` for prototype chain setup.

---

### 2. Optimizing Object Lookup in V8

**Question:**
Why is `delete obj.key` slower than `obj.key = undefined` in V8?

**Answer:**
**Hidden Classes (Shapes):**
V8 optimizes object property access by creating "Hidden Classes" (also called "Shapes" or "Maps") based on the object's structure.

- Objects created in the same order share the same hidden class → fast property access via offset.
- **`delete`** changes the object's shape, forcing V8 to abandon the optimized hidden class and fall back to **dictionary-mode** lookup (~100x slower).
- Setting to `undefined` keeps the shape intact, maintaining fast property access.

**At scale this matters:**

```javascript
// ❌ Bad — each delete changes the hidden class
users.forEach((u) => delete u.tempToken);

// ✅ Good — shape is preserved
users.forEach((u) => (u.tempToken = undefined));

// ✅ Best — create without the property from the start
users.map(({ tempToken, ...rest }) => rest);
```

---

### 3. Mixins & Composition

**Question:**
How do you implement multiple inheritance in JavaScript using Mixins?

**Answer:**
JavaScript does not support multiple inheritance directly. You use **Mixins** — objects that provide methods to be copied onto another prototype.

```javascript
const CanFly = {
  fly() {
    console.log(`${this.name} is flying`);
  },
};

const CanSwim = {
  swim() {
    console.log(`${this.name} is swimming`);
  },
};

function Duck(name) {
  this.name = name;
}
Object.assign(Duck.prototype, CanFly, CanSwim);

new Duck("Donald").fly(); // "Donald is flying"
new Duck("Donald").swim(); // "Donald is swimming"
```

**Modern approach — class mixin factories:**

```javascript
const Flyable = (Base) =>
  class extends Base {
    fly() {
      console.log(`${this.name} is flying`);
    }
  };

const Swimmable = (Base) =>
  class extends Base {
    swim() {
      console.log(`${this.name} is swimming`);
    }
  };

class Duck extends Flyable(Swimmable(Animal)) {}
```

**Composition > Inheritance (React's philosophy):**
React moved from class mixins to Hooks (composition) because mixins cause:

- Name collisions
- Implicit dependencies
- Snowballing complexity

---

### 4. `Symbol.toPrimitive` and Object Coercion

**Question:**
How does JavaScript decide what to do when you write `+obj` or `` `${obj}` ``?

**Answer:**
JavaScript calls `[Symbol.toPrimitive](hint)` with one of three hints: `"number"`, `"string"`, or `"default"`.

```javascript
class Currency {
  constructor(amount, code) {
    this.amount = amount;
    this.code = code;
  }

  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case "number":
        return this.amount;
      case "string":
        return `${this.amount} ${this.code}`;
      default:
        return this.amount;
    }
  }
}

const price = new Currency(42.5, "USD");

console.log(+price); // 42.5       (hint: "number")
console.log(`${price}`); // "42.5 USD" (hint: "string")
console.log(price + 10); // 52.5       (hint: "default")
```

**Coercion priority chain (without `Symbol.toPrimitive`):**

1. If hint is `"string"` → try `toString()` first, then `valueOf()`
2. If hint is `"number"` or `"default"` → try `valueOf()` first, then `toString()`

**Real-world use:** Custom numeric types, money libraries, date wrappers that need clean string interpolation and arithmetic support.
