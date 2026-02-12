# Next.js Optimizations

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Image Optimization

**Question:** How `next/image` works.

**Answer:**

```tsx
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Hero banner"
  width={1200}
  height={600}
  priority // Preload above-the-fold images
  placeholder="blur" // Show blurred placeholder while loading
/>;
```

| Feature                 | `<img>` | `next/image`                |
| ----------------------- | ------- | --------------------------- |
| Automatic resizing      | ❌      | ✅ Multiple sizes generated |
| Format conversion       | ❌      | ✅ WebP/AVIF automatically  |
| Lazy loading            | Manual  | ✅ Default                  |
| Layout shift prevention | Manual  | ✅ Width/height enforced    |
| CDN caching             | Manual  | ✅ Built-in                 |

---

### 2. Font Optimization

**Question:** How `next/font` works.

**Answer:**

```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function Layout({ children }) {
  return <body className={inter.className}>{children}</body>;
}
```

**Self-hosting benefits:**

- No external network requests (faster).
- No privacy concerns (no Google tracking).
- No layout shift from font loading (fonts are preloaded).
- Fonts are inlined in CSS at build time.

---

## 🟡 Intermediate

### 1. Metadata API

**Question:** SEO in App Router.

**Answer:**

```tsx
// Static metadata
export const metadata = {
  title: "My Blog",
  description: "Thoughts on engineering",
  openGraph: { title: "My Blog", images: ["/og.png"] },
};

// Dynamic metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, images: [post.coverImage] },
  };
}
```

---

### 2. Bundle Analysis

**Question:** Analyze and reduce bundle.

**Answer:**

```bash
# Install analyzer
npm i @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer(nextConfig);

# Run
ANALYZE=true npm run build
```

**Reduction strategies:**

- Use dynamic `import()` for heavy libraries.
- Replace large libraries with lighter alternatives (e.g., `date-fns` → `dayjs`).
- Move code to Server Components (zero client JS).
- Use `next/dynamic` with `ssr: false` for client-only components.

---

## 🔴 Advanced

### 1. Caching Strategy

**Question:** E-commerce caching architecture.

**Answer:**

| Data              | Cache Strategy            | Revalidation              |
| ----------------- | ------------------------- | ------------------------- |
| Product catalog   | ISR (revalidate: 3600)    | On-demand via CMS webhook |
| Inventory levels  | No cache (`no-store`)     | Every request             |
| User cart         | Client state (Zustand)    | N/A                       |
| Navigation/footer | SSG                       | On deploy                 |
| Search results    | SWR on client             | Background refetch        |
| Recommendations   | Edge cached, personalized | 5 minute TTL              |

---

### 2. Core Web Vitals

**Question:** Monitoring and Next.js impact.

**Answer:**

| Metric | What it measures           | Next.js features that help                           |
| ------ | -------------------------- | ---------------------------------------------------- |
| LCP    | Largest content paint      | `next/image` priority, streaming SSR, PPR            |
| INP    | Interaction responsiveness | Server Components (less JS), `startTransition`       |
| CLS    | Layout shift               | `next/image` (reserved space), `next/font` (no FOIT) |

```tsx
// Report Web Vitals
export function reportWebVitals(metric) {
  analytics.send({ name: metric.name, value: metric.value, id: metric.id });
}
```
