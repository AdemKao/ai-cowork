# OpenCode Bridge

This directory provides OpenCode compatibility for the ai-dev-system.

## Structure

```
.opencode/
├── context/         # Context files for OpenCode
│   └── -> ../.ai/context/  (symlink or reference)
└── README.md
```

## Core Content Location

All core content is maintained in `.ai/`:

- **Standards & Workflows**: `.ai/context/core/`
- **Skills**: `.ai/skills/`
- **Agents**: `.ai/agents/`
- **Templates**: `.ai/templates/`
- **Tech Stacks**: `.ai/stacks/`

## Configuration

In your `opencode.json`, reference the `.ai/` directory:

```json
{
  "context": {
    "standards": ".ai/context/core/standards",
    "workflows": ".ai/context/core/workflows"
  },
  "skills": ".ai/skills",
  "agents": ".ai/agents"
}
```

## Compatibility with ohmyopencode

This structure aligns with ohmyopencode conventions:

| ohmyopencode | ai-dev-system |
|--------------|---------------|
| `~/.opencode/context/core/standards/` | `.ai/context/core/standards/` |
| `~/.opencode/context/core/workflows/` | `.ai/context/core/workflows/` |
| `~/.opencode/skill/` | `.ai/skills/` |
| `~/.opencode/agent/` | `.ai/agents/` |
