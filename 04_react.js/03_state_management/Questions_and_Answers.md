# State Management - Questions and Answers

1. **What is the difference between local state and global state?**
   - **Local State**: State that is managed within a single component (using `useState` or `useReducer`). It's only accessible to that component and its children (via props).
   - **Global State**: State that is accessible across many components in the application. It's used for data like user authentication, themes, or large shared data sets.

---

2. **Explain the Context API and its use cases.**

   The Context API provides a way to share data between components without having to explicitly pass props through every level of the tree (avoiding "prop drilling").
   - **Use Cases**: Theme data, user information, language settings, and small global states.

---

3. **How does React Redux work at a high level?**

   Redux follows a pattern of "one-way data flow":
   - **Store**: The single source of truth for state.
   - **Actions**: Plain objects that describe what happened.
   - **Reducers**: Functions that specify how the state changes in response to an action.
   - **Dispatch**: The method used to send an action to the store.

---

4. **What are the advantages of using specialized libraries like Zustand or TanStack Query (React Query)?**
   - **Zustand**: A small, fast, and scalable bear-necessity state management solution. It's much simpler than Redux and doesn't require complex boilerplate.
   - **TanStack Query**: Specifically designed for managing **server state** (data from APIs). It handles caching, synchronization, background updates, and loading/error states automatically.

---

5. **How do you handle complex state logic using `useReducer`?**

   `useReducer` is a Hook used when you have complex state transitions that depend on the previous state. It takes a reducer function and an initial state, returning the current state and a dispatch function. It's essentially "local Redux" and is often preferred over multiple `useState` calls for complex objects or arrays.
