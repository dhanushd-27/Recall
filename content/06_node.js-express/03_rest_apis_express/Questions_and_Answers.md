# REST APIs & Express

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Express Fundamentals

**Question:** Middleware chain and `next()`.

**Answer:**

```javascript
import express from "express";
const app = express();

// Middleware executes in order — ORDER MATTERS
app.use(express.json()); // 1. Parse JSON body
app.use(cors()); // 2. CORS headers
app.use(requestLogger); // 3. Log requests
app.use("/api", authMiddleware); // 4. Auth (only /api routes)

app.get("/api/users", getUsers); // Route handler
app.use(errorHandler); // Error handler (MUST be last)

// next() passes control to the next middleware
function requestLogger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // Without this, request hangs
}
```

---

### 2. RESTful API Design

**Question:** Blog platform API design.

**Answer:**

| Method | Endpoint                  | Status  | Description            |
| ------ | ------------------------- | ------- | ---------------------- |
| GET    | `/api/posts`              | 200     | List posts (paginated) |
| GET    | `/api/posts/:id`          | 200/404 | Get single post        |
| POST   | `/api/posts`              | 201     | Create post            |
| PUT    | `/api/posts/:id`          | 200/404 | Full update            |
| PATCH  | `/api/posts/:id`          | 200/404 | Partial update         |
| DELETE | `/api/posts/:id`          | 204/404 | Delete post            |
| GET    | `/api/posts/:id/comments` | 200     | List post comments     |
| POST   | `/api/posts/:id/comments` | 201     | Add comment            |

---

## 🟡 Intermediate

### 1. Error Handling

**Question:** Centralized error handling.

**Answer:**

```javascript
// Async wrapper — no try/catch in routes
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Routes — clean, no try/catch
app.get(
  "/api/users/:id",
  asyncHandler(async (req, res) => {
    const user = await db.users.findUnique({ where: { id: req.params.id } });
    if (!user) throw new NotFoundError("User", req.params.id);
    res.json(user);
  }),
);

// Centralized error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = status === 500 ? "Internal server error" : err.message;
  if (status === 500) logger.error(err);
  res.status(status).json({ error: { message, code: err.code } });
});
```

---

### 2. Zod Validation Middleware

**Question:** Request validation with Zod.

**Answer:**

```javascript
import { z } from "zod";

const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1),
    tags: z.array(z.string()).max(10).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: "Validation failed",
          details: result.error.flatten(),
        },
      });
    }
    next();
  };
}

app.post("/api/posts", validate(createPostSchema), asyncHandler(createPost));
```

---

## 🔴 Advanced

### 1. Rate Limiting

**Question:** Rate limiting across instances.

**Answer:**

```javascript
// Redis-based sliding window rate limiter
import Redis from "ioredis";
const redis = new Redis();

async function rateLimiter(req, res, next) {
  const key = `ratelimit:${req.ip}`;
  const limit = 100;
  const windowSec = 60;

  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, windowSec);

  res.set("X-RateLimit-Limit", limit);
  res.set("X-RateLimit-Remaining", Math.max(0, limit - current));

  if (current > limit) {
    return res.status(429).json({ error: "Too many requests" });
  }
  next();
}
```

Redis ensures rate limiting works across multiple server instances (horizontal scaling).

---

### 2. API Versioning

**Question:** Compare versioning strategies.

**Answer:**

| Strategy    | Example             | Pros                        | Cons                        |
| ----------- | ------------------- | --------------------------- | --------------------------- |
| URL path    | `/v1/users`         | Simple, explicit, cacheable | URL changes, hard to sunset |
| Header      | `Accept-Version: 1` | Clean URLs                  | Hidden, harder to test      |
| Query param | `/users?v=1`        | Easy to switch              | Pollutes query string       |

**Recommendation:** URL path versioning (`/v1/`) for public APIs — it's the most explicit and debuggable approach.
