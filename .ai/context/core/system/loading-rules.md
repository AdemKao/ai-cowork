# Context Loading Rules

> Rules for efficient context loading to minimize token usage.

## Core Principles

1. **Lazy Loading** - Load only when needed
2. **Minimal Set** - Load smallest relevant set
3. **Stack Isolation** - Don't load unrelated stacks
4. **Index First** - Check index before loading files

---

## Loading Priority

### Level 1: Never Auto-Load
These files are loaded **only when explicitly needed**:

- All files in `stacks/` (wait for stack detection)
- All files in `skills/` (wait for trigger)
- `agents/*.md` (only for delegation)

### Level 2: Task-Triggered Load
Load based on detected task type:

| Task Detection | Load |
|----------------|------|
| Keywords: "test", "spec", "coverage" | `workflows/bdd-tdd.md` |
| Keywords: "api", "endpoint", "route" | `standards/openapi.md` |
| Keywords: "database", "schema", "table" | `standards/dbml.md` |
| Keywords: "review", "PR", "pull request" | `workflows/code-review.md` |
| Keywords: "ui", "design", "style", "component" | `skills/ui-ux/SKILL.md` |
| Keywords: "security", "auth", "password" | `standards/security.md` |

### Level 3: Contextual Load
Load based on file context:

| File Extension | Detected Stack | Load |
|----------------|----------------|------|
| `.tsx`, `.jsx` | react-typescript | `stacks/react-typescript/standards/` |
| `.php` | php-laravel | `stacks/php-laravel/standards/` |
| `.ts` + express | node-express | `stacks/node-express/standards/` |
| `.vue` | vue | (future) |

---

## Stack Detection Logic

```
function detectStack(projectRoot):
  if exists("composer.json"):
    content = read("composer.json")
    if "laravel/framework" in content:
      return "php-laravel"
  
  if exists("package.json"):
    content = read("package.json")
    if "react" in content:
      return "react-typescript"
    if "express" in content:
      return "node-express"
    if "vue" in content:
      return "vue"
  
  return null
```

---

## Token Budget

### Per-Task Limits

| Task Type | Max Context Size | Max Files |
|-----------|------------------|-----------|
| Quick fix | 5KB | 1 |
| Single feature | 15KB | 2 |
| Multi-file change | 25KB | 3 |
| Architecture | 40KB | 4 |

### File Sizes Reference

```
Small  (< 5KB):  commit, debug, delegation
Medium (5-10KB): code-quality, naming, bdd-tdd
Large  (> 10KB): openapi, express.md, laravel.md
```

---

## Loading Workflow

```
1. Receive user request

2. Analyze request
   ├─→ Extract keywords
   ├─→ Identify file extensions mentioned
   └─→ Check for stack indicators

3. Consult index.md (if needed)
   └─→ Map keywords to files

4. Load minimal set
   ├─→ 1 standard (if code quality relevant)
   ├─→ 1 workflow (if process relevant)
   └─→ 1 stack file (if stack detected)

5. Execute task

6. Load additional context only if blocked
```

---

## Anti-Patterns

### ❌ Bad: Load Everything

```
"Let me load all the standards first..."
[Loads 7 files, 60KB of context]
```

### ✅ Good: Load Minimal

```
"This is a React component task, loading react.md..."
[Loads 1 file, 8KB of context]
```

### ❌ Bad: Guess Stack

```
"I'll load Laravel standards just in case..."
[Loads wrong stack]
```

### ✅ Good: Detect Stack

```
"Checking package.json... React detected, loading react-typescript stack"
[Loads correct stack]
```

---

## Integration with AI Tools

### For OpenCode

In agent prompt, include:

```markdown
<context_loading>
Before executing tasks:
1. Read .ai/context/index.md for routing
2. Load ONLY files matching current task
3. Detect stack from project files before loading stack-specific content
4. Never load more than 3 context files at once
</context_loading>
```

### For Claude Code

In CLAUDE.md or skill trigger:

```markdown
When activated:
1. Check .ai/context/index.md for relevant files
2. Load minimal context based on task keywords
3. Stack files only if stack is confirmed
```

### For Cursor

In rules or commands:

```markdown
Context loading rules:
- Reference .ai/context/index.md for file routing
- Load 1-2 most relevant files per task
- Prefer skills for specific actions
```
