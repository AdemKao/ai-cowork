import path from 'path';
import fs from 'fs-extra';
import { Stack, AI_BRIDGES, AITool, directoryExists } from './paths.js';

interface CopyOptions {
  stack?: Stack;
  aiTools: AITool[] | 'all';
  overwrite?: boolean;
}

interface CopyResult {
  success: boolean;
  copied: string[];
  skipped: string[];
  errors: string[];
}

/**
 * Copy .ai directory to target project
 */
export async function copyAiDirectory(
  sourceDir: string,
  targetDir: string,
  options: CopyOptions
): Promise<CopyResult> {
  const result: CopyResult = {
    success: true,
    copied: [],
    skipped: [],
    errors: []
  };

  const targetAiDir = path.join(targetDir, '.ai');

  try {
    // Check if .ai already exists
    if (await directoryExists(targetAiDir)) {
      if (!options.overwrite) {
        result.skipped.push('.ai (already exists, use --force to overwrite)');
        return result;
      }
    }

    // Copy core directories (always copy these)
    const coreDirs = ['context', 'skills', 'agents', 'templates'];
    
    for (const dir of coreDirs) {
      const src = path.join(sourceDir, dir);
      const dest = path.join(targetAiDir, dir);
      
      if (await directoryExists(src)) {
        await fs.copy(src, dest, { overwrite: options.overwrite });
        result.copied.push(`.ai/${dir}`);
      }
    }

    // Copy stack-specific files if stack is specified
    if (options.stack) {
      const stackSrc = path.join(sourceDir, 'stacks', options.stack);
      const stackDest = path.join(targetAiDir, 'stacks', options.stack);
      
      if (await directoryExists(stackSrc)) {
        await fs.copy(stackSrc, stackDest, { overwrite: options.overwrite });
        result.copied.push(`.ai/stacks/${options.stack}`);
      } else {
        result.errors.push(`Stack not found: ${options.stack}`);
      }
    } else {
      // Copy all stacks if no specific stack
      const stacksSrc = path.join(sourceDir, 'stacks');
      const stacksDest = path.join(targetAiDir, 'stacks');
      
      if (await directoryExists(stacksSrc)) {
        await fs.copy(stacksSrc, stacksDest, { overwrite: options.overwrite });
        result.copied.push('.ai/stacks');
      }
    }

  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : String(error));
  }

  return result;
}

/**
 * Create AI tool bridge directories
 */
export async function createBridges(
  targetDir: string,
  aiTools: AITool[] | 'all'
): Promise<CopyResult> {
  const result: CopyResult = {
    success: true,
    copied: [],
    skipped: [],
    errors: []
  };

  const tools = aiTools === 'all' 
    ? Object.keys(AI_BRIDGES) as AITool[]
    : aiTools;

  for (const tool of tools) {
    const bridgeDir = AI_BRIDGES[tool];
    const bridgePath = path.join(targetDir, bridgeDir);
    
    try {
      if (await directoryExists(bridgePath)) {
        result.skipped.push(`${bridgeDir} (already exists)`);
        continue;
      }

      await fs.ensureDir(bridgePath);
      
      // Create bridge README
      const readmePath = path.join(bridgePath, 'README.md');
      const readmeContent = generateBridgeReadme(tool);
      await fs.writeFile(readmePath, readmeContent);
      
      // Create tool-specific config files
      await createToolConfig(bridgePath, tool);
      
      result.copied.push(bridgeDir);
    } catch (error) {
      result.errors.push(`Failed to create ${bridgeDir}: ${error}`);
    }
  }

  return result;
}

/**
 * Generate bridge README content
 */
function generateBridgeReadme(tool: AITool): string {
  const toolNames: Record<AITool, string> = {
    claude: 'Claude Code',
    cursor: 'Cursor',
    opencode: 'OpenCode',
    agent: 'AI Agent'
  };

  return `# ${toolNames[tool]} Integration

This directory bridges ${toolNames[tool]} with the ai-dev-system.

## Setup

The context and standards are loaded from \`.ai/\` directory.

## Usage

See \`.ai/context/index.md\` for context loading rules.
`;
}

/**
 * Create tool-specific configuration files
 */
async function createToolConfig(bridgePath: string, tool: AITool): Promise<void> {
  switch (tool) {
    case 'claude':
      // Create CLAUDE.md
      await fs.writeFile(
        path.join(bridgePath, 'CLAUDE.md'),
        `# Claude Code Configuration

## Context Loading

Before starting any task, consult \`.ai/context/index.md\` for the appropriate context to load.

## Available Resources

- Standards: \`.ai/context/core/standards/\`
- Workflows: \`.ai/context/core/workflows/\`
- Skills: \`.ai/skills/\`
- Stacks: \`.ai/stacks/\`
`
      );
      break;
      
    case 'cursor':
      // Create .cursorrules
      await fs.writeFile(
        path.join(bridgePath, 'rules.md'),
        `# Cursor Rules

## Context Loading

Check \`.ai/context/index.md\` for routing table.
Load only the relevant context files for the current task.

## Stack Detection

- React/TypeScript: Check package.json for react
- Laravel: Check composer.json for laravel/framework
- Express: Check package.json for express
`
      );
      break;

    case 'opencode':
      // Create opencode config reference
      await fs.writeFile(
        path.join(bridgePath, 'config.md'),
        `# OpenCode Configuration

## Agent Prompt Addition

Add to your agent prompt:

\`\`\`
<context_loading>
Before executing tasks:
1. Read .ai/context/index.md for routing
2. Load ONLY files matching current task
3. Detect stack from project files before loading stack-specific content
4. Never load more than 3 context files at once
</context_loading>
\`\`\`
`
      );
      break;

    case 'agent':
      // Create agent integration guide
      await fs.writeFile(
        path.join(bridgePath, 'AGENT.md'),
        `# AI Agent Integration

## Context System

This project uses ai-dev-system for AI-assisted development.

## Loading Rules

1. Start with \`.ai/context/index.md\`
2. Load task-specific standards
3. Load stack-specific files when detected
4. Use skills for specific actions
`
      );
      break;
  }
}
