# JavaScript Closures & Scope

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Scope Types

**Question:**
What are the three main types of scope in JavaScript? Give a brief example of each.

### 2. Closure Definition

**Question:**
In your own words, what is a closure? Write a simple function that demonstrates a closure and explain what variable is "closed over."

---

## 🟡 Intermediate

### 1. Data Privacy with Closures

**Question:**
Using a closure, create a function `createSecret(secret)` that returns an object with two methods: `getSecret()` and `setSecret(newSecret)`. The secret variable itself should not be directly accessible from outside.

### 2. Closure in Loops

**Question:**
Explain why the following code logs `3, 3, 3` instead of `0, 1, 2`. How does changing `var` to `let` fix it in terms of scope and closure?

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

### 3. Module Pattern

**Question:**
Before ES Modules, developers used closures to create modules with private state. Implement a `Counter` module that exposes `increment()`, `decrement()`, and `getCount()` methods but keeps the count variable private. Why was this pattern important?

---

## 🔴 Advanced

### 1. Memory Leaks with Closures

**Question:**
How can closures cause memory leaks in a long-running Node.js application? Give a specific example and explain how the Garbage Collector is affected. How would you detect and fix such a leak?

### 2. React Hooks & Stale Closures

**Question:**
Explain the "stale closure" problem in React hooks. Given the following code, why does clicking the button always log `0`? How do you fix it?

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // Always logs 0!
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{count}</p>;
}
```

### 3. Closure-Based State Machines

**Question:**
Implement a simple traffic light state machine using closures. It should cycle through `green → yellow → red → green` and expose a `next()` method. How does this pattern compare to using a class with private fields?
