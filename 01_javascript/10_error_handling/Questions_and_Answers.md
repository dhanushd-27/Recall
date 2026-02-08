# Error Handling - Questions and Answers

1. **Explain `try...catch...finally`.**
   - **`try` block**: Contains the code that may potentially throw an error.
   - **`catch` block**: Executed if an error occurs in the `try` block. It receives the error object as an argument.
   - **`finally` block**: Contains code that will execute regardless of whether an error was thrown or caught. This is useful for cleanup operations (e.g., closing file streams or network connections).

---

2. **What are custom errors?**

   Custom errors are developer-defined error types that extend the built-in `Error` class. They allow you to provide more specific error names and additional properties, making it easier to handle specific failure cases in your application.

   ```javascript
   class MyCustomError extends Error {
     constructor(message) {
       super(message);
       this.name = "MyCustomError";
     }
   }
   ```

---

3. **What is the difference between throw and return?**
   - **`throw`**: Used to signal an exceptional condition (an error). It stops the normal flow of the function and searches for the nearest `try...catch` block to handle the error.
   - **`return`**: Used to exit a function normally and optionally provide a value back to the caller. It does not trigger error-handling mechanisms.
