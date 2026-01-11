# Git Workflow

> Universal Git branching strategy and commit conventions.

## Branch Strategy (GitHub Flow)

```
main        ─────●─────●─────●─────●───── (production ready)
                 │     │     │     │
develop     ────●┼●───●┼●───●┼●───●┼●──── (integration branch)
                ││    ││    ││    ││
feature/*   ────●┘    ││    ││    ││
fix/*       ──────────●┘    ││    ││
feature/*   ────────────────●┘    ││
release/*   ──────────────────────●┘
```

---

## Branch Naming

| Branch       | Purpose               | Example                 |
| ------------ | --------------------- | ----------------------- |
| `main`       | Production-ready code | -                       |
| `develop`    | Integration branch    | -                       |
| `feature/*`  | New features          | `feature/user-login`    |
| `fix/*`      | Bug fixes             | `fix/login-crash`       |
| `refactor/*` | Code refactoring      | `refactor/auth-service` |
| `docs/*`     | Documentation         | `docs/api-guide`        |
| `release/*`  | Release preparation   | `release/1.0.0`         |
| `hotfix/*`   | Production hotfix     | `hotfix/critical-bug`   |

---

## Commit Convention (Conventional Commits)

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                  | Example                                    |
| ---------- | ---------------------------- | ------------------------------------------ |
| `feat`     | New feature                  | `feat(auth): add Google OAuth login`       |
| `fix`      | Bug fix                      | `fix(auth): resolve token refresh issue`   |
| `docs`     | Documentation                | `docs: update API documentation`           |
| `style`    | Code style (no logic change) | `style: format with prettier`              |
| `refactor` | Code refactoring             | `refactor(auth): extract validation logic` |
| `perf`     | Performance improvement      | `perf(query): add database index`          |
| `test`     | Adding/updating tests        | `test(auth): add login unit tests`         |
| `build`    | Build system changes         | `build: upgrade vite to v6`                |
| `ci`       | CI configuration             | `ci: add e2e test workflow`                |
| `chore`    | Other changes                | `chore: update dependencies`               |

### Scopes (Optional)

Use feature or module names:

- `auth`, `user`, `property`, `tenant`, `landlord`
- `core`, `web`, `api`, `ui`

### Examples

```bash
# Feature
feat(tenant): add property search filter

# Bug fix
fix(auth): handle expired OTP gracefully

# Breaking change
feat(api)!: change property response structure

BREAKING CHANGE: `price` is now an object with `rent` and `deposit` fields

# With body
fix(auth): resolve race condition in token refresh

The previous implementation could cause multiple refresh requests
when tokens expired simultaneously. This fix adds a mutex lock
to ensure only one refresh happens at a time.

Fixes #123
```

---

## Workflow

### Starting New Work

```bash
# 1. Update develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Work and commit
git add .
git commit -m "feat(scope): description"

# 4. Push and create PR
git push origin feature/my-feature
```

### Before Merging

```bash
# 1. Rebase on latest develop (optional)
git fetch origin
git rebase origin/develop

# 2. Run checks
pnpm lint
pnpm test
pnpm build

# 3. Push (force if rebased)
git push origin feature/my-feature --force-with-lease
```

### After PR Merged

```bash
# Clean up local branch
git checkout develop
git pull origin develop
git branch -d feature/my-feature
```

---

## Commit Rules

### DO ✅

- Write in imperative mood: "add" not "added" or "adds"
- Keep description under 72 characters
- Reference issues in footer: `Fixes #123` or `Refs #456`
- Make atomic commits (one logical change per commit)

### DON'T ❌

- Don't use period at end of description
- Don't commit generated files (build output, node_modules)
- Don't commit secrets or credentials
- Don't mix refactoring with feature changes

---

## Release Process

### Semantic Versioning

```
v{MAJOR}.{MINOR}.{PATCH}[-{prerelease}]

Examples:
v1.0.0        # Stable release
v1.0.1        # Patch (bug fixes only)
v1.1.0        # Minor (new features, backward compatible)
v2.0.0        # Major (breaking changes)
v1.0.0-beta.1 # Prerelease
```

### When to Bump

| Change Type                      | Version Bump |
| -------------------------------- | ------------ |
| Bug fix, no API change           | `patch`      |
| New feature, backward compatible | `minor`      |
| Breaking change                  | `major`      |

### Release Commands

```bash
# Ensure on develop with all changes merged
git checkout develop
git pull origin develop

# Bump version
npm version patch  # or minor/major

# Push with tags
git push origin develop --tags
```

---

## Git Hooks

### Pre-commit

```bash
# .husky/pre-commit
pnpm lint-staged
```

### Commit Message Validation

```bash
# .husky/commit-msg
npx --no -- commitlint --edit $1
```

---

## Emergency Hotfix

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. Fix and commit
git commit -m "fix: critical bug description"

# 3. Merge to main AND develop
git checkout main
git merge hotfix/critical-bug
git push origin main

git checkout develop
git merge hotfix/critical-bug
git push origin develop

# 4. Tag release
git checkout main
npm version patch
git push origin main --tags
```
