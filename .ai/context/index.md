# Context Index

> Central index for all context files in ai-dev-system.

## Quick Reference

| Category | Path | Description |
|----------|------|-------------|
| **Standards** | `.ai/context/core/standards/` | Coding standards and conventions |
| **Workflows** | `.ai/context/core/workflows/` | Development workflows and processes |
| **Skills** | `.ai/skills/` | Executable skill guides |
| **Templates** | `.ai/templates/` | File and document templates |
| **Stacks** | `.ai/stacks/` | Technology-specific configurations |

---

## Standards

Code quality, naming, security, and testing standards.

| File | Trigger Keywords | Description |
|------|-----------------|-------------|
| `code-quality.md` | code quality, clean code, best practices | General code quality guidelines |
| `dbml.md` | dbml, database, schema, tables | Database schema design (DBML) |
| `documentation.md` | docs, documentation, comments | Documentation standards |
| `naming.md` | naming, conventions, variables | Naming conventions |
| `openapi.md` | openapi, swagger, api spec, endpoints | API specification (OpenAPI) |
| `security.md` | security, auth, validation | Security best practices |
| `testing.md` | tests, testing, coverage | Testing standards |

### Load Command

```
Read .ai/context/core/standards/[file].md before writing code.
```

---

## Workflows

Development processes and procedures.

| File | Trigger Keywords | Description |
|------|-----------------|-------------|
| `bdd-tdd.md` | bdd, tdd, test-driven | BDD/TDD development workflow |
| `bdd-tdd-frontend.md` | frontend testing, react testing | Frontend BDD/TDD workflow |
| `bdd-tdd-backend.md` | backend testing, api testing | Backend BDD/TDD workflow |
| `code-review.md` | review, pr, pull request | Code review process |
| `contract-driven.md` | contract, api-first, dbml, openapi | Contract-driven development |
| `delegation.md` | delegate, agent, subagent | Agent delegation workflow |
| `git-workflow.md` | git, branch, commit | Git branching and commit workflow |

### Load Command

```
Read .ai/context/core/workflows/[file].md before starting workflow.
```

---

## Skills

Executable guides for specific tasks.

| Skill | Trigger Keywords | Description |
|-------|-----------------|-------------|
| `code-review/` | review code, check PR | Code review checklist and process |
| `commit/` | commit, git commit | Commit message and process |
| `debug/` | debug, fix bug, troubleshoot | Debugging methodology |
| `documentation/` | write docs, document | Documentation writing guide |
| `feature-implementation/` | implement feature, build | Feature implementation process |
| `refactor/` | refactor, improve code | Refactoring guide |

### Load Command

```
Load skill from .ai/skills/[skill-name]/SKILL.md
```

---

## Technology Stacks

Stack-specific configurations and skills.

| Stack | Path | Includes |
|-------|------|----------|
| `react-typescript` | `.ai/stacks/react-typescript/` | React, TypeScript, Testing standards |

### Stack Structure

```
.ai/stacks/[stack-name]/
├── stack.json          # Stack metadata
├── standards/          # Stack-specific standards
│   ├── react.md
│   ├── typescript.md
│   └── testing.md
└── skills/             # Stack-specific skills
    ├── component/
    ├── hook/
    └── e2e-testing/
```

---

## Agents

AI agents for specialized tasks.

| Agent | Path | Role |
|-------|------|------|
| `orchestrator` | `.ai/agents/orchestrator.md` | Master coordinator for complex tasks |
| `oracle` | `.ai/agents/oracle.md` | Architecture and debugging expert |
| `librarian` | `.ai/agents/librarian.md` | Documentation and research |
| `explorer` | `.ai/agents/explorer.md` | Fast codebase exploration |
| `frontend-engineer` | `.ai/agents/frontend-engineer.md` | Frontend development |
| `backend-engineer` | `.ai/agents/backend-engineer.md` | Backend development |
| `tester` | `.ai/agents/tester.md` | Testing specialist |

---

## Context Loading Rules

### For Code Tasks

```
1. Load relevant standard: .ai/context/core/standards/code-quality.md
2. Load stack standard: .ai/stacks/[stack]/standards/[framework].md
3. Apply skill if specific task: .ai/skills/[skill]/SKILL.md
```

### For Workflow Tasks

```
1. Load workflow: .ai/context/core/workflows/[workflow].md
2. Load related skills as needed
```

### For Delegation

```
1. Load delegation workflow: .ai/context/core/workflows/delegation.md
2. Identify target agent: .ai/agents/[agent].md
3. Create context bundle for agent
```

---

## Directory Structure

```
.ai/
├── agents/                     # AI agent definitions
│   ├── orchestrator.md
│   ├── oracle.md
│   ├── librarian.md
│   ├── explorer.md
│   ├── frontend-engineer.md
│   ├── backend-engineer.md
│   └── tester.md
├── context/
│   ├── core/
│   │   ├── standards/         # Coding standards
│   │   │   ├── code-quality.md
│   │   │   ├── dbml.md
│   │   │   ├── documentation.md
│   │   │   ├── naming.md
│   │   │   ├── openapi.md
│   │   │   ├── security.md
│   │   │   └── testing.md
│   │   └── workflows/         # Development workflows
│   │       ├── bdd-tdd.md
│   │       ├── bdd-tdd-frontend.md
│   │       ├── bdd-tdd-backend.md
│   │       ├── code-review.md
│   │       ├── contract-driven.md
│   │       ├── delegation.md
│   │       └── git-workflow.md
│   ├── project/               # Project-specific context
│   └── index.md               # This file
├── skills/                    # Executable skill guides
│   ├── code-review/
│   ├── commit/
│   ├── debug/
│   ├── documentation/
│   ├── feature-implementation/
│   └── refactor/
├── templates/                 # File templates
│   ├── AGENTS.md.template
│   ├── ai-config.json.template
│   ├── EPIC.md.template
│   └── FEATURE_SPEC.md.template
└── stacks/                    # Technology stacks
    └── react-typescript/
        ├── stack.json
        ├── standards/
        └── skills/
```
