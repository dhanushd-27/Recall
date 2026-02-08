# Closures & Scope - Questions and Answers

1. **What is a closure? Give a practical example.**

   A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function.
   - **Example**:
     ```javascript
     function makeCounter() {
       let count = 0;
       return function () {
         return count++;
       };
     }
     const counter = makeCounter();
     console.log(counter()); // 0
     console.log(counter()); // 1
     ```

---

2. **How do closures help in data privacy?**

   Closures can be used to emulate private variables by wrapping them in a function scope. The outer function's variables are not accessible from the outside, but they remain available to the inner functions (the closures). This is the basis for the module pattern and other encapsulation techniques.

---

3. **Explain lexical scoping.**

   Lexical scoping (or static scoping) means that the scope of a variable is determined by its position within the source code. Nested functions have access to variables declared in their outer scope. JavaScript uses lexical scoping, meaning the engine looks at where functions were defined to determine which variables are available.

---

4. **What is the module pattern?**

   The module pattern is a design pattern used to wrap a set of variables and functions into a single object, exposing only the necessary parts while keeping the rest private. It typically uses an IIFE and closures to achieve this.

   ```javascript
   const myModule = (function () {
     let privateVar = "I am private";
     function privateMethod() {
       console.log(privateVar);
     }
     return {
       publicMethod: function () {
         privateMethod();
       },
     };
   })();
   ```
