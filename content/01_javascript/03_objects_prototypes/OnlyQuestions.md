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

### 2. Accessing Properties

**Question:**
What is the difference between `obj.key` and `obj['key']`? When _must_ you use bracket notation? Give a real-world example where bracket notation is essential.

### 3. Spread vs `Object.assign`

**Question:**
You need to merge two configuration objects where the second should override the first. What is the difference between `Object.assign()` and the spread operator `{ ...a, ...b }`? When would you prefer one over the other?

---

## 🟡 Intermediate

### 1. Prototype Chain

**Question:**
Explain how property lookup works in JavaScript. If I access `obj.toString()`, where does the engine find it? Draw the prototype chain for a plain object.

### 2. Deep Equality

**Question:**
Why does `{ a: 1 } === { a: 1 }` return `false`? You need to compare two API response objects for equality in a test suite — what approaches are available and what are the trade-offs of each?

### 3. Object.freeze vs Object.seal

**Question:**
You are building a configuration module that should not be modified at runtime. Should you use `Object.freeze` or `Object.seal`? What is the difference? Does `Object.freeze` handle nested objects?

### 4. Property Descriptors

**Question:**
Using `Object.defineProperty()`, create a read-only `id` property on a user object that doesn't show up in `for...in` loops or `JSON.stringify()`. When would this pattern be useful in production code?

---

## 🔴 Advanced

### 1. Prototypal Inheritance Mechanics

**Question:**
How would you implement inheritance without `class` or `extends`? Specifically, create a `Dog` constructor that inherits from `Animal`. What are the subtle differences between `Object.create(Animal.prototype)` and `new Animal()` for setting up the prototype chain?

### 2. Optimizing Object Lookup in V8

**Question:**
Why is `delete obj.key` slower than `obj.key = undefined` in V8 (Chrome/Node.js)? What are "hidden classes" and how do they affect performance at scale?

### 3. Mixins & Composition

**Question:**
How do you implement multiple inheritance in JavaScript using Mixins? When should you prefer composition over inheritance, and how does this apply to React's design philosophy?

### 4. `Symbol.toPrimitive` and Object Coercion

**Question:**
How does JavaScript decide what to do when you write `+obj` or `\`${obj}\``? Implement a custom `[Symbol.toPrimitive]` method to control how an object converts to different types.
