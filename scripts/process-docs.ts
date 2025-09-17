#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import PROCESSING_CONFIG from '../src/config/content-processing.config.js';
import type { SpecConfig } from './types/processing.types.js';
import { convertToEditUrl } from './utils/github.utils.js';
import { standardizeUCANLinks } from './link-processing.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.resolve(rootDir, 'src', 'content', 'docs');

/**
 * Sanitizes text by removing Markdown formatting and HTML tags
 * @param text - Text to be sanitized
 * @returns Sanitized text
 */
function sanitizeText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links but keep link text
    .replace(/\[\!\[.*?\]\(.*?\)\]\(.*?\)/g, '') // Remove image links
    .replace(/\!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/\`(.*?)\`/g, '$1') // Remove inline code markdown
    .replace(/\<.*?\>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

async function fetchFromGitHub(url: string): Promise<string> {
  try {
    console.log(`  📥 Fetching from GitHub: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    console.log(`  ✅ Successfully fetched (${content.length} bytes)`);
    return content;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`  ❌ Failed to fetch from ${url}:`, errorMessage);
    throw error;
  }
}

async function processSpecs(): Promise<void> {
  console.log('📋 Processing specifications from GitHub...');
  
  // Create directory structure
  for (const spec of PROCESSING_CONFIG.specs) {
    const specDir = path.join(docsDir, spec.name);
    await fs.mkdir(specDir, { recursive: true });
  }
  
  // Create guides directory
  await fs.mkdir(path.join(docsDir, 'guides'), { recursive: true });
  
  // Process each spec
  for (const spec of PROCESSING_CONFIG.specs) {
    const targetPath = path.join(docsDir, spec.name, 'index.md');
    
    try {
      console.log(`\n🔄 Processing ${spec.name}...`);
      
      // Fetch and process main README.md
      const content = await fetchFromGitHub(spec.githubUrl);
      const processedContent = await processMarkdown(content, spec.title, spec.githubUrl);
      await fs.writeFile(targetPath, processedContent);
      
      // Process IPLD schema if available
      if (spec.schemaUrl) {
        try {
          const schemaContent = await fetchFromGitHub(spec.schemaUrl);
          const processedSchema = await processIPLDSchema(schemaContent, spec.title);
          
          const schemaTargetPath = path.join(docsDir, spec.name, 'schema.md');
          await fs.writeFile(schemaTargetPath, processedSchema);
          console.log(`  📄 Created schema documentation for ${spec.name}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.warn(`  ⚠️  Could not fetch schema for ${spec.name}:`, errorMessage);
        }
      }
      
      console.log(`  ✅ Processed ${spec.name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`  ❌ Error processing ${spec.name}:`, errorMessage);
    }
  }
}

async function processMarkdown(content: string, specName = '', githubUrl: string | null = null): Promise<string> {
  let processed = content;
  
  // Extract title from first h1
  const titleMatch = content.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : specName;
  
  // Extract version number from various patterns
  let version = null;
  
  // Look for version patterns in order of preference:
  // 1. Version in the title itself (e.g., "UCAN Specification v1.0.0")
  if (titleMatch) {
    const titleVersionMatch = titleMatch[1].match(/\b(?:v|version\s+)?(\d+\.\d+(?:\.\d+)?(?:-[a-zA-Z0-9.-]+)?)\b/i);
    if (titleVersionMatch) {
      version = titleVersionMatch[1];
    }
  }
  
  // 2. "## Version X.Y.Z" heading
  if (!version) {
    const versionHeadingMatch = content.match(/^## Version\s+(.+)$/m);
    if (versionHeadingMatch) {
      version = versionHeadingMatch[1].trim();
    }
  }
  
  // 3. "Version: X.Y.Z" in metadata or frontmatter-like section
  if (!version) {
    const versionMetaMatch = content.match(/^Version:\s*(.+)$/m);
    if (versionMetaMatch) {
      version = versionMetaMatch[1].trim();
    }
  }
  
  // 4. "v1.2.3" or "1.2.3" pattern near the beginning of the document
  if (!version) {
    const versionPatternMatch = content.match(/(?:^|\n)(?:v|version\s+)?(\d+\.\d+(?:\.\d+)?(?:-[a-zA-Z0-9.-]+)?)\s*$/m);
    if (versionPatternMatch) {
      version = versionPatternMatch[1];
    }
  }
  
  // Clean up the title by removing version information for cleaner display
  let cleanTitle = title;
  if (version) {
    cleanTitle = title.replace(/\s*\b(?:v|version\s+)?\d+\.\d+(?:\.\d+)?(?:-[a-zA-Z0-9.-]+)?\b/i, '').trim();
  }
  
  // Sanitize markdown and HTML from title using the generic sanitizeText function
  cleanTitle = sanitizeText(cleanTitle);
  
  // Remove title from body if configured to do so
  if (PROCESSING_CONFIG.options.removeTitleFromBody && titleMatch) {
    // Remove the first h1 heading and any immediately following version line
    processed = processed.replace(/^# .+$\n(## Version .+$\n)?/m, '');
  }
  
  // Extract description from abstract or first paragraph
  const abstractMatch = processed.match(/# Abstract\s*\n\s*(.+?)(?=\n#|\n\n|$)/s);
  const rawDescription = abstractMatch ? 
    abstractMatch[1].replace(/\n/g, ' ') : 
    `Documentation for ${cleanTitle}`;
    
  // Sanitize the description and truncate if needed
  const description = sanitizeText(rawDescription).substring(0, PROCESSING_CONFIG.options.maxDescriptionLength) + 
    (abstractMatch ? '...' : '');
  
  // Add frontmatter with optional version and editUrl
  let frontmatter = `---
title: "${cleanTitle}"
description: "${description}"`;
  
  if (version) {
    frontmatter += `\nversion: "${version}"`;
  }
  
  // Add editUrl if githubUrl is provided
  const editUrl = githubUrl ? convertToEditUrl(githubUrl) : null;
  if (editUrl) {
    frontmatter += `\neditUrl: "${editUrl}"`;
  }
  
  frontmatter += `\n---\n\n`;
  
  // Process cross-references using shared link processing module
  processed = standardizeUCANLinks(processed);
  
  // Process internal section links (convert to anchor links)
  processed = processed.replace(/\[([^\]]+)\]:\s*#([a-zA-Z0-9-]+)/g, '[$1]: #$2');
  
  // Remove metadata sections that aren't needed in docs
  processed = processed.replace(/## Editors\s*\n[\s\S]*?(?=\n## [^E]|\n# [^E]|$)/g, '');
  processed = processed.replace(/## Authors\s*\n[\s\S]*?(?=\n## [^A]|\n# [^A]|$)/g, '');
  processed = processed.replace(/## Dependencies\s*\n[\s\S]*?(?=\n## [^D]|\n# [^D]|$)/g, '');
  processed = processed.replace(/## Language\s*\n[\s\S]*?(?=\n## [^L]|\n# [^L]|$)/g, '');
  
  return frontmatter + processed;
}

async function processIPLDSchema(schemaContent: string, specName: string): Promise<string> {
  const frontmatter = `---
title: "${specName} Schema"
description: "IPLD schema definition for ${specName}"
---

# ${specName} Schema

This document contains the IPLD schema definition for ${specName}.

\`\`\`ipldsch
${schemaContent}
\`\`\`
`;
  return frontmatter;
}

async function clearDocsDirectory() {
  try {
    console.log('🗑️  Clearing existing documentation...');
    
    // Check if docs directory exists
    const docsExists = await fs.access(docsDir).then(() => true).catch(() => false);
    
    if (docsExists) {
      // Remove all contents except .gitkeep if it exists
      const items = await fs.readdir(docsDir);
      
      for (const item of items) {
        if (item === '.gitkeep') continue; // Preserve .gitkeep if it exists
        
        const itemPath = path.join(docsDir, item);
        const stat = await fs.stat(itemPath);
        
        if (stat.isDirectory()) {
          await fs.rm(itemPath, { recursive: true, force: true });
        } else {
          await fs.unlink(itemPath);
        }
      }
      
      console.log('  ✓ Cleared existing documentation');
    } else {
      console.log('  ✓ No existing documentation to clear');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error clearing docs directory:', errorMessage);
    throw error;
  }
}

async function generateSidebarConfig(): Promise<void> {
  // Use the sidebar configuration from config.js
  const sidebarConfig = PROCESSING_CONFIG.sidebarConfig;
  
  const configPath = path.join(rootDir, 'sidebar-config.json');
  await fs.writeFile(configPath, JSON.stringify(sidebarConfig, null, 2));
  console.log('Generated sidebar configuration at sidebar-config.json');
  console.log('Sidebar configuration will be automatically loaded by astro.config.mjs');
}

// Landing page update function removed as it's no longer needed

async function copyTemplateDirectory(templateDir: string, targetDir: string): Promise<void> {
  const entries = await fs.readdir(templateDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const templatePath = path.join(templateDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    
    if (entry.isDirectory()) {
      // Create directory if it doesn't exist
      await fs.mkdir(targetPath, { recursive: true });
      // Recursively copy subdirectory
      await copyTemplateDirectory(templatePath, targetPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Copy markdown files
      const content = await fs.readFile(templatePath, 'utf8');
      await fs.writeFile(targetPath, content);
      console.log(`  ✓ Created ${path.relative(docsDir, targetPath)}`);
    }
  }
}

async function createTemplateContent() {
  console.log('📝 Creating content from templates...');
  
  const templatesDir = path.join(__dirname, 'templates');
  
  // Copy the entire template directory structure to the docs directory
  await copyTemplateDirectory(templatesDir, docsDir);
  
  console.log('  ✅ All template content created successfully');
}

async function main(): Promise<void> {
  try {
    console.log('🚀 Starting UCAN documentation processing...');
    
    await clearDocsDirectory();
    await processSpecs();
    await generateSidebarConfig();
    await createTemplateContent();
    
    console.log('\n✅ Documentation processing complete!');
    console.log('\nNext steps:');
    console.log('1. Update your astro.config.mjs with the generated sidebar configuration');
    console.log('2. Run your Astro development server to see the results');
    console.log('3. Review the generated documentation for any manual adjustments needed');
    
  } catch (error) {
    console.error('❌ Error during processing:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
