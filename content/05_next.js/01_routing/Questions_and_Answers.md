# Next.js Routing

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. File-Based Routing

**Question:** How does App Router file-based routing work?

**Answer:**

```
app/
  page.tsx              → /
  layout.tsx            → Root layout (wraps all pages)
  loading.tsx           → Loading UI (Suspense fallback)
  error.tsx             → Error boundary
  not-found.tsx         → 404 page
  about/
    page.tsx            → /about
  blog/
    page.tsx            → /blog
    [slug]/
      page.tsx          → /blog/my-post (dynamic)
```

| File            | Purpose                                                       |
| --------------- | ------------------------------------------------------------- |
| `page.tsx`      | Route UI — required for the route to be accessible            |
| `layout.tsx`    | Shared UI that persists across navigation (doesn't re-render) |
| `loading.tsx`   | Streaming loading state (wraps page in `<Suspense>`)          |
| `error.tsx`     | Error boundary — catches errors in the segment                |
| `not-found.tsx` | 404 UI when `notFound()` is called                            |
| `template.tsx`  | Like layout but re-mounts on navigation                       |

---

### 2. Dynamic Routes

**Question:** Dynamic and catch-all routes.

**Answer:**

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}

// Static generation at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Catch-all: app/docs/[...slug]/page.tsx
// Matches /docs/a, /docs/a/b, /docs/a/b/c
export default function Docs({ params }: { params: { slug: string[] } }) {
  // params.slug = ["a", "b", "c"]
}
```

---

## 🟡 Intermediate

### 1. Route Groups & Parallel Routes

**Question:** Dashboard with parallel routes.

**Answer:**

```
app/
  (dashboard)/          → Route group (no URL segment)
    layout.tsx          → Dashboard layout with sidebar
    @content/           → Parallel route slot
      page.tsx
    @sidebar/           → Parallel route slot
      page.tsx
    @modal/             → Parallel route slot
      default.tsx
      settings/page.tsx
```

```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ content, sidebar, modal }) {
  return (
    <div className="flex">
      <aside>{sidebar}</aside>
      <main>{content}</main>
      {modal}
    </div>
  );
}
```

Parallel routes load independently and can have their own loading/error states.

---

### 2. Middleware

**Question:** Auth + geo middleware.

**Answer:**

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const { pathname, geo } = request;

  // Auth redirect
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Geo-based routing
  if (pathname === "/" && geo?.country === "DE") {
    return NextResponse.rewrite(new URL("/de", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/((?!api|_next|static).*)"] };
```

---

## 🔴 Advanced

### 1. Intercepting Routes

**Question:** Modal pattern with intercepting routes.

**Answer:**

```
app/
  feed/
    page.tsx                    → Feed page
    @modal/
      (.)photo/[id]/page.tsx   → Intercepts /photo/[id] — shows as modal
  photo/
    [id]/
      page.tsx                  → Full photo page (direct navigation)
```

When clicking a photo link from the feed, `(.)photo/[id]` intercepts and shows a modal. Refreshing the page or navigating directly loads the full `photo/[id]/page.tsx`.

---

### 2. Server Actions

**Question:** Server Actions for mutations.

**Answer:**

```tsx
// app/actions.ts
"use server";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  await db.posts.create({ data: { title } });
  revalidatePath("/posts");
}

// app/posts/new/page.tsx
import { createPost } from "../actions";

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  );
}
```

Server Actions run on the server, can directly access databases/APIs, and automatically handle form serialization. They replace many API route use cases.
