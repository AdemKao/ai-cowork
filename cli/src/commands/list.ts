import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { getSourceAiDir, AVAILABLE_STACKS } from '../utils/paths.js';

interface ListOptions {
  type?: 'stacks' | 'skills' | 'agents' | 'workflows' | 'standards';
}

interface ResourceInfo {
  name: string;
  description: string;
  path: string;
}

export async function list(options: ListOptions): Promise<void> {
  const sourceDir = getSourceAiDir();
  
  console.log(chalk.bold('\n📋 ai-dev-system Resources\n'));

  const types = options.type 
    ? [options.type] 
    : ['stacks', 'skills', 'agents', 'workflows', 'standards'];

  for (const type of types) {
    await listResourceType(sourceDir, type as NonNullable<ListOptions['type']>);
  }
}

async function listResourceType(
  sourceDir: string, 
  type: NonNullable<ListOptions['type']>
): Promise<void> {
  const resources = await getResources(sourceDir, type);
  
  if (resources.length === 0) {
    return;
  }

  const icons: Record<string, string> = {
    stacks: '📦',
    skills: '⚡',
    agents: '🤖',
    workflows: '🔄',
    standards: '📐'
  };

  console.log(chalk.cyan(`${icons[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}`));
  console.log(chalk.gray('─'.repeat(40)));
  
  for (const resource of resources) {
    console.log(`  ${chalk.white(resource.name)}`);
    if (resource.description) {
      console.log(chalk.gray(`    ${resource.description}`));
    }
  }
  console.log('');
}

async function getResources(
  sourceDir: string, 
  type: NonNullable<ListOptions['type']>
): Promise<ResourceInfo[]> {
  const resources: ResourceInfo[] = [];

  switch (type) {
    case 'stacks': {
      const stacksDir = path.join(sourceDir, 'stacks');
      if (await fs.pathExists(stacksDir)) {
        const stacks = await fs.readdir(stacksDir);
        for (const stack of stacks) {
          const stackJsonPath = path.join(stacksDir, stack, 'stack.json');
          let description = '';
          
          if (await fs.pathExists(stackJsonPath)) {
            try {
              const stackJson = await fs.readJson(stackJsonPath);
              description = stackJson.description || '';
            } catch {
              // Ignore
            }
          }
          
          resources.push({
            name: stack,
            description,
            path: path.join(stacksDir, stack)
          });
        }
      }
      break;
    }

    case 'skills': {
      const skillsDir = path.join(sourceDir, 'skills');
      if (await fs.pathExists(skillsDir)) {
        const skills = await fs.readdir(skillsDir);
        for (const skill of skills) {
          const skillPath = path.join(skillsDir, skill, 'SKILL.md');
          let description = '';
          
          if (await fs.pathExists(skillPath)) {
            try {
              const content = await fs.readFile(skillPath, 'utf-8');
              // Extract first line after # heading
              const match = content.match(/^#[^\n]+\n+>?\s*([^\n]+)/);
              if (match) {
                description = match[1].replace(/^>\s*/, '');
              }
            } catch {
              // Ignore
            }
          }
          
          resources.push({
            name: skill,
            description,
            path: skillPath
          });
        }
      }
      break;
    }

    case 'agents': {
      const agentsDir = path.join(sourceDir, 'agents');
      if (await fs.pathExists(agentsDir)) {
        const agents = await fs.readdir(agentsDir);
        for (const agent of agents) {
          if (!agent.endsWith('.md')) continue;
          
          const agentPath = path.join(agentsDir, agent);
          let description = '';
          
          try {
            const content = await fs.readFile(agentPath, 'utf-8');
            const match = content.match(/^#[^\n]+\n+>?\s*([^\n]+)/);
            if (match) {
              description = match[1].replace(/^>\s*/, '');
            }
          } catch {
            // Ignore
          }
          
          resources.push({
            name: agent.replace('.md', ''),
            description,
            path: agentPath
          });
        }
      }
      break;
    }

    case 'workflows': {
      const workflowsDir = path.join(sourceDir, 'context', 'core', 'workflows');
      if (await fs.pathExists(workflowsDir)) {
        const workflows = await fs.readdir(workflowsDir);
        for (const workflow of workflows) {
          if (!workflow.endsWith('.md')) continue;
          
          const workflowPath = path.join(workflowsDir, workflow);
          let description = '';
          
          try {
            const content = await fs.readFile(workflowPath, 'utf-8');
            const match = content.match(/^#[^\n]+\n+>?\s*([^\n]+)/);
            if (match) {
              description = match[1].replace(/^>\s*/, '');
            }
          } catch {
            // Ignore
          }
          
          resources.push({
            name: workflow.replace('.md', ''),
            description,
            path: workflowPath
          });
        }
      }
      break;
    }

    case 'standards': {
      const standardsDir = path.join(sourceDir, 'context', 'core', 'standards');
      if (await fs.pathExists(standardsDir)) {
        const standards = await fs.readdir(standardsDir);
        for (const standard of standards) {
          if (!standard.endsWith('.md')) continue;
          
          const standardPath = path.join(standardsDir, standard);
          let description = '';
          
          try {
            const content = await fs.readFile(standardPath, 'utf-8');
            const match = content.match(/^#[^\n]+\n+>?\s*([^\n]+)/);
            if (match) {
              description = match[1].replace(/^>\s*/, '');
            }
          } catch {
            // Ignore
          }
          
          resources.push({
            name: standard.replace('.md', ''),
            description,
            path: standardPath
          });
        }
      }
      break;
    }
  }

  return resources;
}
