# Context Index

> Lightweight routing table for context loading. **Read this first, load others as needed.**

## Quick Route

Load **only** the files relevant to your current task:

| Task | Load These Files |
|------|------------------|
| **Writing code** | `standards/code-quality.md` |
| **API development** | `standards/openapi.md` + `workflows/contract-driven.md` |
| **Database design** | `standards/dbml.md` |
| **Writing tests** | `workflows/bdd-tdd.md` (or frontend/backend specific) |
| **Code review** | `workflows/code-review.md` |
| **UI/UX work** | `skills/ui-ux/SKILL.md` |
| **Documentation** | `standards/documentation.md` |
| **Git operations** | `workflows/git-workflow.md` |
| **Large features** | `workflows/stacked-development.md` |
| **Delegating tasks** | `workflows/delegation.md` |

## Stack-Specific Loading

**Only load stack files when user specifies a stack or it's detected from project.**

| Stack | When to Load | Files |
|-------|--------------|-------|
| `react-typescript` | `.tsx` files, React project | `stacks/react-typescript/standards/` |
| `php-laravel` | `.php` files, Laravel project | `stacks/php-laravel/standards/` |
| `node-express` | Express app detected | `stacks/node-express/standards/` |

### Stack Detection

```
If package.json contains "react" → react-typescript
If composer.json contains "laravel" → php-laravel
If package.json contains "express" → node-express
```

---

## Loading Rules

### ✅ DO

- Load **1-2 relevant files** per task
- Check index first, then load specific files
- Load stack files only when stack is clear
- Load skills only when triggered

### ❌ DON'T

- Load all standards at once
- Load all workflows at once
- Load unrelated stack files
- Pre-load "just in case"

---

## File Reference

### Standards (load one at a time)

| File | Keywords | Size |
|------|----------|------|
| `code-quality.md` | code, quality, clean | ~9KB |
| `dbml.md` | database, schema, tables | ~8KB |
| `documentation.md` | docs, comments, readme | ~7KB |
| `naming.md` | naming, conventions | ~7KB |
| `openapi.md` | api, swagger, endpoints | ~15KB |
| `security.md` | security, auth, validation | ~7KB |
| `testing.md` | tests, coverage | ~8KB |

### Workflows (load one at a time)

| File | Keywords | Size |
|------|----------|------|
| `bdd-tdd.md` | tdd, bdd, test-driven | ~5KB |
| `bdd-tdd-frontend.md` | frontend tests, component tests | ~8KB |
| `bdd-tdd-backend.md` | backend tests, api tests | ~9KB |
| `code-review.md` | review, PR | ~4KB |
| `contract-driven.md` | contracts, api-first | ~6KB |
| `delegation.md` | delegate, agent | ~6KB |
| `git-workflow.md` | git, branch, commit | ~6KB |
| `stacked-development.md` | large feature, stacked PR, worktree | ~12KB |

### Skills (load only when triggered)

| Skill | Trigger | Size |
|-------|---------|------|
| `ui-ux/SKILL.md` | UI, design, styling | ~10KB |
| `code-review/SKILL.md` | review code | ~3KB |
| `debug/SKILL.md` | debug, fix bug | ~3KB |
| `commit/SKILL.md` | commit changes | ~2KB |
| `feature-decompose/SKILL.md` | large feature, split PR | ~6KB |
| `worktree-agent/SKILL.md` | worktree, parallel agents | ~8KB |
| `notify/SKILL.md` | send notification, task complete, need approval | ~4KB |

### Agents (load for delegation)

| Agent | When to Use |
|-------|-------------|
| `orchestrator.md` | Complex multi-step tasks |
| `oracle.md` | Architecture decisions, debugging |
| `frontend-engineer.md` | Frontend tasks |
| `backend-engineer.md` | Backend tasks |
| `tester.md` | Testing tasks |
| `explorer.md` | Codebase search |
| `librarian.md` | Documentation |

---

## Example Loading Scenarios

### Scenario: "Create a new API endpoint"

```
1. Load: standards/openapi.md (API design)
2. Load: workflows/contract-driven.md (workflow)
3. If Laravel: Load stacks/php-laravel/skills/controller/SKILL.md
4. If Express: Load stacks/node-express/skills/api-endpoint/SKILL.md
```

### Scenario: "Fix this bug"

```
1. Load: skills/debug/SKILL.md
2. Maybe: standards/code-quality.md (if code changes needed)
```

### Scenario: "Build a login page"

```
1. Load: skills/ui-ux/SKILL.md
2. If React: Load stacks/react-typescript/standards/react.md
```

### Scenario: "Review this PR"

```
1. Load: workflows/code-review.md
2. Load: skills/code-review/SKILL.md
```

### Scenario: "Implement large feature with multiple PRs"

```
1. Load: workflows/stacked-development.md
2. Load: skills/feature-decompose/SKILL.md
3. If parallel agents: Load skills/worktree-agent/SKILL.md
```

---

## Token Budget Guideline

| Task Complexity | Max Files to Load |
|-----------------|-------------------|
| Simple (fix typo, small change) | 0-1 |
| Medium (new feature, component) | 1-2 |
| Complex (architecture, multi-file) | 2-3 |
| Major (new system, refactor) | 3-4 |

**Target: Keep context loading under 20KB per task.**
