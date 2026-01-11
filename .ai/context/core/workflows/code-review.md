# Code Review Workflow

> Universal code review process for quality, security, and maintainability.

## Overview

```
Changes Ready → Self Review → AI Review → Human Review (if needed) → Merge
```

---

## Review Checklist

### 1. Code Quality

- [ ] **Readability**: Code is self-explanatory
- [ ] **Naming**: Variables/functions have clear, descriptive names
- [ ] **Functions**: Each function does ONE thing (Single Responsibility)
- [ ] **Length**: Functions < 50 lines, files < 300 lines
- [ ] **DRY**: No duplicated code
- [ ] **Comments**: Only for "why", not "what"

### 2. Architecture

- [ ] **Dependency Rules**: Follows layer hierarchy
- [ ] **Separation of Concerns**: UI, logic, data are separated
- [ ] **Interface First**: Uses interfaces for abstraction
- [ ] **No Circular Dependencies**: Clean dependency graph

### 3. Error Handling

- [ ] **No Silent Failures**: All errors are handled or propagated
- [ ] **Typed Errors**: Uses custom error types
- [ ] **User-Friendly Messages**: Errors are meaningful to users
- [ ] **Logging**: Errors are logged for debugging

### 4. Security

- [ ] **No Secrets**: No API keys, passwords in code
- [ ] **Input Validation**: All user input is validated
- [ ] **SQL Injection**: Uses parameterized queries
- [ ] **XSS Prevention**: User content is escaped
- [ ] **Authentication**: Protected routes are guarded

### 5. Performance

- [ ] **No N+1 Queries**: Batch database calls
- [ ] **Memoization**: Expensive computations are cached
- [ ] **Lazy Loading**: Large resources load on demand
- [ ] **Bundle Size**: No unnecessary dependencies

### 6. Testing

- [ ] **Coverage**: New code has tests
- [ ] **Edge Cases**: Tests include error scenarios
- [ ] **Meaningful Assertions**: Tests verify behavior, not implementation

### 7. Documentation

- [ ] **README Updated**: If setup changed
- [ ] **API Docs**: New endpoints documented
- [ ] **Comments**: Complex logic explained

---

## Review Process

### Step 1: Self Review

Before requesting review:

```bash
# 1. Run linter
pnpm lint

# 2. Run tests
pnpm test

# 3. Check diff
git diff --stat

# 4. Review your own changes
git diff HEAD~1
```

### Step 2: AI Review

Use AI to catch common issues:

```
Please review this code for:
- Security vulnerabilities
- Performance issues
- Code style violations
- Missing error handling
- Test coverage gaps
```

### Step 3: Human Review (if needed)

For critical changes:

- Authentication/Authorization
- Payment processing
- Data migrations
- API breaking changes

---

## Review Comments

### Comment Format

```
[SEVERITY] Category: Description

SEVERITY:
- 🔴 BLOCKER: Must fix before merge
- 🟡 SUGGESTION: Should consider
- 🟢 NIT: Minor, optional

Examples:
- 🔴 Security: User input not sanitized
- 🟡 Performance: Consider memoizing this computation
- 🟢 Style: Could use destructuring here
```

### Responding to Comments

| Action      | When                            |
| ----------- | ------------------------------- |
| Fix         | Agree with feedback             |
| Discuss     | Need clarification              |
| Acknowledge | Valid point, will address later |

---

## Automated Checks

Configure CI to run:

```yaml
# .github/workflows/ci.yml
- name: Lint
  run: pnpm lint

- name: Type Check
  run: pnpm typecheck

- name: Unit Tests
  run: pnpm test

- name: Build
  run: pnpm build
```

---

## Review Scope Guidelines

| Change Type  | Review Depth                  |
| ------------ | ----------------------------- |
| Typo/Comment | Quick scan                    |
| Bug Fix      | Focus on fix + test           |
| New Feature  | Full review                   |
| Refactor     | Verify behavior unchanged     |
| Security     | Deep review + security expert |

---

## Anti-Patterns

### ❌ Bad Review Comments

- "This is wrong" (no explanation)
- "I would do it differently" (no reason)
- Nitpicking style in large PRs

### ✅ Good Review Comments

- "This could cause X issue because Y. Consider Z instead."
- "Nice approach! One edge case to consider: ..."
- Links to documentation or examples
