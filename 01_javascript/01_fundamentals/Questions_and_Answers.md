# Fundamentals - Questions and Answers

1. **What are the different data types in JavaScript?**

   JavaScript has 8 basic data types:
   - **Primitive Types**:
     - `string`: Used for text.
     - `number`: Used for both integer and floating-point numbers.
     - `bigint`: For integers with arbitrary precision.
     - `boolean`: `true` or `false`.
     - `undefined`: A variable that has not been assigned a value.
     - `null`: Represents the intentional absence of any object value.
     - `symbol`: A unique and immutable value used as object property keys.
   - **Reference Types**:
     - `object`: Used for more complex data structures (including arrays, functions, and plain objects).

---

2. **Explain the difference between `var`, `let`, and `const`.**
   - `var`:
     - Scope: Function-scoped.
     - Hoisting: Hoisted to the top of its scope and initialized with `undefined`.
     - Re-declaration: Can be re-declared within the same scope.
   - `let`:
     - Scope: Block-scoped `{}`.
     - Hoisting: Hoisted but not initialized (exists in Temporal Dead Zone).
     - Re-declaration: Cannot be re-declared in the same scope.
   - `const`:
     - Scope: Block-scoped.
     - Hoisting: Like `let`, exists in TDZ.
     - Initialization: Must be initialized during declaration.
     - Re-assignment: Cannot be re-assigned, but properties of objects assigned to `const` can be modified.

---

3. **What is hoisting in JavaScript?**

   Hoisting is a JavaScript mechanism where variables and function declarations are moved to the top of their containing scope during the compile phase.
   - **Function declarations** are fully hoisted, meaning you can call them before they are defined.
   - **`var`** is hoisted and initialized with `undefined`.
   - **`let` and `const`** are hoisted but not initialized, resulting in a ReferenceError if accessed before declaration (Temporal Dead Zone).

---

4. **Explain the concept of scope (global, function, block).**
   - **Global Scope**: Variables declared outside any function or block. They are accessible everywhere in the script.
   - **Function Scope**: Variables declared inside a function (using `var`, `let`, or `const`) are only accessible within that function.
   - **Block Scope**: Variables declared with `let` or `const` inside a block `{}` are only accessible within that block. `var` does not respect block scope (except for functions).

---

5. **What is the Temporal Dead Zone (TDZ)?**

   The TDZ is the period between the start of a block's execution and the time a variable declared with `let` or `const` is initialized. During this time, accessing the variable throws a `ReferenceError`. This encouraged better coding practices by ensuring variables are declared before use.

---

6. **What is the difference between `==` and `===`?**
   - `==` (**Abstract Equality**): Compares two values for equality after performing type coercion if they are of different types.
   - `===` (**Strict Equality**): Compares both the value and the type. No type coercion is performed. If types are different, it returns `false`.

---

7. **Explain type coercion in JavaScript.**

   Type coercion is the automatic or implicit conversion of values from one data type to another (e.g., from string to number).
   - **Implicit Coercion**: Occurs when JS automatically converts types (e.g., `5 + '5' = '55'`).
   - **Explicit Coercion**: Occurs when the developer manually converts types (e.g., `Number('5')`).

---

8. **What are truthy and falsy values?**
   - **Falsy Values**: Values that evaluate to `false` in a boolean context. There are exactly 8: `false`, `0`, `-0`, `0n` (BigInt zero), `""` (empty string), `null`, `undefined`, and `NaN`.
   - **Truthy Values**: All values that are not falsy are truthy (e.g., `'0'`, `'false'`, `[]`, `{}`, and any non-zero number).
