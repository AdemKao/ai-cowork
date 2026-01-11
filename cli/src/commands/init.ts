import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getSourceAiDir, AITool, AI_BRIDGES, Stack } from '../utils/paths.js';
import { detectStack, isValidStack } from '../utils/detector.js';
import { copyAiDirectory, createBridges } from '../utils/copy.js';

interface InitOptions {
  stack?: string;
  ai?: string;
  dir?: string;
  bridge?: boolean;
}

export async function init(options: InitOptions): Promise<void> {
  const targetDir = path.resolve(options.dir || '.');
  const sourceDir = getSourceAiDir();
  
  console.log(chalk.bold('\n🚀 Initializing ai-dev-system\n'));
  console.log(chalk.gray(`  Target: ${targetDir}`));
  console.log(chalk.gray(`  Source: ${sourceDir}\n`));

  // Step 1: Detect or validate stack
  const spinner = ora('Detecting technology stack...').start();
  
  let stack: Stack | undefined;
  
  if (options.stack) {
    if (isValidStack(options.stack)) {
      stack = options.stack;
      spinner.succeed(`Using specified stack: ${chalk.cyan(stack)}`);
    } else {
      spinner.fail(`Invalid stack: ${options.stack}`);
      console.log(chalk.yellow(`  Available stacks: react-typescript, php-laravel, node-express`));
      return;
    }
  } else {
    const detection = await detectStack(targetDir);
    
    if (detection.stack) {
      stack = detection.stack;
      spinner.succeed(`Detected stack: ${chalk.cyan(stack)} (${detection.confidence} confidence)`);
      console.log(chalk.gray(`  Reason: ${detection.reason}`));
    } else {
      spinner.warn('Could not detect stack, copying all stacks');
    }
  }

  // Step 2: Copy .ai directory
  const copySpinner = ora('Copying .ai directory...').start();
  
  const copyResult = await copyAiDirectory(sourceDir, targetDir, {
    stack,
    aiTools: 'all',
    overwrite: false
  });

  if (copyResult.success && copyResult.copied.length > 0) {
    copySpinner.succeed('Copied .ai directory');
    copyResult.copied.forEach(item => {
      console.log(chalk.green(`  ✓ ${item}`));
    });
  } else if (copyResult.skipped.length > 0) {
    copySpinner.warn('Some items skipped');
    copyResult.skipped.forEach(item => {
      console.log(chalk.yellow(`  ⊘ ${item}`));
    });
  }

  if (copyResult.errors.length > 0) {
    copyResult.errors.forEach(error => {
      console.log(chalk.red(`  ✗ ${error}`));
    });
  }

  // Step 3: Create AI tool bridges
  if (options.bridge !== false) {
    const bridgeSpinner = ora('Creating AI tool bridges...').start();
    
    let aiTools: AITool[] | 'all' = 'all';
    
    if (options.ai && options.ai !== 'all') {
      const requestedTools = options.ai.split(',').map(t => t.trim()) as AITool[];
      const validTools = requestedTools.filter(t => t in AI_BRIDGES);
      
      if (validTools.length > 0) {
        aiTools = validTools;
      }
    }

    const bridgeResult = await createBridges(targetDir, aiTools);

    if (bridgeResult.copied.length > 0) {
      bridgeSpinner.succeed('Created AI tool bridges');
      bridgeResult.copied.forEach(item => {
        console.log(chalk.green(`  ✓ ${item}`));
      });
    } else if (bridgeResult.skipped.length > 0) {
      bridgeSpinner.warn('Some bridges skipped');
      bridgeResult.skipped.forEach(item => {
        console.log(chalk.yellow(`  ⊘ ${item}`));
      });
    }
  }

  // Summary
  console.log(chalk.bold('\n✨ Initialization complete!\n'));
  console.log(chalk.gray('Next steps:'));
  console.log(chalk.gray('  1. Review .ai/context/index.md for context loading rules'));
  console.log(chalk.gray('  2. Configure your AI tool to use the bridge directory'));
  if (stack) {
    console.log(chalk.gray(`  3. Stack-specific standards: .ai/stacks/${stack}/`));
  }
  console.log('');
}
