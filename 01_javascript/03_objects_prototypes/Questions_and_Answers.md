# Objects & Prototypes - Questions and Answers

1. **How do you create objects in JavaScript?**

   There are several ways:
   - **Object literal**: `const obj = { key: 'value' };`
   - **Constructor function**: `function Person() {}; const p = new Person();`
   - **ES6 Classes**: `class Person {}; const p = new Person();`
   - **`Object.create()`**: `const p = Object.create(prototypeObj);`
   - **`Object.assign()`**: `const p = Object.assign({}, sourceObj);`

---

2. **Explain prototypal inheritance.**

   JavaScript uses prototypes for inheritance. Every object has a private property (often referred to as `[[Prototype]]`) which holds a link to another object called its prototype. When you access a property that doesn't exist on an object, JavaScript searches for it in the prototype. This continues until the property is found or the end of the prototype chain is reached.

---

3. **What is the prototype chain?**

   The prototype chain is the series of links between objects and their prototypes. It starts from an object, goes to its prototype, then to that prototype's prototype, and so on, usually ending at `Object.prototype`, which has its prototype set to `null`.

---

4. **What is the difference between `Object.create()` and constructor functions?**
   - **`Object.create(proto)`**: Creates a new object with the specified prototype object and properties. It's a clean way to implement inheritance without using constructors.
   - **Constructor Functions**: Used with the `new` keyword. They set the prototype of the new object to the function's `prototype` property and then execute the function body with `this` bound to the new object.

---

5. **Explain `this` keyword in different contexts.**
   - **Global context**: `this` refers to the global object (`window` in browsers, `global` in Node.js).
   - **Function context**: In non-strict mode, `this` refers to the global object. In strict mode, it is `undefined`.
   - **Method context**: `this` refers to the object the method is called on.
   - **Arrow functions**: `this` is lexically inherited from the enclosing scope.
   - **Constructor context**: `this` refers to the newly created object.
   - **Explicit binding**: Using `call`, `apply`, or `bind`, you can set `this` manually.

---

6. **What are getters and setters?**

   Getters and setters are special methods that provide a way to define properties that are accessed like data properties but calculated using functions.
   - `get`: Used to retrieve the value.
   - `set`: Used to modify the value.

---

7. **How does `Object.freeze()` differ from `Object.seal()`?**
   - **`Object.freeze()`**: Makes an object completely immutable. You cannot add, delete, or modify existing properties.
   - **`Object.seal()`**: Prevents adding or deleting properties, but allows modifying existing ones if they are writable.
