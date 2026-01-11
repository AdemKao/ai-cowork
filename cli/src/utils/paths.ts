import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

/**
 * Get the root directory of ai-dev-system package
 * Works both when running from source and when installed via npm
 */
export function getPackageRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  
  // When running from source: cli/src/utils -> cli/src -> cli -> root
  // When running from dist:   cli/dist/utils -> cli/dist -> cli -> root
  // When installed via npm:   node_modules/ai-dev-system/cli/dist/utils -> ... -> ai-dev-system
  
  let dir = currentDir;
  
  // Walk up until we find .ai directory or package.json with our name
  for (let i = 0; i < 10; i++) {
    const aiDir = path.join(dir, '.ai');
    const pkgJson = path.join(dir, 'package.json');
    
    // Check if .ai directory exists
    if (fs.existsSync(aiDir) && fs.statSync(aiDir).isDirectory()) {
      return dir;
    }
    
    // Check if we're at the package root
    if (fs.existsSync(pkgJson)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgJson, 'utf-8'));
        if (pkg.name === 'ai-dev-system' || pkg.name === '@anthropics-dev/ai-dev-cli') {
          return dir;
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
    
    const parent = path.dirname(dir);
    if (parent === dir) break; // Reached filesystem root
    dir = parent;
  }
  
  // Fallback: assume we're 3 levels deep (utils -> src/dist -> cli -> root)
  return path.resolve(currentDir, '..', '..', '..');
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
