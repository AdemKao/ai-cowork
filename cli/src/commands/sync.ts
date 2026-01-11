import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { getSourceAiDir } from '../utils/paths.js';

// OpenCode skill format requires specific frontmatter
interface SkillFrontmatter {
  name: string;
  description: string;
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
}

/**
 * Convert .ai/skills/ to .opencode/skill/ format
 * OpenCode expects: .opencode/skill/<name>/SKILL.md with YAML frontmatter
 */
async function convertSkillToOpenCode(
  sourceSkillPath: string,
  targetDir: string,
  skillName: string
): Promise<void> {
  const sourceFile = path.join(sourceSkillPath, 'SKILL.md');
  if (!fs.existsSync(sourceFile)) return;

  const content = fs.readFileSync(sourceFile, 'utf-8');
  
  // Extract title and description from markdown
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const descMatch = content.match(/^>\s*(.+)$/m);
  
  const title = titleMatch ? titleMatch[1] : skillName;
  const description = descMatch ? descMatch[1] : `${title} skill`;

  // Create OpenCode compatible format with YAML frontmatter
  const openCodeContent = `---
name: ${skillName}
description: ${description}
license: MIT
compatibility: opencode
metadata:
  source: ai-dev-system
---

${content}
`;

  const targetSkillDir = path.join(targetDir, skillName);
  fs.mkdirSync(targetSkillDir, { recursive: true });
  fs.writeFileSync(path.join(targetSkillDir, 'SKILL.md'), openCodeContent);
}

/**
 * Convert .ai/agents/ to .opencode/agent/ format
 */
async function convertAgentToOpenCode(
  sourceAgentPath: string,
  targetDir: string,
  agentName: string
): Promise<void> {
  const content = fs.readFileSync(sourceAgentPath, 'utf-8');
  
  // Extract description from first line or heading
  const descMatch = content.match(/^#\s+(.+)$/m) || content.match(/^>\s*(.+)$/m);
  const description = descMatch ? descMatch[1] : `${agentName} agent`;

  // Create OpenCode agent format
  const openCodeContent = `---
description: ${description}
model: anthropic/claude-sonnet-4-5
---

${content}
`;

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, `${agentName}.md`), openCodeContent);
}

/**
 * Generate custom commands from skills
 */
async function generateCommands(
  sourceSkillsDir: string,
  targetCommandDir: string
): Promise<void> {
  if (!fs.existsSync(sourceSkillsDir)) return;
  
  fs.mkdirSync(targetCommandDir, { recursive: true });

  const skills = fs.readdirSync(sourceSkillsDir).filter(f => 
    fs.statSync(path.join(sourceSkillsDir, f)).isDirectory()
  );

  for (const skill of skills) {
    const skillFile = path.join(sourceSkillsDir, skill, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;

    const content = fs.readFileSync(skillFile, 'utf-8');
    const descMatch = content.match(/^>\s*(.+)$/m);
    const description = descMatch ? descMatch[1] : `Run ${skill} skill`;

    // Create command that invokes the skill
    const commandContent = `---
description: ${description}
agent: build
---

Load and execute the ${skill} skill for the current context.

Use the skill tool to load: skill({ name: "${skill}" })

Then follow the skill instructions to complete the task.

$ARGUMENTS
`;

    fs.writeFileSync(path.join(targetCommandDir, `${skill}.md`), commandContent);
  }
}

/**
 * Generate opencode.json config
 */
function generateOpenCodeConfig(targetDir: string, projectDir: string): void {
  const config = {
    "$schema": "https://opencode.ai/config.json",
    "theme": "opencode",
    "autoupdate": true,
    "share": "manual",
    "instructions": [
      ".ai/context/index.md"
    ],
    "permission": {
      "edit": "allow",
      "write": "allow",
      "bash": "allow",
      "skill": {
        "*": "allow"
      }
    },
    "compaction": {
      "auto": true,
      "prune": true
    },
    "formatter": {
      "prettier": {
        "disabled": false
      }
    }
  };

  fs.writeFileSync(
    path.join(projectDir, 'opencode.json'),
    JSON.stringify(config, null, 2)
  );
}

/**
 * Generate AGENTS.md for project context
 */
function generateAgentsMd(projectDir: string, projectName: string): void {
  const content = `# ${projectName}

## Project Overview

[Brief description of the project]

## Tech Stack

[List the main technologies used]

## Development Commands

\`\`\`bash
# Install dependencies
npm install  # or bun install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
\`\`\`

## Project Structure

\`\`\`
src/
├── components/    # UI components
├── lib/           # Utility functions
├── api/           # API routes/handlers
└── types/         # TypeScript types
\`\`\`

## Coding Standards

- Follow the standards in \`.ai/context/core/standards/\`
- Use conventional commits for git messages
- Write tests for new features

## Context Files

This project uses ai-dev-system for AI-assisted development:

- \`.ai/context/\` - Coding standards and workflows
- \`.ai/skills/\` - Reusable AI skills
- \`.ai/agents/\` - Specialized AI agents
- \`.ai/stacks/\` - Tech stack configurations

Load context with: \`@.ai/context/index.md\`
`;

  const agentsMdPath = path.join(projectDir, 'AGENTS.md');
  if (!fs.existsSync(agentsMdPath)) {
    fs.writeFileSync(agentsMdPath, content);
  }
}

/**
 * Generate OpenCode plugin template for ai-dev hooks
 */
function generatePluginTemplate(targetDir: string): void {
  const pluginDir = path.join(targetDir, 'plugin');
  fs.mkdirSync(pluginDir, { recursive: true });

  const pluginContent = `import type { Plugin } from "@opencode-ai/plugin"

/**
 * AI Dev System Plugin
 * 
 * Provides hooks for automatic context loading and protection.
 */
export const AiDevPlugin: Plugin = async ({ project, client, $, directory }) => {
  // Log plugin initialization
  await client.app.log({
    service: "ai-dev-plugin",
    level: "info",
    message: "AI Dev System plugin loaded",
  })

  return {
    // Auto-load context when session starts
    "session.created": async () => {
      await client.app.log({
        service: "ai-dev-plugin",
        level: "info",
        message: "Session created - context available at .ai/context/index.md",
      })
    },

    // Protect sensitive files
    "tool.execute.before": async (input, output) => {
      const protectedPatterns = [
        ".env",
        "credentials",
        "secrets",
        ".pem",
        ".key",
        "password",
      ]

      if (input.tool === "read") {
        const filePath = output.args.filePath?.toLowerCase() || ""
        for (const pattern of protectedPatterns) {
          if (filePath.includes(pattern)) {
            throw new Error(\`Protected file access denied: \${pattern}\`)
          }
        }
      }
    },

    // Notify on session completion (macOS)
    "session.idle": async () => {
      try {
        await $\`osascript -e 'display notification "Task completed!" with title "OpenCode"\`
      } catch {
        // Notification failed, ignore (non-macOS or permission issue)
      }
    },

    // Log file edits
    "file.edited": async ({ path }) => {
      await client.app.log({
        service: "ai-dev-plugin",
        level: "debug",
        message: \`File edited: \${path}\`,
      })
    },
  }
}
`;

  fs.writeFileSync(path.join(pluginDir, 'ai-dev-hooks.ts'), pluginContent);
}

/**
 * Main sync function for OpenCode
 */
async function syncOpenCode(projectDir: string): Promise<void> {
  const sourceAiDir = getSourceAiDir();
  const projectAiDir = path.join(projectDir, '.ai');
  const openCodeDir = path.join(projectDir, '.opencode');

  // Check if .ai exists in project
  const aiDir = fs.existsSync(projectAiDir) ? projectAiDir : sourceAiDir;
  
  console.log('🔄 Syncing to OpenCode format...\n');

  // 1. Create .opencode directory structure
  fs.mkdirSync(openCodeDir, { recursive: true });
  console.log('📁 Created .opencode/ directory');

  // 2. Convert skills
  const skillsDir = path.join(aiDir, 'skills');
  const targetSkillsDir = path.join(openCodeDir, 'skill');
  
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir).filter(f => 
      fs.statSync(path.join(skillsDir, f)).isDirectory()
    );
    
    for (const skill of skills) {
      await convertSkillToOpenCode(
        path.join(skillsDir, skill),
        targetSkillsDir,
        skill
      );
    }
    console.log(`✅ Converted ${skills.length} skills to .opencode/skill/`);
  }

  // 3. Convert agents
  const agentsDir = path.join(aiDir, 'agents');
  const targetAgentsDir = path.join(openCodeDir, 'agent');
  
  if (fs.existsSync(agentsDir)) {
    const agents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
    
    for (const agent of agents) {
      const agentName = agent.replace('.md', '');
      await convertAgentToOpenCode(
        path.join(agentsDir, agent),
        targetAgentsDir,
        agentName
      );
    }
    console.log(`✅ Converted ${agents.length} agents to .opencode/agent/`);
  }

  // 4. Generate commands from skills
  const targetCommandDir = path.join(openCodeDir, 'command');
  await generateCommands(skillsDir, targetCommandDir);
  console.log('✅ Generated commands in .opencode/command/');

  // 5. Generate plugin template
  generatePluginTemplate(openCodeDir);
  console.log('✅ Created plugin template .opencode/plugin/ai-dev-hooks.ts');

  // 6. Generate opencode.json
  generateOpenCodeConfig(openCodeDir, projectDir);
  console.log('✅ Generated opencode.json');

  // 7. Generate AGENTS.md if not exists
  const projectName = path.basename(projectDir);
  generateAgentsMd(projectDir, projectName);
  console.log('✅ Generated AGENTS.md');

  console.log('\n🎉 OpenCode sync complete!\n');
  console.log('Generated structure:');
  console.log('  .opencode/');
  console.log('  ├── skill/        # Converted skills');
  console.log('  ├── agent/        # Converted agents');
  console.log('  ├── command/      # Generated commands');
  console.log('  └── plugin/       # Hook templates');
  console.log('  opencode.json     # Configuration');
  console.log('  AGENTS.md         # Project context');
  console.log('\nRun `opencode` to start using!');
}

/**
 * Main sync function for Claude Code
 */
async function syncClaude(projectDir: string): Promise<void> {
  const sourceAiDir = getSourceAiDir();
  const projectAiDir = path.join(projectDir, '.ai');
  const claudeDir = path.join(projectDir, '.claude');

  const aiDir = fs.existsSync(projectAiDir) ? projectAiDir : sourceAiDir;
  
  console.log('🔄 Syncing to Claude Code format...\n');

  // 1. Create .claude directory structure
  fs.mkdirSync(path.join(claudeDir, 'commands'), { recursive: true });
  fs.mkdirSync(path.join(claudeDir, 'skills'), { recursive: true });
  console.log('📁 Created .claude/ directory');

  // 2. Copy skills (Claude also supports Agent Skills format)
  const skillsDir = path.join(aiDir, 'skills');
  const targetSkillsDir = path.join(claudeDir, 'skills');
  
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir).filter(f => 
      fs.statSync(path.join(skillsDir, f)).isDirectory()
    );
    
    for (const skill of skills) {
      await convertSkillToOpenCode(
        path.join(skillsDir, skill),
        targetSkillsDir,
        skill
      );
    }
    console.log(`✅ Converted ${skills.length} skills to .claude/skills/`);
  }

  // 3. Generate commands
  await generateCommands(skillsDir, path.join(claudeDir, 'commands'));
  console.log('✅ Generated commands in .claude/commands/');

  // 4. Generate CLAUDE.md
  const projectName = path.basename(projectDir);
  const claudeMdContent = `# ${projectName}

## Project Overview

[Brief description of the project]

## Tech Stack

[List the main technologies used]

## Development Commands

\`\`\`bash
npm install && npm run dev
\`\`\`

## Context

This project uses ai-dev-system. Load context from:
- \`.ai/context/index.md\` - Main context index
- \`.ai/stacks/\` - Tech stack standards

## Skills

Custom skills are available in \`.claude/skills/\`:
${fs.existsSync(skillsDir) ? fs.readdirSync(skillsDir).filter(f => 
  fs.statSync(path.join(skillsDir, f)).isDirectory()
).map(s => `- ${s}`).join('\n') : '- (none)'}
`;

  const claudeMdPath = path.join(projectDir, 'CLAUDE.md');
  if (!fs.existsSync(claudeMdPath)) {
    fs.writeFileSync(claudeMdPath, claudeMdContent);
    console.log('✅ Generated CLAUDE.md');
  }

  console.log('\n🎉 Claude Code sync complete!\n');
}

/**
 * Register sync command
 */
export function registerSyncCommand(program: Command): void {
  const sync = program
    .command('sync')
    .description('Sync ai-dev-system to AI tool formats');

  sync
    .command('opencode')
    .description('Generate .opencode/ configuration for OpenCode')
    .option('-d, --dir <path>', 'Target project directory', process.cwd())
    .action(async (options) => {
      await syncOpenCode(options.dir);
    });

  sync
    .command('claude')
    .description('Generate .claude/ configuration for Claude Code')
    .option('-d, --dir <path>', 'Target project directory', process.cwd())
    .action(async (options) => {
      await syncClaude(options.dir);
    });

  sync
    .command('all')
    .description('Sync to all supported AI tools')
    .option('-d, --dir <path>', 'Target project directory', process.cwd())
    .action(async (options) => {
      await syncOpenCode(options.dir);
      console.log('\n---\n');
      await syncClaude(options.dir);
    });
}
