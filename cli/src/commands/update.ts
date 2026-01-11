import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { getSourceAiDir, getTargetAiDir, directoryExists } from '../utils/paths.js';
import { isValidStack } from '../utils/detector.js';

interface UpdateOptions {
  stack?: string;
  force?: boolean;
}

export async function update(options: UpdateOptions): Promise<void> {
  const targetDir = process.cwd();
  const sourceDir = getSourceAiDir();
  const targetAiDir = getTargetAiDir(targetDir);

  console.log(chalk.bold('\n🔄 Updating ai-dev-system\n'));

  // Check if .ai exists in target
  if (!(await directoryExists(targetAiDir))) {
    console.log(chalk.red('Error: .ai directory not found in current directory.'));
    console.log(chalk.gray('Run `ai-dev init` first to initialize the project.'));
    return;
  }

  // Directories to update
  const updateDirs = [
    { name: 'context', desc: 'Context files (standards, workflows)' },
    { name: 'skills', desc: 'Skills' },
    { name: 'agents', desc: 'Agents' }
  ];

  // Add stack-specific update if specified
  if (options.stack) {
    if (!isValidStack(options.stack)) {
      console.log(chalk.red(`Invalid stack: ${options.stack}`));
      console.log(chalk.gray('Available stacks: react-typescript, php-laravel, node-express'));
      return;
    }
    
    updateDirs.push({
      name: path.join('stacks', options.stack),
      desc: `Stack: ${options.stack}`
    });
  }

  let updatedCount = 0;
  let skippedCount = 0;

  for (const dir of updateDirs) {
    const spinner = ora(`Updating ${dir.desc}...`).start();
    
    const src = path.join(sourceDir, dir.name);
    const dest = path.join(targetAiDir, dir.name);

    try {
      if (!(await directoryExists(src))) {
        spinner.warn(`Source not found: ${dir.name}`);
        skippedCount++;
        continue;
      }

      // Get list of files to update
      const updates = await getUpdates(src, dest);
      
      if (updates.length === 0) {
        spinner.info(`${dir.desc}: Already up to date`);
        skippedCount++;
        continue;
      }

      // Copy updates
      for (const update of updates) {
        const srcFile = path.join(src, update);
        const destFile = path.join(dest, update);
        
        await fs.ensureDir(path.dirname(destFile));
        await fs.copy(srcFile, destFile, { overwrite: true });
      }

      spinner.succeed(`${dir.desc}: Updated ${updates.length} files`);
      updatedCount += updates.length;
      
    } catch (error) {
      spinner.fail(`Failed to update ${dir.desc}`);
      console.log(chalk.red(`  Error: ${error}`));
    }
  }

  // Summary
  console.log('');
  if (updatedCount > 0) {
    console.log(chalk.green(`✨ Updated ${updatedCount} files`));
  } else {
    console.log(chalk.gray('Everything is up to date!'));
  }
  console.log('');
}

/**
 * Get list of files that need updating
 */
async function getUpdates(srcDir: string, destDir: string): Promise<string[]> {
  const updates: string[] = [];
  
  async function scan(relativePath: string = '') {
    const srcPath = path.join(srcDir, relativePath);
    const destPath = path.join(destDir, relativePath);
    
    const entries = await fs.readdir(srcPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const relPath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        await scan(relPath);
      } else if (entry.isFile()) {
        const srcFile = path.join(srcDir, relPath);
        const destFile = path.join(destDir, relPath);
        
        // Check if dest file exists
        if (!(await fs.pathExists(destFile))) {
          updates.push(relPath);
          continue;
        }
        
        // Check if source is newer
        const srcStat = await fs.stat(srcFile);
        const destStat = await fs.stat(destFile);
        
        if (srcStat.mtime > destStat.mtime) {
          updates.push(relPath);
        }
      }
    }
  }
  
  await scan();
  return updates;
}
