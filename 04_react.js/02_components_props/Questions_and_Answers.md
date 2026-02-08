# Components & Props - Questions and Answers

1. **What is the difference between functional components and class components?**
   - **Functional Components**: Plain JavaScript functions that accept props and return JSX. They use Hooks for state and side effects. They are generally simpler and more concise.
   - **Class Components**: ES6 classes that extend `React.Component`. They use `this.state` and lifecycle methods (e.g., `componentDidMount`). They are considered legacy in modern React.

---

2. **How do you pass data between components (props)?**

   Data is passed from parent to child via attributes in JSX, called "props". Props are read-only (immutable) from the perspective of the child component.

---

3. **What is "lifting state up"?**

   When multiple components need to share the same state, you move that state to their closest common ancestor. The ancestor then passes the state down via props, along with functions to update it.

---

4. **Explain the `children` prop.**

   `children` is a special prop that allows you to pass components or elements as data to other components. It's used for composition, where a component acts as a wrapper (like a Layout or Modal).

---

5. **What are Higher-Order Components (HOCs) and are they still relevant?**

   An HOC is a function that takes a component and returns a new component with additional functionality. While still supported, they have mostly been replaced by custom Hooks and Render Props, which offer a more flexible and readable way to share logic.
