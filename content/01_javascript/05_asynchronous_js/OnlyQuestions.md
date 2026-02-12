# JavaScript Asynchronous

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. The Event Loop (High Level)

**Question:**
In simple terms, how does JavaScript handle asynchronous operations (like fetching data) if it is single-threaded?

### 2. Promises vs Callbacks

**Question:**
Why do we prefer Promises (and async/await) over callbacks? What problem do callbacks cause at scale?

---

## 🟡 Intermediate

### 1. Async/Await & Error Handling

**Question:**
Refactor the following code to use `async/await`. Ensure you properly handle errors — what are the trade-offs between `try/catch` and `.catch()` patterns?

```javascript
function getUserData(id) {
  return fetch(`/api/user/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Fetch failed");
      return res.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
}
```

### 2. Promise Combinators

**Question:**
You need to fetch data from 3 different APIs simultaneously. Compare `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, and `Promise.any()`. For each, describe a real-world scenario where it's the right choice.

### 3. Sequential vs Parallel Execution

**Question:**
A developer writes this code to fetch 5 users. Why is it slow? Refactor it to be faster while maintaining error handling.

```javascript
async function getUsers(ids) {
  const users = [];
  for (const id of ids) {
    const user = await fetchUser(id);
    users.push(user);
  }
  return users;
}
```

---

## 🔴 Advanced

### 1. Event Loop Internals (Microtasks vs Macrotasks)

**Question:**
What is the order of execution for the following code? Explain the microtask queue vs macrotask queue.

```javascript
console.log("Start");

setTimeout(() => console.log("Timeout"), 0);

Promise.resolve()
  .then(() => console.log("Promise 1"))
  .then(() => console.log("Promise 2"));

queueMicrotask(() => console.log("Microtask"));

console.log("End");
```

### 2. Implementing `Promise.all()` from Scratch

**Question:**
Implement `Promise.all` from scratch. Handle edge cases: empty arrays, non-promise values in the array, and rejection short-circuiting.

### 3. Async Generators & Streaming

**Question:**
You need to iterate over a paginated API that returns pages of data. Implement an async generator that fetches page-by-page using `for await...of`. How does this compare to fetching all pages upfront?

### 4. AbortController for Request Cancellation

**Question:**
A user navigates away from a page while 5 API requests are in-flight. How do you cancel them using `AbortController`? What happens to in-flight `fetch` requests when you call `abort()`?
