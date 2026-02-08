# Arrays - Questions and Answers

1. **What are the different ways to iterate over an array?**
   - **`for` loop**: The traditional way to iterate using an index.
   - **`for...of` loop**: Introduced in ES6, iterates over the values of an iterable.
   - **`forEach()`**: A method that executes a provided function once for each array element.
   - **`map()`**: Creates a new array with the results of calling a function on every element.
   - **`for...in` loop**: Iterates over the enumerable properties (indices) of an array (not recommended for arrays as order is not guaranteed).

---

2. **Explain `map()`, `filter()`, `reduce()`, and `forEach()`.**
   - **`map()`**: Returns a new array by applying a function to each element. It doesn't change the original array.
   - **`filter()`**: Returns a new array containing only the elements that pass a test (provided as a function).
   - **`reduce()`**: Executes a reducer function on each element, resulting in a single output value (e.g., sum of numbers).
   - **`forEach()`**: Executes a provided function once for each array element. It returns `undefined`.

---

3. **What is the difference between `slice()` and `splice()`?**
   - **`slice(start, end)`**: Returns a shallow copy of a portion of an array into a new array object. It **does not modify** the original array.
   - **`splice(start, deleteCount, item1, ...)`**: Changes the contents of an array by removing or replacing existing elements and/or adding new elements. It **modifies** the original array.

---

4. **How do you remove duplicates from an array?**
   - **Using `Set`**: `const unique = [...new Set(arr)];`
   - **Using `filter()`**: `const unique = arr.filter((item, index) => arr.indexOf(item) === index);`
   - **Using `reduce()`**: `const unique = arr.reduce((acc, current) => acc.includes(current) ? acc : [...acc, current], []);`

---

5. **Explain `find()` vs `filter()`.**
   - **`find()`**: Returns the **first element** in the array that satisfies the provided testing function. If no elements satisfy the testing function, `undefined` is returned.
   - **`filter()`**: Returns a **new array** with all elements that satisfy the testing function. If no elements satisfy the testing function, an empty array is returned.

---

6. **What is array destructuring?**

   Array destructuring is a JavaScript expression that makes it possible to unpack values from arrays, or properties from objects, into distinct variables.

   ```javascript
   const [a, b] = [1, 2];
   // a = 1, b = 2
   ```
