# Claude Code Bridge

This directory provides Claude Code compatibility for the ai-dev-system.

## Structure

```
.claude/
├── skills/          # Skills for Claude Code (symlinks or copies from .ai/skills/)
├── agents/          # Agents for Claude Code (symlinks or copies from .ai/agents/)
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

Claude Code will automatically detect skills in `.claude/skills/`.

To sync with `.ai/` content:

```bash
# Option 1: Symlinks (recommended for development)
ln -sf ../../.ai/skills/* .claude/skills/
ln -sf ../../.ai/agents/* .claude/agents/

# Option 2: Copy (for distribution)
cp -r .ai/skills/* .claude/skills/
cp -r .ai/agents/* .claude/agents/
```
