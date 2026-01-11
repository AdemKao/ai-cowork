# Security Standards

> Universal security guidelines for application development.

## Principles

1. **Defense in Depth**: Multiple layers of security
2. **Least Privilege**: Minimal access required
3. **Fail Secure**: Default to deny
4. **Don't Trust Input**: Validate everything

---

## Authentication

### Password Requirements

```typescript
const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // days
  preventReuse: 5, // last N passwords
};
```

### Session Management

| Requirement          | Implementation                          |
| -------------------- | --------------------------------------- |
| Session timeout      | 30 minutes idle, 24 hours max           |
| Secure cookies       | `HttpOnly`, `Secure`, `SameSite=Strict` |
| Session regeneration | On privilege change                     |
| Logout               | Invalidate server-side                  |

### Token Security

```typescript
// ✅ Good: Short-lived access tokens
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// ✅ Good: Rotate refresh tokens
async function refreshToken(token: string) {
  // Invalidate old token
  // Issue new token pair
}
```

---

## Authorization

### Role-Based Access Control (RBAC)

```typescript
// Define roles
enum Role {
  GUEST = "guest",
  USER = "user",
  ADMIN = "admin",
}

// Define permissions
const PERMISSIONS = {
  [Role.GUEST]: ["read:public"],
  [Role.USER]: ["read:public", "read:own", "write:own"],
  [Role.ADMIN]: ["read:all", "write:all", "delete:all"],
};

// Check permission
function hasPermission(user: User, permission: string): boolean {
  return PERMISSIONS[user.role].includes(permission);
}
```

### Route Protection

```typescript
// ✅ Good: Protect routes at multiple levels

// 1. Middleware level
app.use("/api/admin/*", requireRole("admin"));

// 2. Route level
router.delete("/users/:id", requireRole("admin"), deleteUser);

// 3. Service level
async function deleteUser(id: string, actor: User) {
  if (!hasPermission(actor, "delete:user")) {
    throw new ForbiddenError();
  }
}
```

---

## Input Validation

### Validate All Input

```typescript
// ✅ Good: Use schema validation
import { z } from "zod";

const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(12).max(128),
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z\s]+$/),
  age: z.number().int().min(0).max(150).optional(),
});

// Validate before processing
const validatedData = CreateUserSchema.parse(input);
```

### Sanitization

```typescript
// ✅ Good: Sanitize output
import DOMPurify from "dompurify";

// For HTML content
const safeHtml = DOMPurify.sanitize(userInput);

// For SQL (use parameterized queries)
const result = await db.query(
  "SELECT * FROM users WHERE id = $1",
  [userId], // Never concatenate!
);
```

---

## Data Protection

### Sensitive Data

| Data Type | Storage                | Transmission       |
| --------- | ---------------------- | ------------------ |
| Passwords | Hashed (bcrypt/argon2) | HTTPS only         |
| API Keys  | Encrypted              | Never in URL       |
| PII       | Encrypted at rest      | HTTPS + encryption |
| Tokens    | Signed (JWT)           | HttpOnly cookie    |

### Environment Variables

```bash
# ✅ Good: Use .env files (not in git)
DATABASE_URL=postgres://...
JWT_SECRET=...
API_KEY=...

# ✅ Good: .gitignore
.env
.env.local
.env.*.local
```

### Never Commit Secrets

```typescript
// ❌ Bad
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "super_secret_password";

// ✅ Good
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
```

---

## SQL Injection Prevention

### Parameterized Queries

```typescript
// ❌ Bad: String concatenation
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// ✅ Good: Parameterized query
const query = "SELECT * FROM users WHERE id = $1";
const result = await db.query(query, [userId]);

// ✅ Good: ORM/Query builder
const user = await prisma.user.findUnique({
  where: { id: userId },
});
```

---

## XSS Prevention

### Output Encoding

```typescript
// ✅ Good: React auto-escapes
return <div>{userContent}</div>

// ⚠️ Dangerous: Only when absolutely necessary
return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

// ✅ Good: Sanitize first
import DOMPurify from 'dompurify'
const sanitized = DOMPurify.sanitize(userHtml)
```

### Content Security Policy

```typescript
// ✅ Good: Set CSP headers
const CSP = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'strict-dynamic'"],
  "style-src": ["'self'", "'unsafe-inline'"], // Consider CSS-in-JS
  "img-src": ["'self'", "data:", "https:"],
  "font-src": ["'self'"],
  "connect-src": ["'self'", "https://api.example.com"],
  "frame-ancestors": ["'none'"],
};
```

---

## CSRF Prevention

```typescript
// ✅ Good: Use CSRF tokens
// Server generates token
const csrfToken = generateSecureToken();
res.cookie("csrf", csrfToken, { httpOnly: true, sameSite: "strict" });

// Client sends token in header
fetch("/api/action", {
  method: "POST",
  headers: {
    "X-CSRF-Token": getCsrfToken(),
  },
});

// Server validates
if (req.headers["x-csrf-token"] !== req.cookies.csrf) {
  throw new ForbiddenError("Invalid CSRF token");
}
```

---

## API Security

### Rate Limiting

```typescript
// ✅ Good: Rate limit endpoints
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  message: "Too many requests",
});

// Apply to routes
app.use("/api/", rateLimiter);

// Stricter for auth endpoints
app.use("/api/auth/", rateLimit({ max: 10 }));
```

### HTTPS

```typescript
// ✅ Good: Force HTTPS
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(301, `https://${req.hostname}${req.url}`);
  }
  next();
});

// ✅ Good: HSTS header
res.setHeader(
  "Strict-Transport-Security",
  "max-age=31536000; includeSubDomains",
);
```

---

## Error Handling

### Don't Leak Information

```typescript
// ❌ Bad: Exposes internals
catch (error) {
  res.status(500).json({
    error: error.message,
    stack: error.stack,
    query: sqlQuery,
  })
}

// ✅ Good: Generic message, log details
catch (error) {
  logger.error('Database error', { error, userId })
  res.status(500).json({
    error: 'An unexpected error occurred',
    requestId: req.id,
  })
}
```

---

## Dependency Security

### Regular Audits

```bash
# Check for vulnerabilities
npm audit
pnpm audit

# Auto-fix where possible
npm audit fix

# Update dependencies regularly
npm update
```

### Lockfile

```bash
# ✅ Good: Commit lockfile
git add package-lock.json  # or pnpm-lock.yaml

# ✅ Good: Use exact versions in CI
npm ci  # Not npm install
```

---

## Security Checklist

Before deployment:

- [ ] All secrets in environment variables
- [ ] HTTPS enforced
- [ ] Input validation on all endpoints
- [ ] Parameterized database queries
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Security headers set (CSP, HSTS, X-Frame-Options)
- [ ] Dependencies audited
- [ ] Error messages don't leak information
- [ ] Logging doesn't include sensitive data
