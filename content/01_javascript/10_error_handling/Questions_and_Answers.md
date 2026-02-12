# Error Handling

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. `try...catch...finally`

**Question:**
Why is wrapping an entire function in a single `try...catch` problematic?

**Answer:**
**Problems with broad `try...catch`:**

- **Swallows unexpected errors:** Catches bugs that should crash loudly during development.
- **Unclear intent:** Can't tell which operation might fail.
- **Wrong recovery:** Different errors need different handling strategies.

**Best practices:**

```javascript
// ❌ Bad — too broad
async function processOrder(orderId) {
  try {
    const order = await fetchOrder(orderId);
    const validated = validateOrder(order);
    const result = await chargePayment(validated);
    await sendConfirmation(result);
    return result;
  } catch (err) {
    console.error(err); // Which step failed? No idea!
  }
}

// ✅ Good — targeted error handling
async function processOrder(orderId) {
  const order = await fetchOrder(orderId); // Let network errors propagate

  const validated = validateOrder(order);
  if (!validated.ok) {
    throw new ValidationError(validated.errors); // Specific error type
  }

  try {
    const result = await chargePayment(validated);
    return result;
  } catch (err) {
    // Only catch payment-specific errors
    if (err instanceof PaymentDeclinedError) {
      return { status: "declined", reason: err.message };
    }
    throw err; // Re-throw unexpected errors
  }
}
```

**`finally` use cases:**

- Closing database connections.
- Releasing file locks.
- Hiding loading spinners regardless of success/failure.

---

### 2. Custom Error Classes

**Question:**
Create custom error classes for a REST API.

**Answer:**

```javascript
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor); // Clean stack trace
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super("Validation failed", 400, "VALIDATION_ERROR");
    this.errors = errors; // Array of field-level errors
  }
}

class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "AUTH_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.resource = resource;
  }
}
```

**Usage in Express middleware:**

```javascript
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ code: err.code, errors: err.errors });
  }
  if (err instanceof AuthError) {
    return res.status(401).json({ code: err.code, message: err.message });
  }
  // Unexpected error — log and return generic 500
  logger.error(err);
  res
    .status(500)
    .json({ code: "INTERNAL_ERROR", message: "Something went wrong" });
});
```

**Why not just strings?**

- Can't use `instanceof` for routing to different handlers.
- No stack traces for debugging.
- No structured data (status codes, field-level errors).

---

## 🟡 Intermediate

### 1. Error Handling in Async Code

**Question:**
Compare async error handling approaches.

**Answer:**

| Approach                      | Syntax            | Use Case                                            |
| ----------------------------- | ----------------- | --------------------------------------------------- |
| `try/catch` + `await`         | Wraps await calls | Standard async function error handling              |
| `.catch()` on promise         | Chain method      | When you don't want `await`, or for fire-and-forget |
| `unhandledrejection` listener | Global event      | Last-resort safety net                              |

```javascript
// Approach 1 — try/catch (recommended)
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    return await res.json();
  } catch (err) {
    logger.error("Failed to fetch user:", err);
    throw err; // Re-throw for caller to handle
  }
}

// Approach 2 — .catch() for fire-and-forget
analytics.track("page_view").catch(() => {}); // Don't care if analytics fails

// Approach 3 — Global safety net (Node.js)
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection:", reason);
  // In production: report to monitoring, do NOT exit
});
```

**What happens with unhandled rejections:**

- **Node.js 15+:** Process crashes by default (configurable).
- **Browsers:** Console warning, no crash.
- **Best practice:** Always handle rejections explicitly. Use the global listener only as a safety net.

---

### 2. Error Boundaries in React

**Question:**
Prevent one broken component from crashing the entire app.

**Answer:**

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Report to monitoring service
    errorReporter.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}

// Usage — wrap sections of the app independently
<ErrorBoundary fallback={<DashboardFallback />}>
  <Dashboard />
</ErrorBoundary>
<ErrorBoundary fallback={<SidebarFallback />}>
  <Sidebar />
</ErrorBoundary>
```

**Design considerations:**

- Place boundaries at **feature boundaries** (sidebar, dashboard, modal) — not around every component.
- Error boundaries do **NOT** catch errors in event handlers, async code, or SSR.
- Provide meaningful fallback UI with retry buttons.
- Always report errors to monitoring (Sentry, DataDog).

---

### 3. Graceful Degradation

**Question:**
Three independent API calls — show partial data if one fails.

**Answer:**

```javascript
async function loadDashboard() {
  const [userResult, ordersResult, analyticsResult] = await Promise.allSettled([
    fetchUser(),
    fetchOrders(),
    fetchAnalytics(),
  ]);

  return {
    user: userResult.status === "fulfilled" ? userResult.value : null,
    orders: ordersResult.status === "fulfilled" ? ordersResult.value : [],
    analytics:
      analyticsResult.status === "fulfilled" ? analyticsResult.value : null,
    errors: [userResult, ordersResult, analyticsResult]
      .filter((r) => r.status === "rejected")
      .map((r) => r.reason),
  };
}

// In the UI
function Dashboard({ data }) {
  return (
    <>
      {data.user ? <UserProfile user={data.user} /> : <UserProfileSkeleton />}
      {data.orders.length > 0 ? (
        <OrderList orders={data.orders} />
      ) : (
        <p>Orders unavailable</p>
      )}
      {data.analytics ? (
        <Charts data={data.analytics} />
      ) : (
        <p>Analytics loading failed</p>
      )}
      {data.errors.length > 0 && <Banner>Some sections failed to load</Banner>}
    </>
  );
}
```

**Key:** `Promise.allSettled()` never rejects — it waits for all promises and reports each result individually. This is the right tool for independent operations with graceful degradation.

---

## 🔴 Advanced

### 1. Global Error Handling Strategy

**Question:**
Design a global error handling system for production Node.js.

**Answer:**

```javascript
// 1. Synchronous errors — Express error middleware
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
  }
  logger.error("Unhandled Error:", { error: err, url: req.url });
  res.status(500).json({ code: "INTERNAL_ERROR" });
});

// 2. Unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  errorReporter.captureException(reason);
  // Do NOT exit — let the process continue serving other requests
});

// 3. Uncaught exceptions — MUST exit
process.on("uncaughtException", (err) => {
  logger.fatal("Uncaught Exception — shutting down:", err);
  errorReporter.captureException(err);

  // Graceful shutdown
  server.close(() => {
    process.exit(1); // Let process manager (PM2, K8s) restart
  });

  // Force exit after 10s if graceful shutdown hangs
  setTimeout(() => process.exit(1), 10_000);
});
```

**Why uncaught exceptions require exit:**
After an uncaught exception, the application state is _undefined_. The in-memory state may be corrupted. Continuing to serve requests could produce incorrect results or data corruption. Always exit and let a process manager restart.

---

### 2. Error Serialization & Monitoring

**Question:**
Send errors to a monitoring service. What information to capture?

**Answer:**

```javascript
function serializeError(error) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    code: error.code,
    // Capture custom properties
    ...Object.getOwnPropertyNames(error).reduce((acc, key) => {
      if (!["name", "message", "stack"].includes(key)) {
        acc[key] = error[key];
      }
      return acc;
    }, {}),
    // Context
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
  };
}
```

**Why `error.stack` is unreliable in production:**

- Minified code has mangled names: `a.b.c` instead of `UserService.fetchUser`.
- Line numbers don't match source code.

**Solution — Source maps:**

- Generate source maps during build but don't serve them publicly.
- Upload source maps to your error monitoring service (Sentry, DataDog).
- The service maps minified stack traces back to original source code.

```bash
# Upload source maps to Sentry
sentry-cli releases files <version> upload-sourcemaps ./dist
```
