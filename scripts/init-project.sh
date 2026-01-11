#!/bin/bash

# ai-dev-system initialization script
# Usage: ./init-project.sh [--stack=<stack-name>] [target-dir]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory (where ai-dev-system is located)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Default values
STACK=""
TARGET_DIR="."

# Parse arguments
for arg in "$@"; do
  case $arg in
    --stack=*)
      STACK="${arg#*=}"
      shift
      ;;
    --help|-h)
      echo "Usage: ./init-project.sh [--stack=<stack-name>] [target-dir]"
      echo ""
      echo "Options:"
      echo "  --stack=<name>   Technology stack to include (react-typescript, php-laravel, node-express)"
      echo "  target-dir       Target directory (default: current directory)"
      echo ""
      echo "Examples:"
      echo "  ./init-project.sh"
      echo "  ./init-project.sh --stack=php-laravel /path/to/project"
      echo "  ./init-project.sh --stack=react-typescript ."
      exit 0
      ;;
    *)
      TARGET_DIR="$arg"
      ;;
  esac
done

# Resolve target directory
TARGET_DIR="$(cd "$TARGET_DIR" 2>/dev/null && pwd || mkdir -p "$TARGET_DIR" && cd "$TARGET_DIR" && pwd)"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        ai-dev-system Initializer       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Source:${NC} $SCRIPT_DIR"
echo -e "${GREEN}Target:${NC} $TARGET_DIR"
echo -e "${GREEN}Stack:${NC}  ${STACK:-"(none - core only)"}"
echo ""

# Check if .ai already exists
if [ -d "$TARGET_DIR/.ai" ]; then
  echo -e "${YELLOW}Warning: .ai directory already exists in target.${NC}"
  read -p "Overwrite? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Aborted.${NC}"
    exit 1
  fi
fi

# Create directories
echo -e "${BLUE}Creating directory structure...${NC}"
mkdir -p "$TARGET_DIR/.ai/context/core/standards"
mkdir -p "$TARGET_DIR/.ai/context/core/workflows"
mkdir -p "$TARGET_DIR/.ai/context/project"
mkdir -p "$TARGET_DIR/.ai/agents"
mkdir -p "$TARGET_DIR/.ai/skills"
mkdir -p "$TARGET_DIR/.ai/templates"
mkdir -p "$TARGET_DIR/.ai/stacks"

# Copy core files
echo -e "${BLUE}Copying core files...${NC}"

# Context - Standards
cp -r "$SCRIPT_DIR/.ai/context/core/standards/"* "$TARGET_DIR/.ai/context/core/standards/"

# Context - Workflows
cp -r "$SCRIPT_DIR/.ai/context/core/workflows/"* "$TARGET_DIR/.ai/context/core/workflows/"

# Context index
cp "$SCRIPT_DIR/.ai/context/index.md" "$TARGET_DIR/.ai/context/"

# Agents
cp -r "$SCRIPT_DIR/.ai/agents/"* "$TARGET_DIR/.ai/agents/"

# Skills (core)
cp -r "$SCRIPT_DIR/.ai/skills/"* "$TARGET_DIR/.ai/skills/"

# Templates
cp -r "$SCRIPT_DIR/.ai/templates/"* "$TARGET_DIR/.ai/templates/"

# Copy stack-specific files
if [ -n "$STACK" ]; then
  if [ -d "$SCRIPT_DIR/.ai/stacks/$STACK" ]; then
    echo -e "${BLUE}Copying $STACK stack...${NC}"
    mkdir -p "$TARGET_DIR/.ai/stacks/$STACK"
    cp -r "$SCRIPT_DIR/.ai/stacks/$STACK/"* "$TARGET_DIR/.ai/stacks/$STACK/"
  else
    echo -e "${RED}Error: Stack '$STACK' not found.${NC}"
    echo "Available stacks:"
    ls -1 "$SCRIPT_DIR/.ai/stacks/"
    exit 1
  fi
fi

# Create bridge directories
echo -e "${BLUE}Creating bridge directories...${NC}"

# .claude
mkdir -p "$TARGET_DIR/.claude"
cat > "$TARGET_DIR/.claude/README.md" << 'EOF'
# Claude Code Bridge

Core content is in `.ai/` directory.

See `.ai/context/index.md` for available standards, workflows, and skills.
EOF

# .opencode
mkdir -p "$TARGET_DIR/.opencode"
cat > "$TARGET_DIR/.opencode/README.md" << 'EOF'
# OpenCode Bridge

Core content is in `.ai/` directory.

See `.ai/context/index.md` for available standards, workflows, and skills.
EOF

# .cursor
mkdir -p "$TARGET_DIR/.cursor/commands"
cat > "$TARGET_DIR/.cursor/README.md" << 'EOF'
# Cursor Bridge

Core content is in `.ai/` directory.

See `.ai/context/index.md` for available standards, workflows, and skills.
EOF

# .agent (Antigravity)
mkdir -p "$TARGET_DIR/.agent/workflows"
cat > "$TARGET_DIR/.agent/README.md" << 'EOF'
# Antigravity Bridge

Core content is in `.ai/` directory.

See `.ai/context/index.md` for available standards, workflows, and skills.
EOF

# Create project context placeholder
cat > "$TARGET_DIR/.ai/context/project/README.md" << 'EOF'
# Project Context

Add project-specific context files here:

- `project.md` - Project overview, goals, constraints
- `architecture.md` - System architecture decisions
- `team.md` - Team conventions, preferences
- `glossary.md` - Domain-specific terminology

These files will be loaded automatically for project-specific guidance.
EOF

# Summary
echo ""
echo -e "${GREEN}✅ Initialization complete!${NC}"
echo ""
echo "Created structure:"
echo ""
find "$TARGET_DIR/.ai" -type d | sed "s|$TARGET_DIR/||" | head -20
echo "  ..."
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Review .ai/context/index.md for available resources"
echo "2. Add project-specific context to .ai/context/project/"
echo "3. Customize agents/skills as needed"
echo ""
if [ -n "$STACK" ]; then
  echo -e "${GREEN}Stack '$STACK' installed.${NC}"
  echo "Check .ai/stacks/$STACK/ for stack-specific standards and skills."
fi
