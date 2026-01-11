# Agent Delegation Workflow

> Guidelines for delegating tasks to AI agents and subagents.

## Overview

```
Task Analysis → Delegate or Execute → Monitor → Integrate Results
```

---

## When to Delegate

### Delegate When ✅

| Condition          | Example                        |
| ------------------ | ------------------------------ |
| **Scale**          | Task affects 4+ files          |
| **Expertise**      | Requires specialized knowledge |
| **Parallelizable** | Multiple independent subtasks  |
| **Research**       | Needs codebase exploration     |
| **Review**         | Multi-component code review    |

### Execute Directly When ❌

| Condition             | Example                               |
| --------------------- | ------------------------------------- |
| **Simple**            | Single file, clear change             |
| **Quick**             | < 5 minute task                       |
| **Context-dependent** | Requires current conversation context |

---

## Delegation Decision Tree

```
Is task simple (< 3 steps, 1-2 files)?
├─→ YES: Execute directly
└─→ NO: Continue...
     │
     Does it require specialized expertise?
     ├─→ YES: Delegate to specialist agent
     └─→ NO: Continue...
          │
          Can subtasks run in parallel?
          ├─→ YES: Spawn parallel subagents
          └─→ NO: Execute sequentially or delegate
```

---

## Agent Specializations

| Agent Type       | Best For                        | Model Suggestion              |
| ---------------- | ------------------------------- | ----------------------------- |
| **Orchestrator** | Complex multi-step tasks        | Claude Opus                   |
| **Explorer**     | Codebase search, file discovery | Fast model (Haiku/Flash)      |
| **Reviewer**     | Code review, security audit     | Strong reasoning (GPT-4/Opus) |
| **Frontend**     | UI/UX implementation            | Gemini Pro (visual)           |
| **Backend**      | API, services, database         | Claude Sonnet                 |
| **Tester**       | Test writing, TDD               | Any capable model             |
| **Documenter**   | Technical writing               | Gemini Flash                  |

---

## Delegation Format

### Task Description

```markdown
## Task

[Clear description of what to accomplish]

## Context

- Current file: [path]
- Related files: [paths]
- Relevant specs: [paths]

## Constraints

- Must follow [standard/pattern]
- Must not modify [files/areas]
- Must complete within [scope]

## Expected Output

- [Specific deliverables]
- [Format requirements]

## Success Criteria

- [ ] [Measurable criterion 1]
- [ ] [Measurable criterion 2]
```

### Example

```markdown
## Task

Implement the SearchBar component for tenant property search

## Context

- Feature spec: docs/specs/features/tenant/search.feature.md
- Design: Follow existing component patterns in shared/components/ui/
- Related: PropertyCard component already exists

## Constraints

- Must use React Hook Form for input handling
- Must follow project's TypeScript strict mode
- Must include unit tests

## Expected Output

- SearchBar.tsx component
- SearchBar.test.tsx tests
- useSearch.ts hook (if needed)

## Success Criteria

- [ ] Component renders search input
- [ ] Debounced search (300ms)
- [ ] Loading state during search
- [ ] Error handling for failed searches
- [ ] Unit tests pass
```

---

## Parallel Delegation

For independent tasks, delegate in parallel:

```
Main Agent
├─→ Subagent 1: Implement SearchBar component
├─→ Subagent 2: Implement PriceFilter component
├─→ Subagent 3: Implement LocationFilter component
└─→ Wait for all → Integrate → Verify
```

### Parallel Task Template

```markdown
## Parallel Tasks

### Task 1: SearchBar

- Assignee: Frontend Agent
- Files: features/tenant/components/SearchBar.tsx
- Depends on: None

### Task 2: PriceFilter

- Assignee: Frontend Agent
- Files: features/tenant/components/PriceFilter.tsx
- Depends on: None

### Task 3: Integration

- Assignee: Main Agent
- Files: features/tenant/pages/SearchPage.tsx
- Depends on: Task 1, Task 2
```

---

## Context Passing

### What to Include

| Always Include      | Sometimes Include  | Never Include       |
| ------------------- | ------------------ | ------------------- |
| Task description    | Full file contents | Unrelated code      |
| Relevant file paths | API documentation  | Secrets/credentials |
| Constraints         | Design mockups     | Personal info       |
| Success criteria    | Related specs      |                     |

### Context Bundle

For complex delegations, create a context bundle:

```
.tmp/context/{session-id}/
├── task.md           # Task description
├── relevant-files/   # Code snippets
├── specs/            # Related specifications
└── constraints.md    # Rules to follow
```

---

## Monitoring Delegated Tasks

### Status Tracking

```markdown
## Delegation Status

| Task        | Agent     | Status         | Progress |
| ----------- | --------- | -------------- | -------- |
| SearchBar   | @frontend | ✅ Complete    | 100%     |
| PriceFilter | @frontend | 🔄 In Progress | 60%      |
| Integration | @main     | ⏳ Waiting     | 0%       |
```

### Intervention Points

Intervene when:

- Agent is stuck in a loop
- Task is going in wrong direction
- Unexpected blockers arise
- Quality issues detected

---

## Post-Delegation

### Verification

```bash
# 1. Run linter
pnpm lint

# 2. Run tests
pnpm test

# 3. Build check
pnpm build

# 4. Manual review of changes
git diff --stat
```

### Integration

After all subtasks complete:

1. Review all changes together
2. Check for conflicts or inconsistencies
3. Run full test suite
4. Update documentation if needed

---

## Anti-Patterns

### ❌ Bad Delegation

- Vague task descriptions
- Missing context
- No success criteria
- Delegating without verification

### ✅ Good Delegation

- Clear, specific tasks
- Relevant context provided
- Measurable outcomes
- Post-delegation verification
