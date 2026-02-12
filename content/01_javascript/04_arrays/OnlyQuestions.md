# JavaScript Arrays

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Array Iteration Methods

**Question:**
You need to iterate over an array of user objects and render their names. A junior developer uses a `for` loop. What modern alternatives exist and when would you choose each?

### 2. `map()` vs `forEach()`

**Question:**
Your teammate uses `.forEach()` to transform an array and push results into a new array. Why is `.map()` a better choice here? When is `.forEach()` actually appropriate?

### 3. `slice()` vs `splice()`

**Question:**
You need to extract the middle 3 elements from an array without modifying the original. Which method do you use? Then, how would you remove those same 3 elements in-place?

### 4. Array Destructuring

**Question:**
Refactor the following code to use array destructuring. How would you skip elements and capture "the rest"?

```javascript
const coords = [10, 20, 30, 40, 50];
const x = coords[0];
const y = coords[1];
```

---

## 🟡 Intermediate

### 1. `reduce()` for Complex Transformations

**Question:**
Given an array of order objects `[{ product: "A", qty: 2, price: 10 }, ...]`, use `reduce()` to compute the total revenue. Then extend it to group orders by product and compute per-product totals.

### 2. `find()` vs `filter()` Performance

**Question:**
You have an array of 100,000 records and need to find a single user by ID. Your colleague uses `.filter(u => u.id === targetId)[0]`. Why is this inefficient? What should they use instead?

### 3. Removing Duplicates

**Question:**
You receive an array of tag strings from an API that contains duplicates. What are the trade-offs between using `Set`, `filter()` with `indexOf`, and `reduce()` for deduplication? Which is fastest for large arrays?

### 4. Immutable Array Operations

**Question:**
In a React application, you need to add, remove, and update items in an array stored in state without mutating the original. Show the immutable pattern for each operation.

---

## 🔴 Advanced

### 1. Custom Sort Stability

**Question:**
You need to sort a large array of objects by `priority` (number) and then by `createdAt` (Date) for equal priorities. Is `Array.sort()` stable in all engines? How do you ensure a stable sort? What is the time complexity?

### 2. Lazy Evaluation with Generators

**Question:**
You have a pipeline of `.filter().map().filter()` on a 1M element array but only need the first 10 results. How would you use a generator-based approach to avoid processing all 1M elements?

### 3. Typed Arrays & Performance

**Question:**
You're building a real-time audio processing feature. Why would you use `Float32Array` instead of a regular array? What are the performance and memory differences?
