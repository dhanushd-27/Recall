# Asynchronous JavaScript - Questions and Answers

1. **What is the event loop?**

   The event loop is a constant process that monitors both the Callback Queue and the Call Stack. If the Call Stack is empty, the event loop takes the first event from the queue and pushes it onto the stack, which effectively runs it. This is how JavaScript can be non-blocking and manage asynchronous operations despite being single-threaded.

---

2. **Explain the call stack and callback queue.**
   - **Call Stack**: A LIFO (Last In, First Out) data structure that keeps track of the function calls. When a function is called, it's pushed onto the stack. When it returns, it's popped off.
   - **Callback Queue** (or Task Queue): A FIFO (First In, First Out) data structure where callbacks from asynchronous operations (like `setTimeout`, DOM events) wait to be executed once the call stack is empty.

---

3. **What are Promises? Explain their states.**

   A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. It has three states:
   - **Pending**: Initial state, neither fulfilled nor rejected.
   - **Fulfilled**: The operation completed successfully.
   - **Rejected**: The operation failed.

---

4. **What is Promise chaining?**

   Promise chaining is a technique where multiple asynchronous operations are performed in sequence by returning a new promise from a `.then()` handler. This avoids "callback hell" and makes the code more readable.

---

5. **Explain `async/await` syntax.**

   Introduced in ES2017, `async/await` is syntactic sugar built on top of Promises.
   - `async` keyword: Makes a function return a promise and allows the use of `await` inside it.
   - `await` keyword: Pauses the execution of the async function until the promise is settled (fulfilled or rejected), and then returns the fulfilled value.

---

6. **What is the difference between `Promise.all()`, `Promise.race()`, `Promise.allSettled()`, and `Promise.any()`?**
   - **`Promise.all([p1, p2, ...])`**: Fulfills when **all** promises fulfill; rejects if **any** promise rejects.
   - **`Promise.race([p1, p2, ...])`**: Settles as soon as the **first** promise settles (either fulfills or rejects).
   - **`Promise.allSettled([p1, p2, ...])`**: Fulfills after **all** promises have settled, regardless of whether they were fulfilled or rejected.
   - **`Promise.any([p1, p2, ...])`**: Fulfills as soon as **any** of the promises fulfills; rejects only if **all** promises reject.

---

7. **How do you handle errors in Promises and async/await?**
   - **Promises**: Use the `.catch()` method at the end of the chain or as the second argument to `.then()`.
   - **async/await**: Use `try...catch` blocks around the `await` expressions.

---

8. **What are microtasks and macrotasks?**
   - **Microtasks**: Tasks with higher priority, such as Promise callbacks (`.then`, `.catch`, `.finally`) and `process.nextTick` (in Node.js). They are executed immediately after the current task and before the next macrotask.
   - **Macrotasks** (or Tasks): Standard tasks like `setTimeout`, `setInterval`, `setImmediate`, I/O, and UI rendering.
