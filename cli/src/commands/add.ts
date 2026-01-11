import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { getSourceAiDir, getTargetAiDir, directoryExists, AVAILABLE_STACKS } from '../utils/paths.js';
import { isValidStack } from '../utils/detector.js';

type AddType = 'stack' | 'skill';

export async function add(type: string, name: string): Promise<void> {
  const targetDir = process.cwd();
  const sourceDir = getSourceAiDir();
  const targetAiDir = getTargetAiDir(targetDir);

  console.log(chalk.bold(`\n➕ Adding ${type}: ${name}\n`));

  // Check if .ai exists
  if (!(await directoryExists(targetAiDir))) {
    console.log(chalk.red('Error: .ai directory not found.'));
    console.log(chalk.gray('Run `ai-dev init` first to initialize the project.'));
    return;
  }

  // Validate type
  if (type !== 'stack' && type !== 'skill') {
    console.log(chalk.red(`Invalid type: ${type}`));
    console.log(chalk.gray('Valid types: stack, skill'));
    return;
  }

  const spinner = ora(`Adding ${type}...`).start();

  try {
    if (type === 'stack') {
      await addStack(sourceDir, targetAiDir, name, spinner);
    } else {
      await addSkill(sourceDir, targetAiDir, name, spinner);
    }
  } catch (error) {
    spinner.fail(`Failed to add ${type}`);
    console.log(chalk.red(`  Error: ${error}`));
  }
}

async function addStack(
  sourceDir: string,
  targetAiDir: string,
  name: string,
  spinner: ReturnType<typeof ora>
): Promise<void> {
  // Validate stack name
  if (!isValidStack(name)) {
    spinner.fail(`Invalid stack: ${name}`);
    console.log(chalk.gray(`Available stacks: ${AVAILABLE_STACKS.join(', ')}`));
    return;
  }

  const srcPath = path.join(sourceDir, 'stacks', name);
  const destPath = path.join(targetAiDir, 'stacks', name);

  // Check if source exists
  if (!(await directoryExists(srcPath))) {
    spinner.fail(`Stack not found in source: ${name}`);
    return;
  }

  // Check if already exists
  if (await directoryExists(destPath)) {
    spinner.warn(`Stack already exists: ${name}`);
    console.log(chalk.gray('  Use `ai-dev update --stack ' + name + '` to update'));
    return;
  }

  // Copy stack
  await fs.copy(srcPath, destPath);
  
  spinner.succeed(`Added stack: ${chalk.cyan(name)}`);
  console.log(chalk.gray(`  Location: .ai/stacks/${name}/`));
  
  // Show what was added
  const items = await fs.readdir(destPath);
  console.log(chalk.gray('  Contents:'));
  for (const item of items) {
    console.log(chalk.gray(`    - ${item}`));
  }
}

async function addSkill(
  sourceDir: string,
  targetAiDir: string,
  name: string,
  spinner: ReturnType<typeof ora>
): Promise<void> {
  // Check for skill in main skills directory
  let srcPath = path.join(sourceDir, 'skills', name);
  let destPath = path.join(targetAiDir, 'skills', name);
  
  // If not found, check in stack skills
  if (!(await directoryExists(srcPath))) {
    // Try to find in stacks
    const stacks = await fs.readdir(path.join(sourceDir, 'stacks'));
    
    for (const stack of stacks) {
      const stackSkillPath = path.join(sourceDir, 'stacks', stack, 'skills', name);
      if (await directoryExists(stackSkillPath)) {
        srcPath = stackSkillPath;
        destPath = path.join(targetAiDir, 'stacks', stack, 'skills', name);
        break;
      }
    }
  }

  // Check if source exists
  if (!(await directoryExists(srcPath))) {
    spinner.fail(`Skill not found: ${name}`);
    
    // List available skills
    console.log(chalk.gray('\nAvailable skills:'));
    
    const mainSkills = await fs.readdir(path.join(sourceDir, 'skills')).catch(() => []);
    if (mainSkills.length > 0) {
      console.log(chalk.gray('  Core skills:'));
      mainSkills.forEach(s => console.log(chalk.gray(`    - ${s}`)));
    }
    
    // List stack skills
    const stacks = await fs.readdir(path.join(sourceDir, 'stacks')).catch(() => []);
    for (const stack of stacks) {
      const stackSkillsDir = path.join(sourceDir, 'stacks', stack, 'skills');
      if (await directoryExists(stackSkillsDir)) {
        const stackSkills = await fs.readdir(stackSkillsDir);
        if (stackSkills.length > 0) {
          console.log(chalk.gray(`  ${stack} skills:`));
          stackSkills.forEach(s => console.log(chalk.gray(`    - ${s}`)));
        }
      }
    }
    
    return;
  }

  // Check if already exists
  if (await directoryExists(destPath)) {
    spinner.warn(`Skill already exists: ${name}`);
    return;
  }

  // Copy skill
  await fs.ensureDir(path.dirname(destPath));
  await fs.copy(srcPath, destPath);
  
  spinner.succeed(`Added skill: ${chalk.cyan(name)}`);
  console.log(chalk.gray(`  Location: ${path.relative(process.cwd(), destPath)}/`));
}
