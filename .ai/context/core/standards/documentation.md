# Documentation Standards

> Universal guidelines for writing clear, maintainable documentation.

## Principles

1. **Write for the reader**: Assume they know nothing
2. **Keep it current**: Outdated docs are worse than no docs
3. **Show, don't tell**: Examples over explanations
4. **Be concise**: Respect the reader's time

---

## Documentation Types

| Type              | Purpose                       | Location              |
| ----------------- | ----------------------------- | --------------------- |
| **README**        | Project overview, quick start | Root directory        |
| **API Docs**      | Endpoint reference            | `/docs/api/`          |
| **Guides**        | How-to tutorials              | `/docs/guides/`       |
| **Architecture**  | System design                 | `/docs/architecture/` |
| **ADRs**          | Decision records              | `/docs/adr/`          |
| **Code Comments** | Implementation details        | In source code        |

---

## README Template

```markdown
# Project Name

One-line description of what this project does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Quick Start

\`\`\`bash

# Install

npm install

# Run

npm start
\`\`\`

## Documentation

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api.md)
- [Contributing](./CONTRIBUTING.md)

## License

MIT
```

---

## API Documentation

### Endpoint Format

```markdown
## Create User

Creates a new user account.

### Request

\`\`\`
POST /api/users
\`\`\`

#### Headers

| Header        | Required | Description      |
| ------------- | -------- | ---------------- |
| Authorization | Yes      | Bearer token     |
| Content-Type  | Yes      | application/json |

#### Body

\`\`\`json
{
"email": "user@example.com",
"name": "John Doe",
"role": "user"
}
\`\`\`

| Field | Type   | Required | Description                 |
| ----- | ------ | -------- | --------------------------- |
| email | string | Yes      | Valid email address         |
| name  | string | Yes      | 1-100 characters            |
| role  | string | No       | user, admin (default: user) |

### Response

#### Success (201 Created)

\`\`\`json
{
"id": "uuid",
"email": "user@example.com",
"name": "John Doe",
"role": "user",
"createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

#### Errors

| Status | Code             | Description              |
| ------ | ---------------- | ------------------------ |
| 400    | VALIDATION_ERROR | Invalid input            |
| 409    | EMAIL_EXISTS     | Email already registered |
| 500    | INTERNAL_ERROR   | Server error             |
```

---

## Code Comments

### When to Comment

```typescript
// ✅ Good: Explain WHY
// Using binary search because data is always sorted
// and we need O(log n) performance for large datasets
const index = binarySearch(sortedArray, target);

// ✅ Good: Explain complex business logic
// Tax calculation follows 2024 Taiwan regulations:
// - 0-540k: 5%
// - 540k-1.21M: 12%
// - Above 1.21M: 20%
const tax = calculateTax(income);

// ✅ Good: Document non-obvious behavior
// Returns null instead of throwing when user not found
// to simplify optional chaining in callers
async function findUser(id: string): Promise<User | null>;

// ❌ Bad: Obvious comments
// Increment counter
counter++;

// ❌ Bad: Outdated comments
// Returns user name  (but actually returns full user object)
function getUser();
```

### JSDoc for Public APIs

````typescript
/**
 * Authenticates a user with email and password.
 *
 * @param email - User's email address
 * @param password - User's password (min 8 characters)
 * @returns Authentication result with user and tokens
 * @throws {InvalidCredentialsError} When credentials are invalid
 * @throws {AccountLockedError} When account is locked
 *
 * @example
 * ```typescript
 * const result = await authService.login('user@example.com', 'password123')
 * console.log(result.user.name)
 * ```
 */
async function login(email: string, password: string): Promise<AuthResult>;
````

---

## Architecture Documentation

### Architecture Decision Records (ADR)

```markdown
# ADR-001: Use Supabase for MVP Backend

## Status

Accepted

## Context

We need a backend solution for the MVP that allows rapid development
and easy migration to a custom solution later.

## Decision

Use Supabase for authentication, database, and real-time features.

## Consequences

### Positive

- Rapid development
- Built-in auth
- Real-time subscriptions
- PostgreSQL (standard)

### Negative

- Vendor lock-in risk
- Limited customization
- Cost at scale

### Mitigation

- Abstract Supabase behind service interfaces
- Use standard SQL (no proprietary features)
- Plan migration path for v2
```

---

## Writing Style

### Be Direct

```markdown
# ❌ Verbose

In order to successfully complete the installation process,
it is necessary for you to execute the following command.

# ✅ Direct

Install with:
\`\`\`
npm install
\`\`\`
```

### Use Active Voice

```markdown
# ❌ Passive

The configuration file should be created by the user.

# ✅ Active

Create a configuration file:
```

### Use Second Person

```markdown
# ❌ Third person

The developer should configure the environment variables.

# ✅ Second person

Configure your environment variables:
```

---

## Markdown Best Practices

### Headers

```markdown
# Document Title (H1 - only one per document)

## Major Section (H2)

### Subsection (H3)

#### Minor Section (H4 - use sparingly)
```

### Code Blocks

```markdown
# Always specify language

\`\`\`typescript
const user = await getUser(id)
\`\`\`

# Use inline code for short references

Run `npm install` to install dependencies.
```

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### Links

```markdown
# Relative links for internal docs

See [Getting Started](./getting-started.md)

# Absolute links for external resources

See [React Documentation](https://react.dev)
```

---

## Diagrams

### Mermaid (GitHub-supported)

```markdown
\`\`\`mermaid
graph TD
A[User] --> B[Frontend]
B --> C[API]
C --> D[Database]
\`\`\`
```

### ASCII (Universal)

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │────▶│ Frontend│────▶│   API   │
└─────────┘     └─────────┘     └─────────┘
                                     │
                                     ▼
                               ┌─────────┐
                               │Database │
                               └─────────┘
```

---

## Documentation Checklist

Before publishing:

- [ ] Spelling and grammar checked
- [ ] Code examples tested and working
- [ ] Links verified
- [ ] Images have alt text
- [ ] No sensitive information exposed
- [ ] Version/date updated if applicable
- [ ] Table of contents updated (if present)
