# Miscellaneous - Questions and Answers

1. **What is `"use strict"` mode?**

   `"use strict"` is a directive introduced in ES5 that enables strict mode in a script or a function.
   - **Main Effects**:
     - Prevents the use of undeclared variables (prevents creation of global variables by mistake).
     - Turns "silent errors" into actual errors (e.g., assignment to a non-writable property).
     - Simplifies variable names and prevents some insecure actions.
     - `this` in global functions is `undefined` instead of the global object.

---

2. **Explain `null` vs `undefined`.**
   - **`undefined`**: A default value assigned to variables that have been declared but not yet initialized. It's a type itself.
   - **`null`**: An intentional assignment representing "no value" or "empty". It's an object (due to a historical bug in JS).

---

3. **What is `NaN` and how do you check for it?**

   `NaN` (Not-a-Number) is a special value that results from an invalid mathematical operation (e.g., `0 / 0`).
   - **Checking**: Use `Number.isNaN()` which is more reliable than the global `isNaN()` because it only returns `true` if the value is actually `NaN`. `NaN` is also the only value in JS that is not equal to itself (`NaN === NaN` is `false`).

---

4. **What is the difference between shallow copy and deep copy?**
   - **Shallow Copy**: Copies only the top-level properties of an object. Nested objects or arrays are still referenced (shared between the copy and the original).
   - **Deep Copy**: Recursively copies all properties and nested objects, ensuring that the new object is entirely independent of the original.

---

5. **Explain `JSON.stringify()` and `JSON.parse()`.**
   - **`JSON.stringify(obj)`**: Converts a JavaScript object or value to a JSON string.
   - **`JSON.parse(str)`**: Parses a JSON string and constructs the JavaScript value or object described by the string.

---

6. **What are Web APIs?**

   Web APIs are built-in interfaces provided by the browser that extend the functionality of JavaScript beyond the core ECMAScript specification. Examples include the DOM API, Fetch API, Geolocation API, and Web Storage API.

---

7. **Explain localStorage, sessionStorage, and cookies.**
   - **`localStorage`**: Stores data with no expiration date. Data persists even after the browser is closed. Capacity is typically around 5-10MB.
   - **`sessionStorage`**: Similar to `localStorage`, but data is cleared when the page session ends (when the tab is closed).
   - **`cookies`**: Small pieces of data (up to 4KB) sent between the server and client. They can have expiration dates and are often used for session management and tracking.

---

8. **What is the Same-Origin Policy?**

   The Same-Origin Policy (SOP) is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin. Two URLs have the same origin if they have the same protocol, host, and port.

---

9. **Explain CORS (Cross-Origin Resource Sharing).**

   CORS is a mechanism that uses additional HTTP headers to tell browsers to give a web application running at one origin permission to access selected resources from a different origin. It "relaxes" the Same-Origin Policy in a controlled way.
