#!/usr/bin/env node

/**
 * Script to check for missing @step decorators in pages, asserters, and steps files
 * Usage: node scripts/check-step-decorators.js
 */

/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

const fs = require('fs');
const path = require('path');

const FILE_PATTERNS = ['-steps.ts', '-asserter.ts', '-page.ts'];

const EXCLUDED_METHODS = [
  'constructor',
  'assertThat',
  'steps',
  'navigate',
  'init',
  'map',
  'page',
  'gamdomPage'
];

/**
 * Find files matching the specified patterns
 * @param {string} dir - Directory to search
 * @param {string[]} patterns - File patterns to match
 * @returns {string[]} Array of matching file paths
 */
function findFiles(dir, patterns) {
  const files = [];

  /**
   * Recursively traverse directories
   * @param {string} currentDir - Current directory path
   */
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip node_modules and other irrelevant directories
        if (!['node_modules', '.git', 'dist', 'build', 'test-results', 'playwright-report'].includes(item)) {
          traverse(fullPath);
        }
      } else if (stat.isFile()) {
        const matchesPattern = patterns.some(pattern =>
          item.endsWith(pattern) && item.includes('-')
        );

        if (matchesPattern) {
          files.push(fullPath);
        }
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Check a file for missing @step decorators
 * @param {string} filePath - Path to the file to check
 * @returns {Array<{line: number, method: string, message: string}>} Array of issues found
 */
function checkFileForMissingStepDecorators(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];
  
  // Simple regex to find async method definitions
  const methodRegex = /^\s*(?:public|private|protected)?\s*async\s+(\w+)\s*\(/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(methodRegex);
    
    if (match) {
      const methodName = match[1];
      
      if (EXCLUDED_METHODS.includes(methodName)) {
        continue;
      }
      
      if (methodName.startsWith('_')) {
        continue;
      }
      
      let hasStepDecorator = false;
      for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
        const prevLine = lines[j].trim();
        if (prevLine.includes('@step')) {
          hasStepDecorator = true;
          break;
        }
        if (prevLine.includes('async ') || prevLine.includes('class ') || prevLine.includes('}')) {
          break;
        }
      }
      
      if (!hasStepDecorator) {
        issues.push({
          line: i + 1,
          method: methodName,
          message: `Method "${methodName}" is missing @step decorator`
        });
      }
    }
  }
  
  return issues;
}

function main() {
  console.log('🔍 Checking for missing @step decorators...\n');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot, FILE_PATTERNS);
  
  let totalIssues = 0;
  let filesWithIssues = 0;
  
  for (const file of files) {
    const issues = checkFileForMissingStepDecorators(file);
    
    if (issues.length > 0) {
      filesWithIssues++;
      totalIssues += issues.length;
      
      const relativePath = path.relative(projectRoot, file);
      console.log(`❌ ${relativePath}`);
      
      for (const issue of issues) {
        console.log(`   📍 Line ${issue.line}: ${issue.message}`);
      }
      console.log('');
    }
  }
  
  if (totalIssues === 0) {
    console.log('✅ All methods in pages, asserters, and steps files have @step decorators!');
  } else {
    console.log(`📊 Summary:`);
    console.log(`   📁 Files checked: ${files.length}`);
    console.log(`   ⚠️  Files with issues: ${filesWithIssues}`);
    console.log(`   🚫 Total missing decorators: ${totalIssues}`);
    
    process.exit(1);
  }
}

// Run main function if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { checkFileForMissingStepDecorators, findFiles };
