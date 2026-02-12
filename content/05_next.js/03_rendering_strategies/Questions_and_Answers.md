# Rendering Strategies

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. SSR vs SSG vs ISR

**Question:** When to use each rendering strategy.

**Answer:**

| Strategy | When it renders         | Use case                 | Freshness                        |
| -------- | ----------------------- | ------------------------ | -------------------------------- |
| SSG      | Build time              | Blog, docs, marketing    | Stale until rebuild              |
| SSR      | Every request           | Personalized pages, auth | Always fresh                     |
| ISR      | Build time + revalidate | E-commerce, news         | Fresh after `revalidate` seconds |

```tsx
// SSG — static at build time (default)
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}

// SSR — every request (opt out of caching)
export const dynamic = "force-dynamic";

// ISR — static but revalidates every 60 seconds
export const revalidate = 60;
```

---

### 2. Client vs Server Components

**Question:** Boundary rules.

**Answer:**

| Feature                | Server Component | Client Component |
| ---------------------- | ---------------- | ---------------- |
| Directive              | Default (none)   | `"use client"`   |
| `useState`/`useEffect` | ❌               | ✅               |
| Event handlers         | ❌               | ✅               |
| Async/await in body    | ✅               | ❌               |
| Access DB/filesystem   | ✅               | ❌               |
| JS bundle size impact  | Zero             | Adds to bundle   |

**Import rules:**

- Server → Client: ✅ Can import Client Components.
- Client → Server: ❌ Cannot import Server Components directly. Pass as `children` prop instead.

```tsx
// ✅ Server Component imports Client Component
import LikeButton from "./LikeButton"; // "use client"
export default async function Post() {
  const post = await getPost();
  return (
    <div>
      {post.title}
      <LikeButton id={post.id} />
    </div>
  );
}
```

---

## 🟡 Intermediate

### 1. Hybrid Rendering

**Question:** Static + dynamic on same page.

**Answer:**

```tsx
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id); // Cached (static)

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>

      {/* Dynamic section — streams in */}
      <Suspense fallback={<PriceSkeleton />}>
        <DynamicPrice productId={params.id} /> {/* fetches with no-store */}
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={params.id} />
      </Suspense>
    </div>
  );
}
```

The static product info renders instantly. Dynamic pricing and reviews stream in via Suspense boundaries.

---

### 2. Partial Prerendering

**Question:** How PPR works.

**Answer:**
PPR renders a **static shell at build time** and **streams dynamic content at request time** — combining the benefits of SSG (fast TTFB) with SSR (fresh data).

```tsx
// The static shell is pre-rendered
// Dynamic parts are marked with Suspense
export default function Page() {
  return (
    <div>
      <StaticHeader /> {/* Pre-rendered HTML */}
      <Suspense fallback={<Skeleton />}>
        <DynamicContent /> {/* Streamed at request time */}
      </Suspense>
      <StaticFooter /> {/* Pre-rendered HTML */}
    </div>
  );
}
```

---

## 🔴 Advanced

### 1. Edge vs Node.js Runtime

**Question:** When to use each runtime.

**Answer:**

| Feature               | Edge Runtime              | Node.js Runtime  |
| --------------------- | ------------------------- | ---------------- |
| Cold start            | ~0ms                      | 250ms+           |
| Max execution         | 30 seconds                | No limit         |
| APIs available        | Web APIs subset           | Full Node.js     |
| `fs`, `child_process` | ❌                        | ✅               |
| Database drivers      | Limited (HTTP-based only) | All              |
| Deployment            | CDN edge locations        | Regional servers |

```tsx
// Edge runtime
export const runtime = "edge";

// Node.js runtime (default)
export const runtime = "nodejs";
```

**Use Edge for:** Middleware, auth checks, A/B testing, geo-routing.
**Use Node.js for:** Database queries, file operations, heavy computation.

---

### 2. Streaming SSR Architecture

**Question:** How RSC streaming works internally.

**Answer:**

1. Request arrives → Next.js begins rendering the React tree on the server.
2. Server Components output an **RSC payload** (serialized component tree, not HTML).
3. Static parts flush immediately as HTML.
4. Dynamic parts (inside `<Suspense>`) stream as they resolve.
5. The RSC payload is sent alongside HTML for client-side reconciliation.
6. Client React **hydrates** only Client Components — Server Components are never hydrated.

The RSC payload format is a line-delimited JSON stream where each line represents a chunk of the component tree.
