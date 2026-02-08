# Functions - Questions and Answers

1. **What is the difference between function declarations and function expressions?**
   - **Function Declaration**: Defined with the `function` keyword followed by the name. They are fully hoisted, meaning they can be called before their definition in the code.
     ```javascript
     function greeted() {
       return "Hello!";
     }
     ```
   - **Function Expression**: A function is assigned to a variable. They are not hoisted in the same way; the variable name is hoisted (if using `var`), but the function assignment happens at runtime.
     ```javascript
     const greet = function () {
       return "Hello!";
     };
     ```

---

2. **Explain arrow functions and how they differ from regular functions.**

   Arrow functions (`() => {}`) were introduced in ES6 and have several key differences:
   - **`this` binding**: Arrow functions do not have their own `this`; they inherit `this` from the lexical scope.
   - **`arguments` object**: Arrow functions do not have an `arguments` object.
   - **Constructor**: Arrow functions cannot be used as constructors (cannot use `new`).
   - **Syntax**: More concise, and allows implicit returns for single-expression bodies.

---

3. **What are higher-order functions? Give examples.**

   A higher-order function is a function that either takes one or more functions as arguments or returns a function as its result.
   - **Examples**: `map()`, `filter()`, `reduce()`, `setTimeout()`, and custom functions that return other functions.

---

4. **Explain `call()`, `apply()`, and `bind()` methods.**
   - **`call()`**: Invokes a function with a given `this` value and arguments provided individually.
     ```javascript
     func.call(thisArg, arg1, arg2);
     ```
   - **`apply()`**: Invokes a function with a given `this` value and arguments provided as an array (or array-like object).
     ```javascript
     func.apply(thisArg, [arg1, arg2]);
     ```
   - **`bind()`**: Returns a new function with a fixed `this` value and initial arguments, without immediately invoking it.

---

5. **What is a callback function?**

   A callback function is a function passed as an argument to another function, which is then executed inside the outer function to complete some kind of routine or action. Callbacks are often used in asynchronous operations.

---

6. **What are pure functions?**

   A pure function is a function that:
   - Always returns the same output for the same input.
   - Has no side effects (does not modify external state, console logs, or perform I/O).

---

7. **Explain IIFE (Immediately Invoked Function Expression).**

   An IIFE is a function that runs as soon as it is defined. It's often used to create a private scope and avoid polluting the global namespace.

   ```javascript
   (function () {
     // code here
   })();
   ```

---

8. **What is function currying?**

   Currying is a transformation of functions that translates a function from callable as `f(a, b, c)` into callable as `f(a)(b)(c)`. It allows you to partially apply arguments and create specialized versions of a function.
