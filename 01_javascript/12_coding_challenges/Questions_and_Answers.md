# Coding Challenges - Questions and Answers

1. **Implement a debounce function.**

   ```javascript
   function debounce(func, delay) {
     let timeoutId;
     return function (...args) {
       clearTimeout(timeoutId);
       timeoutId = setTimeout(() => {
         func.apply(this, args);
       }, delay);
     };
   }
   ```

---

2. **Implement a throttle function.**

   ```javascript
   function throttle(func, limit) {
     let inThrottle;
     return function (...args) {
       if (!inThrottle) {
         func.apply(this, args);
         inThrottle = true;
         setTimeout(() => (inThrottle = false), limit);
       }
     };
   }
   ```

---

3. **Write a function to flatten a nested array.**

   ```javascript
   function flatten(arr) {
     return arr.reduce(
       (acc, val) =>
         Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val),
       [],
     );
   }
   // Using recursion. ES6 Alternative: arr.flat(Infinity)
   ```

---

4. **Implement `Promise.all()` from scratch.**

   ```javascript
   function promiseAll(promises) {
     return new Promise((resolve, reject) => {
       let results = [];
       let completed = 0;
       if (promises.length === 0) resolve(results);

       promises.forEach((p, i) => {
         Promise.resolve(p)
           .then((val) => {
             results[i] = val;
             completed++;
             if (completed === promises.length) resolve(results);
           })
           .catch(reject);
       });
     });
   }
   ```

---

5. **Write a function to deep clone an object.**

   ```javascript
   function deepClone(obj) {
     if (obj === null || typeof obj !== "object") return obj;
     let copy = Array.isArray(obj) ? [] : {};
     for (let key in obj) {
       if (obj.hasOwnProperty(key)) {
         copy[key] = deepClone(obj[key]);
       }
     }
     return copy;
   }
   // Note: Does not handle Dates, RegEx, or Circular References.
   ```

---

6. **Implement a simple pub/sub pattern.**

   ```javascript
   const pubSub = {
     events: {},
     subscribe(event, callback) {
       if (!this.events[event]) this.events[event] = [];
       this.events[event].push(callback);
     },
     publish(event, data) {
       if (this.events[event]) {
         this.events[event].forEach((callback) => callback(data));
       }
     },
   };
   ```

---

7. **Write a function to check if two objects are deeply equal.**

   ```javascript
   function deepEqual(obj1, obj2) {
     if (obj1 === obj2) return true;
     if (
       typeof obj1 !== "object" ||
       obj1 === null ||
       typeof obj2 !== "object" ||
       obj2 === null
     )
       return false;

     let keys1 = Object.keys(obj1);
     let keys2 = Object.keys(obj2);
     if (keys1.length !== keys2.length) return false;

     for (let key of keys1) {
       if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key]))
         return false;
     }
     return true;
   }
   ```

---

8. **Implement `Function.prototype.bind` from scratch.**

   ```javascript
   Function.prototype.myBind = function (context, ...args) {
     const fn = this;
     return function (...newArgs) {
       return fn.apply(context, [...args, ...newArgs]);
     };
   };
   ```

---

9. **Write a memoization function.**

   ```javascript
   function memoize(fn) {
     const cache = {};
     return function (...args) {
       const key = JSON.stringify(args);
       if (key in cache) return cache[key];
       const result = fn.apply(this, args);
       cache[key] = result;
       return result;
     };
   }
   ```

---

10. **Implement a simple event emitter class.**

    ```javascript
    class EventEmitter {
      constructor() {
        this.events = {};
      }
      on(event, listener) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
      }
      emit(event, ...args) {
        if (this.events[event]) {
          this.events[event].forEach((listener) => listener(...args));
        }
      }
      off(event, listener) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter((l) => l !== listener);
      }
    }
    ```
