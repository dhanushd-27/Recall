# Components & Props

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Functional Components

**Question:**
Why are functional components the standard?

**Answer:**

- **Simpler syntax** — plain functions, no `this`, no lifecycle method confusion.
- **Hooks** — `useState`, `useEffect` provide all class component capabilities.
- **Better optimization** — easier for React to optimize (no instance overhead).
- **Composable** — custom hooks enable code reuse without HOCs or render props.

```jsx
// Modern functional component
function UserCard({ name, role }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      <h2>{name}</h2>
      {isExpanded && <p>{role}</p>}
    </div>
  );
}
```

---

### 2. Props & Children

**Question:**
How props and `children` work.

**Answer:**

```jsx
// Props are read-only data passed from parent to child
function Greeting({ name, age }) {
  return (
    <p>
      Hello, {name}! You're {age}.
    </p>
  );
}
<Greeting name="Alice" age={30} />;

// children — special prop for nested content
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

<Card title="Profile">
  <p>This is the card body</p> {/* children */}
  <button>Click me</button> {/* children */}
</Card>;
```

---

## 🟡 Intermediate

### 1. Composition vs Inheritance

**Question:**
Build a component system using composition.

**Answer:**

```jsx
// Compound Component pattern
function Card({ children }) {
  return <div className="card">{children}</div>;
}
Card.Header = ({ children }) => <div className="card-header">{children}</div>;
Card.Body = ({ children }) => <div className="card-body">{children}</div>;
Card.Footer = ({ children }) => <div className="card-footer">{children}</div>;

// Usage — composable and flexible
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content here</Card.Body>
  <Card.Footer>
    <button>Save</button>
  </Card.Footer>
</Card>;
```

**Why not inheritance?** React components rarely need shared behavior through a class hierarchy. Composition gives more flexibility — you can mix and match pieces without rigid parent-child relationships.

---

### 2. Controlled vs Uncontrolled

**Question:**
Form input patterns and trade-offs.

**Answer:**

```jsx
// Controlled — React owns the state
function Controlled() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}

// Uncontrolled — DOM owns the state
function Uncontrolled() {
  const inputRef = useRef(null);
  const handleSubmit = () => console.log(inputRef.current.value);
  return <input ref={inputRef} defaultValue="" />;
}
```

| Feature        | Controlled                    | Uncontrolled              |
| -------------- | ----------------------------- | ------------------------- |
| State location | React state                   | DOM                       |
| Validation     | Real-time                     | On submit                 |
| Performance    | Re-renders on every keystroke | Minimal re-renders        |
| Best for       | Dynamic forms, validation     | Simple forms, file inputs |

---

### 3. Component Patterns

**Question:**
HOC vs Render Props vs Custom Hooks.

**Answer:**

**Custom Hooks (2026 standard):**

```jsx
function useAuth() {
  const [user, setUser] = useState(null);
  const login = async (credentials) => { ... };
  return { user, login, isAuthenticated: !!user };
}

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <h1>Welcome, {user.name}</h1>;
}
```

| Pattern      | Era       | Pros                         | Cons                              |
| ------------ | --------- | ---------------------------- | --------------------------------- |
| HOC          | 2016-2019 | Reusable                     | Wrapper hell, prop conflicts      |
| Render Props | 2017-2019 | Flexible                     | Callback hell, readability        |
| Custom Hooks | 2019+ ✅  | Simple, composable, testable | Only works in function components |

---

## 🔴 Advanced

### 1. React Server Components (RSC)

**Question:**
How RSC differs from SSR.

**Answer:**

| Feature           | SSR                              | RSC                                            |
| ----------------- | -------------------------------- | ---------------------------------------------- |
| Where it runs     | Server (then hydrates on client) | Server only (never sent to client)             |
| JavaScript bundle | Full component code sent         | Zero JS for server components                  |
| Interactivity     | Full after hydration             | None — use Client Components for interactivity |
| Data fetching     | `getServerSideProps` / loaders   | Direct `await` in component body               |
| Re-renders        | Client-side after hydration      | Server re-renders, streams updates             |

```jsx
// Server Component — async, no hooks, no JS bundle
async function UserProfile({ id }) {
  const user = await db.users.findUnique({ where: { id } }); // Direct DB access!
  return (
    <div>
      <h1>{user.name}</h1>
      <LikeButton userId={id} /> {/* Client Component for interactivity */}
    </div>
  );
}

// Client Component — marked with "use client"
("use client");
function LikeButton({ userId }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>❤️</button>;
}
```

---

### 2. Error Boundaries

**Question:**
Design a robust error boundary.

**Answer:**

```jsx
class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Report to error tracking
    errorReporter.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.error) {
      if (this.state.error instanceof NetworkError) {
        return (
          <RetryableError onRetry={() => this.setState({ error: null })} />
        );
      }
      return <GenericError error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>;
```

**Must be class component** because there's no hook equivalent for `componentDidCatch` / `getDerivedStateFromError` yet (React team has discussed `useErrorBoundary` but hasn't shipped it).
