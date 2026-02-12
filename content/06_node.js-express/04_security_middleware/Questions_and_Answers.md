# Security & Middleware

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Common Vulnerabilities

**Question:** XSS, CSRF, and SQL injection defenses.

**Answer:**

| Attack        | How it works                                      | Defense                                        |
| ------------- | ------------------------------------------------- | ---------------------------------------------- |
| XSS           | Injecting malicious scripts into pages            | Escape output, CSP headers, `httpOnly` cookies |
| CSRF          | Tricking authenticated users into making requests | CSRF tokens, `SameSite` cookies                |
| SQL Injection | Injecting SQL via user input                      | Parameterized queries (ORMs), input validation |

```javascript
// ❌ SQL injection vulnerable
db.query(`SELECT * FROM users WHERE id = '${req.params.id}'`);

// ✅ Parameterized query
db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);

// ✅ ORM (Prisma) — automatically parameterized
await prisma.user.findUnique({ where: { id: req.params.id } });
```

---

### 2. Sessions vs JWTs

**Question:** When to choose each.

**Answer:**

| Feature     | Sessions                   | JWT                                |
| ----------- | -------------------------- | ---------------------------------- |
| Storage     | Server (Redis/DB)          | Client (cookie/localStorage)       |
| Scalability | Needs shared session store | Stateless — any server can verify  |
| Revocation  | Easy (delete from store)   | Hard (need denylist)               |
| Size        | Small cookie (session ID)  | Large cookie (payload + signature) |
| Best for    | Traditional web apps       | APIs, microservices, mobile        |

---

## 🟡 Intermediate

### 1. Helmet & CORS

**Question:** Security headers and CORS config.

**Answer:**

```javascript
import helmet from "helmet";
import cors from "cors";

app.use(helmet()); // Sets 11+ security headers

// CORS — production config
app.use(
  cors({
    origin: ["https://myapp.com", "https://admin.myapp.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies
    maxAge: 86400, // Preflight cache: 24 hours
  }),
);
```

**Helmet headers:** `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, and more.

---

### 2. OAuth 2.0 Flow

**Question:** "Login with Google" step by step.

**Answer:**

```
1. User clicks "Login with Google"
2. App redirects to Google:
   → https://accounts.google.com/o/oauth2/auth?
     client_id=XXX&redirect_uri=https://myapp.com/callback&scope=email+profile&response_type=code

3. User authenticates with Google, consents to permissions
4. Google redirects back:
   → https://myapp.com/callback?code=AUTH_CODE

5. Server exchanges code for tokens:
   POST https://oauth2.googleapis.com/token
   { code, client_id, client_secret, redirect_uri, grant_type: "authorization_code" }

6. Server receives access_token + id_token
7. Server fetches user profile with access_token
8. Server creates session / JWT → user is logged in
```

---

## 🔴 Advanced

### 1. JWT Best Practices

**Question:** JWT security considerations.

**Answer:**

```javascript
// Token creation
const accessToken = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "15m", algorithm: "RS256" }, // Short-lived, asymmetric
);

const refreshToken = crypto.randomBytes(64).toString("hex");
await redis.set(`refresh:${refreshToken}`, user.id, "EX", 7 * 86400);
```

**Key practices:**

- **Short expiry** for access tokens (15 minutes).
- **Refresh token rotation** — issue new refresh token on each use, invalidate old one.
- **Store in `httpOnly`, `Secure`, `SameSite=Strict` cookies** — not localStorage.
- **Use RS256** (asymmetric) — services can verify without knowing the secret.
- **Implement a denylist** for compromised tokens.

---

### 2. API Key System

**Question:** Secure API key design.

**Answer:**

```javascript
// Generate API key
const apiKey = `sk_live_${crypto.randomBytes(32).toString("hex")}`;
const hashedKey = await bcrypt.hash(apiKey, 12);
await db.apiKeys.create({
  hash: hashedKey,
  userId,
  prefix: apiKey.slice(0, 12),
});

// Show key ONCE to user — store only the hash
// Use prefix for identification: sk_live_abc123...

// Validation middleware
async function validateApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key) return res.status(401).json({ error: "API key required" });

  const prefix = key.slice(0, 12);
  const record = await db.apiKeys.findByPrefix(prefix);
  if (!record || !(await bcrypt.compare(key, record.hash))) {
    return res.status(401).json({ error: "Invalid API key" });
  }
  req.apiKeyOwner = record.userId;
  next();
}
```

**Never store API keys in plain text.** Hash them like passwords. Use prefixes (`sk_live_`, `sk_test_`) for identification.
