import path from 'path';
import fs from 'fs-extra';
import { Stack, AVAILABLE_STACKS, fileExists } from './paths.js';

interface DetectionResult {
  stack: Stack | null;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

/**
 * Detect the technology stack of a project
 */
export async function detectStack(projectDir: string): Promise<DetectionResult> {
  const resolvedDir = path.resolve(projectDir);
  
  // Check for Laravel (composer.json)
  const composerPath = path.join(resolvedDir, 'composer.json');
  if (await fileExists(composerPath)) {
    try {
      const composer = await fs.readJson(composerPath);
      const deps = { ...composer.require, ...composer['require-dev'] };
      
      if (deps['laravel/framework']) {
        return {
          stack: 'php-laravel',
          confidence: 'high',
          reason: 'Found laravel/framework in composer.json'
        };
      }
    } catch {
      // Ignore parse errors
    }
  }
  
  // Check for Node.js projects (package.json)
  const packagePath = path.join(resolvedDir, 'package.json');
  if (await fileExists(packagePath)) {
    try {
      const pkg = await fs.readJson(packagePath);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      // React detection
      if (deps['react'] || deps['react-dom']) {
        return {
          stack: 'react-typescript',
          confidence: 'high',
          reason: 'Found react in package.json'
        };
      }
      
      // Express detection
      if (deps['express']) {
        return {
          stack: 'node-express',
          confidence: 'high',
          reason: 'Found express in package.json'
        };
      }
      
      // TypeScript project without specific framework
      if (deps['typescript']) {
        return {
          stack: 'react-typescript',
          confidence: 'low',
          reason: 'Found typescript but no specific framework'
        };
      }
    } catch {
      // Ignore parse errors
    }
  }
  
  // Check for file extensions as fallback
  const files = await fs.readdir(resolvedDir).catch(() => []);
  
  const hasTsx = files.some(f => f.endsWith('.tsx'));
  const hasPhp = files.some(f => f.endsWith('.php'));
  
  if (hasTsx) {
    return {
      stack: 'react-typescript',
      confidence: 'medium',
      reason: 'Found .tsx files in project root'
    };
  }
  
  if (hasPhp) {
    return {
      stack: 'php-laravel',
      confidence: 'low',
      reason: 'Found .php files (assuming Laravel)'
    };
  }
  
  return {
    stack: null,
    confidence: 'low',
    reason: 'Could not detect stack'
  };
}

/**
 * Validate if a stack name is valid
 */
export function isValidStack(stack: string): stack is Stack {
  return AVAILABLE_STACKS.includes(stack as Stack);
}
