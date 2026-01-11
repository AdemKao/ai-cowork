import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

/**
 * Get the root directory of ai-dev-system package
 */
export function getPackageRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  
  // When running with bun from src/utils: go up to cli/, then to root
  // When running from dist/utils: go up to cli/, then to root  
  if (currentDir.includes('/src/')) {
    // Running from source: src/utils -> src -> cli -> root
    return path.resolve(currentDir, '..', '..', '..');
  } else {
    // Running from dist: dist/utils -> dist -> cli -> root
    return path.resolve(currentDir, '..', '..', '..');
  }
}

/**
 * Get the .ai directory in ai-dev-system package
 */
export function getSourceAiDir(): string {
  return path.join(getPackageRoot(), '.ai');
}

/**
 * Get the target .ai directory in user's project
 */
export function getTargetAiDir(targetDir: string): string {
  return path.join(path.resolve(targetDir), '.ai');
}

/**
 * Available stacks
 */
export const AVAILABLE_STACKS = [
  'react-typescript',
  'php-laravel', 
  'node-express'
] as const;

export type Stack = typeof AVAILABLE_STACKS[number];

/**
 * AI tool bridge directories
 */
export const AI_BRIDGES = {
  claude: '.claude',
  cursor: '.cursor',
  opencode: '.opencode',
  agent: '.agent'
} as const;

export type AITool = keyof typeof AI_BRIDGES;

/**
 * Check if a directory exists
 */
export async function directoryExists(dir: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}
