<h1 align="center">🤖 ai-cowork</h1>

<p align="center">
  <strong>Portable AI Development Workflow System</strong><br>
  <em>Integrate AI coding assistants into your development workflow across any tech stack</em>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT">
  </a>
  <a href="https://opencode.ai">
    <img src="https://img.shields.io/badge/OpenCode-ready-purple?style=flat-square" alt="OpenCode">
  </a>
  <a href="https://claude.ai">
    <img src="https://img.shields.io/badge/Claude%20Code-ready-green?style=flat-square" alt="Claude Code">
  </a>
  <a href="https://cursor.sh">
    <img src="https://img.shields.io/badge/Cursor-ready-blue?style=flat-square" alt="Cursor">
  </a>
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#cli-commands">CLI</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <a href="./README.zh-TW.md">繁體中文</a>
</p>

---

## Why ai-cowork?

Modern developers use AI coding assistants daily, but face common challenges:

- **Inconsistent AI behavior** across different projects
- **Lost context** when switching between codebases  
- **Repeated prompting** for the same tasks
- **No standard workflow** for AI-assisted development

**ai-cowork** solves this by providing a **portable, standardized AI workflow** that travels with you across projects and AI tools.

### What it provides:

- 🧠 **Smart Context Loading** - AI loads only relevant context per task (saves tokens!)
- 🎯 **Consistent AI Context** - Your coding standards, patterns, and preferences follow every project
- 📚 **Reusable Skills** - Pre-built prompts for code review, debugging, refactoring, and more
- 🏗️ **Stack Templates** - Language/framework-specific standards (React, Laravel, Node.js, etc.)
- 🔄 **AI Tool Sync** - One config, multiple AI tools (OpenCode, Claude Code, Cursor)
- ⚡ **Keyword Triggers** - Say "ultrawork" to enable full orchestration mode
- 🔧 **Extensible** - Create custom skills and stacks for your workflow

Perfect for **freelancers**, **consultants**, and **teams** working across multiple tech stacks.

## Features

- ✅ **Smart Loading (v2)** - AI loads only relevant context, saving tokens
- ✅ **Conditional Rules** - Rules auto-apply based on file types
- ✅ **Keyword Triggers** - "ultrawork", "review", "test" activate modes
- ✅ **Multi-Stack Support** - React, Laravel, Node.js, and more (Python, Go, Rust coming soon)
- ✅ **AI Tool Agnostic** - Works with OpenCode, Claude Code, Cursor
- ✅ **Portable Workflows** - Take your AI development patterns across projects
- ✅ **CLI Tool** - Easy project initialization and sync
- ✅ **Extensible** - Create custom stacks, skills, and agents

## Installation

### Using npm (Recommended)

```bash
# Install globally
npm install -g @happytools/ai-cowork

# Or run directly with npx
npx @happytools/ai-cowork init
```

### Using Bun

```bash
bun install -g @happytools/ai-cowork
```

### From Source

```bash
git clone https://github.com/AdemKao/ai-cowork.git
cd ai-cowork/cli
npm install
npm link
```

## Quick Start

### 1. Initialize a Project

```bash
# Navigate to your project
cd your-project

# Initialize with ai-cowork
ai-cowork init

# Or specify a stack
ai-cowork init --stack react-typescript

# Skip prompts (use defaults)
ai-cowork init --yes
```

This creates a `.ai/` directory with:

```
.ai/
├── CONTEXT.md        # Entry point (always loaded)
├── config.json       # Configuration
├── rules/            # Conditional rules (auto-applied)
├── commands/         # Custom slash commands
├── context/          # Coding standards and workflows
├── skills/           # Reusable AI skills
├── agents/           # Specialized AI agents
└── stacks/           # Tech stack configurations
```

### 2. Sync to Your AI Tool

```bash
# Sync to OpenCode
ai-cowork sync opencode

# Sync to Claude Code
ai-cowork sync claude

# Sync to all supported tools
ai-cowork sync all
```

### 3. Start Coding with AI

In OpenCode or Claude Code, use your skills:

```
/code-review     # Run code review skill
/debug           # Run debug skill
/commit          # Generate commit message
/notify          # Send notification when task completes
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `ai-cowork init` | Initialize ai-cowork in a project |
| `ai-cowork init --stack <name>` | Initialize with specific stack |
| `ai-cowork init --yes` | Initialize with defaults (skip prompts) |
| `ai-cowork list` | List available stacks, skills, and agents |
| `ai-cowork add stack <name>` | Add a tech stack to your project |
| `ai-cowork add skill <name>` | Add a skill to your project |
| `ai-cowork sync opencode` | Generate OpenCode configuration |
| `ai-cowork sync claude` | Generate Claude Code configuration |
| `ai-cowork sync all` | Sync to all AI tools |
| `ai-cowork upgrade` | Upgrade to v2 with smart loading |
| `ai-cowork status` | Show current version and structure |
| `ai-cowork update` | Update ai-cowork |

## Available Stacks

| Stack | Description | Status |
|-------|-------------|--------|
| `react-typescript` | React + TypeScript + Vite | ✅ Available |
| `php-laravel` | PHP + Laravel | ✅ Available |
| `node-express` | Node.js + Express | ✅ Available |
| `python-fastapi` | Python + FastAPI | 🔜 Coming Soon |
| `go-fiber` | Go + Fiber | 🔜 Coming Soon |
| `rust-axum` | Rust + Axum | 🔜 Coming Soon |

## Available Skills

| Skill | Description |
|-------|-------------|
| `code-review` | Comprehensive code review with checklist |
| `debug` | Systematic debugging approach |
| `commit` | Generate conventional commit messages |
| `refactor` | Code refactoring guidance |
| `documentation` | Documentation generation |
| `feature-implementation` | Feature planning and implementation |
| `feature-decompose` | Break down large features into stacked PRs |
| `worktree-agent` | Parallel development with git worktrees |
| `notify` | Send notifications (Telegram, Desktop) when tasks complete |
| `ui-ux` | UI/UX development guidelines |

## Project Structure

```
ai-cowork/
├── .ai/
│   ├── CONTEXT.md         ← Entry point (always loaded)
│   ├── config.json        ← Configuration
│   ├── rules/             ← Conditional rules (auto-applied)
│   ├── commands/          ← Custom slash commands
│   ├── context/           # Core standards and workflows
│   │   ├── core/
│   │   │   ├── standards/ # Code quality, naming, security
│   │   │   └── workflows/ # BDD/TDD, code review, git
│   │   └── index.md       # Context routing table
│   ├── skills/            # Reusable AI skills
│   ├── agents/            # Specialized AI agents
│   ├── stacks/            # Tech stack templates
│   └── templates/         # Project templates
├── cli/                   # CLI tool source
└── docs/                  # Documentation
```

## Smart Loading (v2)

ai-cowork v2 introduces **Smart Context Loading** - AI agents load only relevant context per task.

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Context Loading Levels                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Level 0: Always Load (< 1KB)                               │
│  └── CONTEXT.md (project overview + loading instructions)  │
│                                                             │
│  Level 1: Auto-Apply by File Type                           │
│  └── rules/*.md (TypeScript, Testing, API, Docs rules)     │
│                                                             │
│  Level 2: Load on Demand                                    │
│  └── standards/, workflows/ (per Quick Route table)        │
│                                                             │
│  Level 3: Triggered Loading                                 │
│  └── skills/, agents/ (when explicitly invoked)            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Conditional Rules

Rules in `.ai/rules/` auto-apply based on file patterns:

```yaml
# .ai/rules/typescript.md
---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---
# TypeScript-specific rules here...
```

### Keyword Triggers

Use keywords in your prompt to auto-load relevant context:

| Keyword | Effect |
|---------|--------|
| `ultrawork` / `ulw` | Enable full orchestration mode |
| `review` | Load code review workflow |
| `test` | Load testing workflow |
| `refactor` | Load refactoring skill |

### Token Budget

| Task Complexity | Max Context | Example |
|-----------------|-------------|---------|
| Simple | ~5KB | Fix typo |
| Medium | ~10KB | New component |
| Complex | ~15KB | New feature |
| Major | ~20KB | Architecture change |

## AI Tool Integration

### OpenCode

After running `ai-cowork sync opencode`:

```
.opencode/
├── skill/          # Skills in OpenCode format
├── agent/          # Agents in OpenCode format
├── command/        # Custom commands
└── plugin/         # Hooks and plugins
opencode.json       # Configuration
AGENTS.md           # Project context
```

### Claude Code

After running `ai-cowork sync claude`:

```
.claude/
├── skills/         # Skills in Claude format
├── rules/          # Conditional rules
├── commands/       # Slash commands
└── agents/         # Custom agents
CLAUDE.md           # Project context
```

## Key Workflows

### Contract-Driven Development

Design contracts first, implement later:

1. **DBML** → Define database schema
2. **OpenAPI** → Define API specification
3. **Implement** → Build to contracts
4. **Test** → Verify against contracts

### BDD/TDD

Behavior-driven and test-driven development:

- **Frontend**: Component tests → Implementation → E2E tests
- **Backend**: Feature spec → Unit tests → Implementation → Integration tests

### Stacked Development

For large features, use stacked PRs:

1. **Decompose** → Break feature into small, reviewable chunks
2. **Stack** → Create dependent branches
3. **Review** → Review each PR independently
4. **Merge** → Merge bottom-up

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Project                            │
├─────────────────────────────────────────────────────────────┤
│  .ai/                                                       │
│  ├── context/        ← Coding standards & workflows         │
│  ├── skills/         ← Reusable AI prompts                  │
│  ├── agents/         ← Specialized AI agents                │
│  └── stacks/         ← Tech stack configs                   │
├─────────────────────────────────────────────────────────────┤
│                    ai-cowork sync                           │
├──────────────┬──────────────┬───────────────────────────────┤
│  .opencode/  │   .claude/   │        (other tools)          │
│  OpenCode    │  Claude Code │         Cursor, etc.          │
└──────────────┴──────────────┴───────────────────────────────┘
```

1. **Initialize** - `ai-cowork init` creates `.ai/` with standards and skills
2. **Customize** - Add your stack, modify standards to fit your workflow
3. **Sync** - `ai-cowork sync opencode` generates tool-specific configs
4. **Code** - Your AI assistant now follows your standards automatically

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

```bash
# Clone the repository
git clone https://github.com/AdemKao/ai-cowork.git
cd ai-cowork

# Install CLI dependencies
cd cli && npm install

# Run in development mode
npm run dev -- --help
```

## License

[MIT](./LICENSE)

---

<p align="center">
  Made with ❤️ for developers who code with AI
</p>
