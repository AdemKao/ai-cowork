# Cursor Bridge

This directory provides Cursor AI compatibility for the ai-dev-system.

## Structure

```
.cursor/
├── commands/        # Slash commands for Cursor
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

Create command files in `.cursor/commands/` that reference `.ai/` content:

```markdown
# my-command

[Instructions that reference .ai/skills/... or .ai/context/...]
```

## Example Command

```markdown
# code-review

Follow the code review process defined in `.ai/context/core/workflows/code-review.md`.
Use the checklist from `.ai/skills/code-review/SKILL.md`.
```
