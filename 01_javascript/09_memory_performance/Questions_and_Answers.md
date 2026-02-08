# Memory & Performance - Questions and Answers

1. **What is garbage collection in JavaScript?**

   Garbage collection is an automatic memory management process that identifies and reclaims memory that is no longer being used by the application. JavaScript primarily uses the **Mark-and-Sweep algorithm**, which starts from a set of "roots" (like the global object) and marks all reachable objects. Any objects not marked as reachable are considered "garbage" and their memory is freed.

---

2. **What are memory leaks and how do you prevent them?**

   A memory leak occurs when an application unintentionally retains references to objects that are no longer needed, preventing the garbage collector from reclaiming their memory.
   - **Prevention**:
     - Remove event listeners when they are no longer needed.
     - Clear `setTimeout` and `setInterval` when done.
     - Avoid global variables.
     - Use `WeakMap` or `WeakSet` for object references that shouldn't prevent garbage collection.

---

3. **Explain debouncing and throttling.**

   Both are techniques used to limit how many times a function is executed over time.
   - **Debouncing**: Ensures that a function is only executed after a certain amount of time has passed since it was last invoked. Useful for search bar inputs or window resizing.
   - **Throttling**: Ensures that a function is executed at most once in a specified time interval. Useful for scroll events or mouse movements.

---

4. **What is memoization?**

   Memoization is an optimization technique where you store the results of expensive function calls and return the cached result when the same inputs occur again. This avoids redundant computations and improves performance for pure functions with repetitive inputs.
