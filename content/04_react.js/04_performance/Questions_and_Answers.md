# React Performance

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Re-Rendering

**Question:**
What causes re-renders?

**Answer:**
A component re-renders when:

1. **Its state changes** (`setState`).
2. **Its parent re-renders** (even if props haven't changed).
3. **Context value changes** (for consumers of that context).

**React's reconciliation:**

1. Component re-renders → new Virtual DOM tree.
2. React **diffs** new tree against previous tree.
3. Only the **changed DOM nodes** are updated (minimal mutations).

**Key insight:** Re-rendering is NOT expensive — DOM updates are. React's diffing makes re-renders cheap. Don't optimize re-renders until you've measured actual performance issues.

---

### 2. Keys in Lists

**Question:**
Why keys matter.

**Answer:**

```jsx
// ❌ Index as key — broken when list order changes
{
  items.map((item, i) => <Item key={i} data={item} />);
}

// ✅ Stable unique ID
{
  items.map((item) => <Item key={item.id} data={item} />);
}
```

**Why:** Keys tell React which items changed, were added, or removed. With index keys:

- Reordering treats items as "changed" instead of "moved" → destroys and recreates DOM.
- Input state gets mixed up between items.
- Animations break.

**Rule:** Use a **stable, unique identifier** (database ID, UUID) — never array index for dynamic lists.

---

## 🟡 Intermediate

### 1. `React.memo`

**Question:**
When `React.memo` helps vs hurts.

**Answer:**

```jsx
// React.memo — skips re-render if props haven't changed (shallow compare)
const ExpensiveList = React.memo(function ExpensiveList({ items }) {
  return items.map((item) => <ComplexItem key={item.id} data={item} />);
});
```

**When it helps:**

- Component renders are genuinely expensive (large lists, heavy computation).
- Component receives the same props frequently (parent re-renders often).
- Combined with `useCallback`/`useMemo` for stable prop references.

**When it hurts:**

- Component always receives new props (new objects/arrays each render).
- Component is cheap to render — memo comparison overhead > render cost.
- Props are primitives that rarely change (already fast).

---

### 2. Code Splitting

**Question:**
Route-based code splitting.

**Answer:**

```jsx
import { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const Analytics = lazy(() => import("./pages/Analytics"));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

Each route's code is loaded only when the user navigates to it — reducing initial bundle size significantly.

---

## 🔴 Advanced

### 1. React Compiler

**Question:**
How React Compiler auto-memoizes.

**Answer:**
The React Compiler (shipped with React 19) **automatically adds memoization** during build time — eliminating the need for manual `useMemo`, `useCallback`, and `React.memo`.

```jsx
// Before (manual)
function ProductList({ products }) {
  const sorted = useMemo(() => products.sort(byPrice), [products]);
  const handleClick = useCallback((id) => selectProduct(id), []);
  return <MemoizedList items={sorted} onClick={handleClick} />;
}

// After (React Compiler) — write simple code, compiler optimizes
function ProductList({ products }) {
  const sorted = products.sort(byPrice); // Auto-memoized
  const handleClick = (id) => selectProduct(id); // Auto-memoized
  return <List items={sorted} onClick={handleClick} />;
}
```

**The compiler analyzes data flow** and only re-computes values that actually changed — at the granularity of individual expressions, not entire components.

---

### 2. Profiling & Debugging

**Question:**
Debug React jank step by step.

**Answer:**

**Step 1: React DevTools Profiler**

- Record a session.
- Look for components with frequent/long renders.
- Check "Why did this render?" for each component.

**Step 2: Chrome Performance Tab**

- Record while interacting.
- Look for long tasks (>50ms) blocking the main thread.
- Check for layout thrashing (forced reflows).

**Step 3: `why-did-you-render`**

```bash
npm i @welldone-software/why-did-you-render
```

Logs unnecessary re-renders with the exact props/state that changed.

**Common causes:**

1. **Creating new objects/arrays in render** — pass stable references.
2. **Missing memoization on expensive computations**.
3. **Context over-sharing** — too many consumers of a large context.
4. **Large lists without virtualization** — use `react-window` or `tanstack-virtual`.
5. **Synchronous state updates in rapid succession** — batch with `startTransition`.
