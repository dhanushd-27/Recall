# Next.js Data Fetching

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Server Components & Data Fetching

**Question:** How do you fetch data in Next.js Server Components? Why can you use `async/await` directly in the component body?

### 2. Caching Behavior

## **Question:** Explain Next.js's caching layers: Request Memoization, Data Cache, and Full Route Cache. How does `revalidate` work?

## 🟡 Intermediate

### 1. Streaming & Suspense

**Question:** How does streaming work in Next.js? Show how `loading.tsx` and nested `<Suspense>` boundaries enable progressive page loading.

### 2. `fetch` API Extensions

## **Question:** How does Next.js extend the native `fetch` API? Explain `cache: "force-cache"`, `cache: "no-store"`, and `next: { revalidate: N }`.

## 🔴 Advanced

### 1. On-Demand Revalidation

**Question:** How do `revalidatePath` and `revalidateTag` work? Design a CMS webhook that invalidates specific pages when content changes.

### 2. Parallel Data Fetching

**Question:** A page needs data from three independent APIs. Show the difference between sequential and parallel fetching and how to avoid request waterfalls.
