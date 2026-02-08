# Performance - Questions and Answers

1. **What is the Virtual DOM and how does reconciliation work?**

   The Virtual DOM is a lightweight copy of the real DOM. When state changes, React creates a new Virtual DOM tree and compares it with the previous one (a process called **diffing** or **reconciliation**). It then calculates the minimum number of changes needed to update the real DOM, making UI updates highly efficient.

---

2. **How does `React.memo` help in optimizing performance?**

   `React.memo` is a higher-order component that memoizes a functional component. It prevents a component from re-rendering if its props haven't changed. This is particularly useful for expensive components in large lists.

---

3. **What causes unnecessary re-renders in React and how do you prevent them?**
   - **Causes**: Passing new object/array literals as props, unstable function references, or unnecessarily frequent state updates.
   - **Prevention**: Use `useMemo` for objects/arrays, `useCallback` for functions, and ensure proper component structure so only the necessary parts of the tree re-render.

---

4. **Explain "Code Splitting" and `React.lazy`.**

   Code splitting allows you to split your application into smaller bundles that are loaded only when they are needed. `React.lazy` is used to define components that are loaded dynamically, often used in combination with `Suspense` and routing.

---

5. **How can you use the Profiler API to measure performance?**

   The Profiler measures how often a React application renders and the "cost" of rendering. It identifies parts of an application that are slow and may benefit from optimizations like memoization. You can use the `Profiler` component or the React DevTools Profiler tab.
