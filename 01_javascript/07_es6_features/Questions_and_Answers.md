# ES6+ Features - Questions and Answers

1. **Explain spread and rest operators.**

   Both use the `...` syntax but serve different purposes:
   - **Spread Operator**: "Expands" an iterable (like an array or object) into individual elements. Used for copying, merging, or passing elements as arguments.
     ```javascript
     const arr2 = [...arr1, 4, 5];
     ```
   - **Rest Operator**: "Collects" multiple elements into a single array. Used in function parameters or destructuring to capture "the rest" of the elements.
     ```javascript
     function sum(...numbers) {
       /* numbers is an array */
     }
     ```

---

2. **What are template literals?**

   Template literals are string literals allowing embedded expressions. You can use multi-line strings and string interpolation features with them. They are enclosed by backticks (`` ` ``) instead of double or single quotes.

   ```javascript
   const greeting = `Hello, ${name}!`;
   ```

---

3. **Explain destructuring (arrays and objects).**

   Destructuring is a syntax that allows you to "unpack" values from arrays or properties from objects into distinct variables.
   - **Array Destructuring**: `const [a, b] = [1, 2];`
   - **Object Destructuring**: `const { name, age } = person;`

---

4. **What are default parameters?**

   Default parameters allow named parameters to be initialized with default values if no value or `undefined` is passed to the function.

   ```javascript
   function greet(name = "Guest") {
     console.log(`Hello ${name}`);
   }
   ```

---

5. **Explain `Map` and `Set` data structures.**
   - **`Map`**: A collection of keyed data items, similar to an Object. But the main difference is that `Map` allows keys of any type (not just strings/symbols) and maintains the insertion order of elements.
   - **`Set`**: A collection of unique values. Any value can only occur once in a `Set`. It's often used to remove duplicates from arrays.

---

6. **What are Symbols and when would you use them?**

   A `Symbol` is a primitive data type that is unique and immutable. They are often used as unique property keys for objects to prevent name collisions, especially when adding properties to objects from external libraries or for internal "hidden" properties.

---

7. **Explain generators and iterators.**
   - **Iterators**: Objects that define a sequence and potentially a return value upon its termination. They must implement a `next()` method.
   - **Generators**: Functions that can be paused and resumed using the `yield` keyword. Calling a generator function returns a Generator object, which conforms to both the iterable and iterator protocols.

---

8. **What are Proxy and Reflect?**
   - **`Proxy`**: An object that wraps another object and allows you to intercept and redefine fundamental operations for that object (like getting/setting properties).
   - **`Reflect`**: A built-in object that provides methods for interceptable JavaScript operations. It's often used within Proxy traps to perform the default behavior of the intercepted operation.
