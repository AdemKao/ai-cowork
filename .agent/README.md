# Antigravity Bridge

This directory provides Antigravity AI compatibility for the ai-dev-system.

## Structure

```
.agent/
├── workflows/       # Workflow files for Antigravity
└── README.md
```

## Core Content Location

All core content is maintained in `.ai/`:

- **Standards & Workflows**: `.ai/context/core/`
- **Skills**: `.ai/skills/`
- **Agents**: `.ai/agents/`
- **Templates**: `.ai/templates/`
- **Tech Stacks**: `.ai/stacks/`

## Usage

Create workflow files in `.agent/workflows/` that reference `.ai/` content.

Workflow files should follow Antigravity's format with YAML frontmatter:

```markdown
---
description: Workflow description
auto_execution_mode: 3
---

# Workflow Name

[Instructions that reference .ai/skills/... or .ai/context/...]
```
