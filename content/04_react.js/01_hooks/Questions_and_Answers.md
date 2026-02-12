# React Hooks

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. `useState` & `useEffect`

**Question:**
How do `useState` and `useEffect` work?

**Answer:**

```jsx
function Counter() {
  const [count, setCount] = useState(0); // Declare state

  useEffect(() => {
    document.title = `Count: ${count}`; // Side effect

    return () => {
      // Cleanup (runs before re-running or unmount)
    };
  }, [count]); // Only re-run when count changes

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

**Dependency array mental model:**

| Deps     | When it runs                              |
| -------- | ----------------------------------------- |
| `[]`     | Once on mount                             |
| `[a, b]` | When `a` or `b` changes (shallow compare) |
| No array | Every render (usually a mistake)          |

**Common mistake:** Using `setCount(count + 1)` instead of `setCount(c => c + 1)`. The functional form always uses the latest state.

---

### 2. Rules of Hooks

**Question:**
Why do rules of hooks exist?

**Answer:**
React tracks hooks by **call order** — it relies on hooks being called in the same order every render.

**Rules:**

1. Only call hooks at the **top level** (not inside conditions, loops, nested functions).
2. Only call hooks from **React function components** or **custom hooks**.

```jsx
// ❌ WRONG — conditional hook
function Bad({ showName }) {
  if (showName) {
    const [name, setName] = useState(""); // Hook order changes!
  }
  const [age, setAge] = useState(0);
}

// ✅ CORRECT — always call, conditionally use
function Good({ showName }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  // Use `name` conditionally in the render, not the hook call
}
```

---

## 🟡 Intermediate

### 1. `useRef` vs `useState`

**Question:**
Three use cases for `useRef` beyond DOM references.

**Answer:**

```jsx
// 1. Storing previous values
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}

// 2. Instance variables (persist across renders without re-rendering)
function Timer() {
  const intervalId = useRef(null);
  const start = () => { intervalId.current = setInterval(...) };
  const stop = () => clearInterval(intervalId.current);
}

// 3. Tracking if component is mounted
function useIsMounted() {
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  return mounted;
}
```

| Feature                 | `useState`   | `useRef`                         |
| ----------------------- | ------------ | -------------------------------- |
| Triggers re-render      | ✅           | ❌                               |
| Persists across renders | ✅           | ✅                               |
| Synchronous access      | ❌ (batched) | ✅ (`.current`)                  |
| Best for                | UI state     | Mutable values, DOM refs, timers |

---

### 2. `useMemo` & `useCallback`

**Question:**
When these hooks are actually needed.

**Answer:**

**Premature optimization costs:**

- Extra memory for cached values.
- Extra dependency array tracking.
- Cognitive overhead reading the code.

**When genuinely needed:**

```jsx
// ✅ Expensive computation
const sorted = useMemo(() => {
  return items.sort((a, b) => complexSort(a, b)); // O(n log n)
}, [items]);

// ✅ Stable reference for child memoization
const MemoChild = React.memo(ChildComponent);
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
<MemoChild onClick={handleClick} />;

// ✅ Dependency of another hook
const filter = useCallback((item) => item.active, []);
useEffect(() => {
  const results = data.filter(filter);
}, [data, filter]);
```

**Rule:** Don't optimize until you measure. Use React DevTools Profiler to identify actual bottlenecks.

---

### 3. Custom Hooks

**Question:**
Design a `useDebounce` hook.

**Answer:**

```jsx
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cleanup on value/delay change
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]); // Only fetches after 500ms of no typing
}
```

**Good custom hook traits:**

- Starts with `use`.
- Encapsulates a single concern.
- Returns minimal, well-named values.
- Is testable in isolation (with `renderHook` from Testing Library).

---

## 🔴 Advanced

### 1. `useReducer` vs `useState`

**Question:**
Complex form state with `useReducer`.

**Answer:**

```jsx
const initialState = {
  values: {},
  errors: {},
  touched: {},
  isSubmitting: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        touched: { ...state.touched, [action.field]: true },
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case "SUBMIT":
      return { ...state, isSubmitting: true };
    case "SUBMIT_SUCCESS":
      return { ...initialState };
    case "SUBMIT_ERROR":
      return { ...state, isSubmitting: false, errors: action.errors };
    default:
      return state;
  }
}

function useForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const setField = (field, value) =>
    dispatch({ type: "SET_FIELD", field, value });
  return { ...state, setField, dispatch };
}
```

**Use `useReducer` when:** State transitions are complex, states are interdependent, or you want testable state logic outside components.

---

### 2. `useSyncExternalStore`

**Question:**
What it solves and when you need it.

**Answer:**

```jsx
import { useSyncExternalStore } from "react";

// Subscribe to browser online/offline status
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("online", callback);
      window.addEventListener("offline", callback);
      return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
      };
    },
    () => navigator.onLine, // Client snapshot
    () => true, // Server snapshot (SSR)
  );
}
```

**"Tearing":** In concurrent rendering, React may pause mid-render. If you read from a mutable external source (like a global store), different parts of the UI may see different values. `useSyncExternalStore` prevents this by ensuring consistent snapshots.

---

### 3. The `use` Hook (React 19)

**Question:**
New `use()` hook.

**Answer:**

```jsx
// use() with Promises — replaces useEffect for data fetching
function UserProfile({ userPromise }) {
  const user = use(userPromise); // Suspends until resolved
  return <h1>{user.name}</h1>;
}

// use() with Context — can be called conditionally!
function Theme({ showTheme }) {
  if (showTheme) {
    const theme = use(ThemeContext); // ✅ Conditional — breaks rules for useContext
    return <div style={{ color: theme.color }}>Themed</div>;
  }
  return <div>No theme</div>;
}
```

**Key differences:**

- `use()` can be called inside conditions and loops (unlike `useContext`).
- `use()` with Promises integrates with Suspense (`<Suspense fallback={...}>`).
- Replaces many `useEffect` data-fetching patterns with a simpler model.
