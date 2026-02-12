# State Management

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Lifting State Up

**Question:**
Share state between siblings.

**Answer:**

```jsx
// Parent owns the shared state
function Parent() {
  const [selectedId, setSelectedId] = useState(null);
  return (
    <>
      <Sidebar items={items} onSelect={setSelectedId} />
      <Detail itemId={selectedId} />
    </>
  );
}
```

**Try this first** before global state. Most "state sharing" problems are actually "state placement" problems — move state to the nearest common ancestor.

---

### 2. Context API

**Question:**
When to use Context.

**Answer:**

```jsx
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

function Button() {
  const { theme } = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

**Context is good for:** Theme, locale, auth status — data that changes infrequently and is needed by many components.

**Context is NOT good for:** Frequently changing data (causes re-renders of all consumers), complex state logic.

---

## 🟡 Intermediate

### 1. Context Performance

**Question:**
Fix re-rendering from a large Context.

**Answer:**

```jsx
// ❌ Everything in one context — all consumers re-render
const AppContext = createContext({ user, theme, cart, notifications });

// ✅ Split into focused contexts
const UserContext = createContext(null);
const ThemeContext = createContext("light");
const CartContext = createContext({ items: [] });

// ✅ Memoize context values
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
```

---

### 2. Zustand vs Redux vs Jotai

**Question:**
Compare modern state libraries.

**Answer:**

```jsx
// Zustand — minimal, hook-based
const useStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));
function Counter() {
  const count = useStore((s) => s.count); // Auto-selector = minimal re-renders
}
```

| Feature        | Zustand   | Redux Toolkit              | Jotai                       |
| -------------- | --------- | -------------------------- | --------------------------- |
| Boilerplate    | Minimal   | Medium                     | Minimal                     |
| Bundle size    | ~1KB      | ~12KB                      | ~3KB                        |
| DevTools       | ✅        | ✅ (best)                  | ✅                          |
| Async          | Built-in  | RTK Query                  | Suspense                    |
| Learning curve | Low       | Medium                     | Low                         |
| Best for       | Most apps | Large teams, complex state | Atomic state, React-centric |

---

## 🔴 Advanced

### 1. Server State with TanStack Query

**Question:**
How TanStack Query changes state management.

**Answer:**

```jsx
function UserProfile({ id }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetch(`/api/users/${id}`).then((r) => r.json()),
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <h1>{data.name}</h1>;
}
```

**Key insight:** ~80% of app state is actually **server state** (data from APIs). TanStack Query handles caching, deduplication, background refetching, and optimistic updates — eliminating the need for Redux/Zustand for server data.

| Feature              | Manual `useEffect` | TanStack Query |
| -------------------- | ------------------ | -------------- |
| Caching              | DIY                | Automatic      |
| Deduplication        | DIY                | Automatic      |
| Background refresh   | DIY                | Built-in       |
| Loading/error states | Manual booleans    | Declarative    |
| Optimistic updates   | Complex            | One function   |

---

### 2. State Machines with XState

**Question:**
When state machines beat useState.

**Answer:**

```jsx
import { createMachine, assign } from "xstate";

const checkoutMachine = createMachine({
  id: "checkout",
  initial: "cart",
  context: { items: [], error: null },
  states: {
    cart: { on: { PROCEED: "shipping" } },
    shipping: {
      on: {
        BACK: "cart",
        SUBMIT_ADDRESS: { target: "payment", guard: "isAddressValid" },
      },
    },
    payment: {
      on: {
        BACK: "shipping",
        PAY: "processing",
      },
    },
    processing: {
      invoke: {
        src: "processPayment",
        onDone: "success",
        onError: {
          target: "payment",
          actions: assign({ error: (_, e) => e.data }),
        },
      },
    },
    success: { type: "final" },
  },
});
```

**Use state machines when:** You have many states with defined transitions, need to prevent impossible states, or have complex async flows with error recovery.
