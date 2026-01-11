# Code Review Skill

> Perform comprehensive code review for quality, security, and maintainability.

## Trigger

- User requests code review
- Before merging PR
- After significant changes

## Steps

1. **Identify Changed Files**

   ```bash
   git diff --name-only HEAD~1
   # or for specific branch
   git diff --name-only main...HEAD
   ```

2. **Read Changed Code**
   - Focus on logic changes, not just formatting
   - Understand the context and purpose

3. **Check Against Criteria**

   ### Code Quality
   - [ ] Naming is clear and descriptive
   - [ ] Functions are focused (single responsibility)
   - [ ] No code duplication
   - [ ] Proper error handling
   - [ ] No magic numbers/strings

   ### Security
   - [ ] Input validation present
   - [ ] No hardcoded secrets
   - [ ] SQL injection prevention
   - [ ] XSS prevention

   ### Testing
   - [ ] New code has tests
   - [ ] Edge cases covered
   - [ ] Tests are meaningful

   ### Architecture
   - [ ] Follows project patterns
   - [ ] Dependencies flow correctly
   - [ ] No circular dependencies

4. **Generate Review Report**

## Output Format

```markdown
## Code Review: [PR/Commit Description]

### Summary

[Brief overview of changes and overall assessment]

### Findings

#### 🔴 Blockers (Must Fix)

1. [file:line] Issue description
   - Why it's a problem
   - Suggested fix

#### 🟡 Suggestions (Should Consider)

1. [file:line] Issue description
   - Reasoning
   - Alternative approach

#### 🟢 Nitpicks (Optional)

1. [file:line] Minor suggestion

### Positive Notes

- [What was done well]

### Checklist

- [x] Code quality reviewed
- [x] Security reviewed
- [x] Tests reviewed
- [x] Architecture reviewed
```

## Example

```markdown
## Code Review: Add user authentication

### Summary

Good implementation overall. One security issue needs addressing before merge.

### Findings

#### 🔴 Blockers

1. `src/auth/login.ts:45` - Password logged in plaintext
   - Security risk: passwords visible in logs
   - Fix: Remove console.log or mask password

#### 🟡 Suggestions

1. `src/auth/login.ts:23` - Consider adding rate limiting
   - Prevents brute force attacks
   - Use existing rateLimiter middleware

#### 🟢 Nitpicks

1. `src/auth/types.ts:12` - Could use more descriptive type name
   - `LoginData` → `LoginCredentials`

### Positive Notes

- Good use of custom error types
- Comprehensive input validation
- Well-structured service layer
```
