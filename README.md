# AI Dev System

> Cross-stack AI development workflow system for freelancers and teams.

A unified collection of standards, workflows, skills, and AI agents that can be applied to any project regardless of technology stack.

## Features

- **🤖 AI Agents** - Specialized agents for different tasks (orchestrator, frontend, backend, tester, etc.)
- **📋 Standards** - Coding standards, security guidelines, testing conventions
- **🔄 Workflows** - BDD/TDD, contract-driven development, code review processes
- **🛠️ Skills** - Executable guides for specific tasks (debugging, refactoring, UI/UX)
- **📚 Tech Stacks** - Stack-specific configurations (React, Laravel, Express, etc.)
- **🔌 Multi-Tool Support** - Works with Claude Code, OpenCode, Cursor, Antigravity

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-dev-system.git

# Navigate to the directory
cd ai-dev-system

# Initialize in your project
./scripts/init-project.sh --stack=react-typescript /path/to/your/project
```

### Available Stacks

| Stack | Description |
|-------|-------------|
| `react-typescript` | React with TypeScript, Vite, Testing Library |
| `php-laravel` | Laravel PHP framework |
| `node-express` | Express.js with TypeScript |

### Usage Examples

```bash
# Core only (no specific stack)
./scripts/init-project.sh /path/to/project

# With React TypeScript stack
./scripts/init-project.sh --stack=react-typescript /path/to/project

# With Laravel stack
./scripts/init-project.sh --stack=php-laravel /path/to/project

# With Express stack
./scripts/init-project.sh --stack=node-express /path/to/project
```

## Directory Structure

```
.ai/                           # Core content (Single Source of Truth)
├── agents/                    # AI agent definitions
│   ├── orchestrator.md        # Master coordinator
│   ├── oracle.md              # Architecture & debugging expert
│   ├── librarian.md           # Documentation specialist
│   ├── explorer.md            # Fast codebase exploration
│   ├── frontend-engineer.md   # Frontend development
│   ├── backend-engineer.md    # Backend development
│   └── tester.md              # Testing specialist
│
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
│   └── index.md               # Context navigation
│
├── skills/                    # Executable skill guides
│   ├── code-review/
│   ├── commit/
│   ├── debug/
│   ├── documentation/
│   ├── feature-implementation/
│   ├── refactor/
│   └── ui-ux/
│
├── templates/                 # File templates
│
└── stacks/                    # Technology stacks
    ├── react-typescript/
    ├── php-laravel/
    └── node-express/

.claude/                       # Claude Code bridge
.opencode/                     # OpenCode bridge
.cursor/                       # Cursor bridge
.agent/                        # Antigravity bridge
```

## Key Workflows

### Contract-Driven Development

Design contracts first, implement later:

1. **DBML** → Define database schema
2. **OpenAPI** → Define API specification
3. **Implement** → Build to contracts
4. **Test** → Verify against contracts

See: `.ai/context/core/workflows/contract-driven.md`

### BDD/TDD

Behavior-driven and test-driven development:

- **Frontend**: Component tests → Implementation → E2E tests
- **Backend**: Feature spec → Unit tests → Implementation → Integration tests

See: `.ai/context/core/workflows/bdd-tdd-frontend.md` and `bdd-tdd-backend.md`

## AI Tool Compatibility

| Tool | Bridge Directory | Status |
|------|-----------------|--------|
| Claude Code | `.claude/` | ✅ Supported |
| OpenCode | `.opencode/` | ✅ Supported |
| Cursor | `.cursor/` | ✅ Supported |
| Antigravity | `.agent/` | ✅ Supported |
| GitHub Copilot | `.github/` | 🔜 Planned |

## Customization

### Adding Project-Specific Context

Create files in `.ai/context/project/`:

```markdown
# .ai/context/project/project.md

## Project Overview
[Your project description]

## Tech Stack
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL

## Conventions
[Project-specific conventions]
```

### Adding Custom Skills

Create a new skill in `.ai/skills/your-skill/SKILL.md`:

```markdown
---
name: your-skill
description: What this skill does
triggers:
  - keyword1
  - keyword2
---

# Your Skill

## Workflow
...

## Checklist
...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.
