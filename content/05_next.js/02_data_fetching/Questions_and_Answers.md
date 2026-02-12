# Next.js Data Fetching

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Server Components & Data Fetching

**Question:** How to fetch data in Server Components?

**Answer:**

```tsx
// Server Component — async by default
export default async function UsersPage() {
  const users = await fetch("https://api.example.com/users").then((r) =>
    r.json(),
  );
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

**Why this works:** Server Components run only on the server — they can directly call APIs, databases, or file systems without exposing secrets to the client.

---

### 2. Caching

**Question:** Three caching layers.

**Answer:**

| Layer               | What it caches                                | Duration       | Invalidation                      |
| ------------------- | --------------------------------------------- | -------------- | --------------------------------- |
| Request Memoization | Deduplicates same `fetch` calls in one render | Single request | Automatic                         |
| Data Cache          | Response data from `fetch`                    | Persistent     | `revalidate`, `revalidatePath`    |
| Full Route Cache    | Pre-rendered HTML + RSC payload               | Persistent     | `revalidatePath`, `revalidateTag` |

```tsx
// Cached for 60 seconds
const data = await fetch(url, { next: { revalidate: 60 } });

// Never cached
const data = await fetch(url, { cache: "no-store" });

// Cached indefinitely (default)
const data = await fetch(url); // cache: "force-cache"
```

---

## 🟡 Intermediate

### 1. Streaming & Suspense

**Question:** Progressive page loading.

**Answer:**

```tsx
// app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<ChartSkeleton />}>
        <Analytics /> {/* Streams in when ready */}
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders /> {/* Streams independently */}
      </Suspense>
    </div>
  );
}
```

The shell (`<h1>Dashboard</h1>`) renders immediately. Each `<Suspense>` boundary streams its content as it resolves — users see progressive loading instead of a blank page.

---

### 2. `fetch` Extensions

**Question:** How Next.js extends `fetch`.

**Answer:**

```tsx
// Default — cached indefinitely
fetch(url);
// Same as: fetch(url, { cache: "force-cache" })

// Never cache — always fresh (like getServerSideProps)
fetch(url, { cache: "no-store" });

// Time-based revalidation (ISR)
fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour

// Tag-based revalidation
fetch(url, { next: { tags: ["posts"] } });
// Later: revalidateTag("posts") invalidates all fetches with this tag
```

---

## 🔴 Advanced

### 1. On-Demand Revalidation

**Question:** CMS webhook revalidation.

**Answer:**

```tsx
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const { secret, slug, type } = await request.json();

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }

  if (type === "post") {
    revalidatePath(`/blog/${slug}`); // Specific page
    revalidateTag("posts"); // All posts listings
  }

  return Response.json({ revalidated: true });
}
```

---

### 2. Parallel Data Fetching

**Question:** Avoid request waterfalls.

**Answer:**

```tsx
// ❌ Sequential — each awaits the previous (waterfall)
const user = await fetchUser(id); // 200ms
const posts = await fetchPosts(id); // 300ms
const analytics = await fetchAnalytics(id); // 150ms
// Total: 650ms

// ✅ Parallel — all start simultaneously
const [user, posts, analytics] = await Promise.all([
  fetchUser(id), // 200ms
  fetchPosts(id), // 300ms ← determines total
  fetchAnalytics(id), // 150ms
]);
// Total: 300ms (fastest = longest single request)
```
