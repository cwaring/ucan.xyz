#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkUCANLinkIssues, standardizeUCANLinks } from './link-processing.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.resolve(rootDir, 'src', 'content');

console.log('🔍 UCAN Content Format');
console.log('============================\n');

// Find all markdown files in content directory only
async function findMarkdownFiles(dir) {
  const files = [];
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        files.push(...await findMarkdownFiles(fullPath));
      } else if (item.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  return files;
}

// Check and fix a single file
async function processFile(filePath, dryRun = false) {
  let content = await fs.readFile(filePath, 'utf-8');
  const original = content;
  const issues = [];
  const fixes = [];

  // 1. Fix duplicate links: [text](url)[text](url) → [text](url)
  const duplicatePattern = /(\[([^\]]+)\]\(([^)]+)\))\s*\1/g;
  const duplicates = content.match(duplicatePattern);
  if (duplicates) {
    issues.push(`${duplicates.length} duplicate links`);
    if (!dryRun) {
      content = content.replace(duplicatePattern, '$1');
      fixes.push('removed duplicate links');
    }
  }

  // 2. Fix header spacing: ##Header → ## Header
  const badHeaderPattern = /^(#{1,6})([^\s#])/gm;
  const badHeaders = content.match(badHeaderPattern);
  if (badHeaders) {
    issues.push(`${badHeaders.length} headers missing spaces`);
    if (!dryRun) {
      content = content.replace(badHeaderPattern, '$1 $2');
      fixes.push('fixed header spacing');
    }
  }

  // 3. Standardize UCAN specification links using refactored module
  const ucanLinkIssues = checkUCANLinkIssues(content);
  if (ucanLinkIssues.length > 0) {
    issues.push(...ucanLinkIssues);
    if (!dryRun) {
      content = standardizeUCANLinks(content);
      fixes.push('standardized UCAN links');
    }
  }

  // 4. Clean up whitespace
  const hasTrailingWhitespace = /[ \t]+$/gm.test(content);
  const hasExtraNewlines = /\n{3,}/g.test(content);
  if (hasTrailingWhitespace || hasExtraNewlines) {
    issues.push('whitespace cleanup needed');
    if (!dryRun) {
      content = content.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n');
      fixes.push('cleaned whitespace');
    }
  }

  // Write changes if not dry run
  if (!dryRun && content !== original) {
    await fs.writeFile(filePath, content, 'utf-8');
  }

  return { issues, fixes, changed: content !== original };
}

// Main function
async function main() {
  const dryRun = process.argv.includes('--dry-run');
  
  if (dryRun) {
    console.log('🔍 DRY RUN - No changes will be made\n');
  }

  // Only process files in the content directory
  const files = await findMarkdownFiles(contentDir);
  console.log(`Found ${files.length} markdown files in content directory\n`);

  let totalIssues = 0;
  let totalFixed = 0;

  for (const file of files) {
    const relativePath = path.relative(rootDir, file);
    
    try {
      const result = await processFile(file, dryRun);
      
      if (result.issues.length > 0) {
        console.log(`${dryRun ? '❌' : result.changed ? '✅' : '❌'} ${relativePath}`);
        result.issues.forEach(issue => console.log(`   - ${issue}`));
        if (result.fixes.length > 0) {
          result.fixes.forEach(fix => console.log(`   ✓ ${fix}`));
        }
        totalIssues++;
        if (result.changed) totalFixed++;
      } else {
        console.log(`✅ ${relativePath} - no issues`);
      }
      
    } catch (error) {
      console.log(`❌ Error processing ${relativePath}: ${error.message}`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`Files checked: ${files.length}`);
  console.log(`Files with issues: ${totalIssues}`);
  if (!dryRun) {
    console.log(`Files fixed: ${totalFixed}`);
  }

  if (dryRun && totalIssues > 0) {
    console.log('\n🔧 To fix these issues, run:');
    console.log('   node scripts/simple-review.js');
  }
}

main().catch(console.error);
