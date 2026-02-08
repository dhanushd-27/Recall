# Hooks - Questions and Answers

1. **What are the rules of Hooks?**
   - **Only call Hooks at the top level**: Don't call Hooks inside loops, conditions, or nested functions.
   - **Only call Hooks from React functions**: Call them from React functional components or custom Hooks, not regular JavaScript functions.

---

2. **Explain `useState` and how it works.**

   `useState` is a Hook that allows you to add state to functional components. It returns an array with two elements: the current state value and a function to update it. React preserves this state between re-renders. When the setter function is called, React schedules a re-render of the component.

---

3. **How does `useEffect` handle lifecycle events (mount, update, unmount)?**
   - **Mounting**: Runs after the first render if the dependency array is empty `[]`.
   - **Updating**: Runs after every render if no dependency array is provided, or when specific dependencies change.
   - **Unmounting**: Runs the cleanup function (the function returned by the effect) before the component is removed from the UI.

---

4. **What is the difference between `useMemo` and `useCallback`?**
   - **`useMemo`**: Memoizes the **result** of a calculation. Use it to avoid expensive recalculations on every render.
   - **`useCallback`**: Memoizes the **function definition** itself. Use it to prevent unnecessary re-renders of child components that depend on stable function references (when used with `React.memo`).

---

5. **When would you use `useRef` and how does it differ from a regular variable?**

   `useRef` returns a mutable ref object whose `.current` property is persisted across renders.
   - **Difference from state**: Updating a ref does **not** trigger a re-render.
   - **Difference from regular variable**: A regular variable inside a component is reset on every render, while a ref persists.

---

6. **How do you create a custom Hook?**

   A custom Hook is a JavaScript function whose name starts with `use` and that may call other Hooks. It allows you to extract component logic into reusable functions.
