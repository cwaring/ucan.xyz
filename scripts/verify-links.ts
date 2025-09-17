#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, '..', 'src', 'content', 'docs');

async function verifyLinks(): Promise<void> {
  console.log('🔍 Verifying link processing...');
  
  const specFile = path.join(docsDir, 'specification', 'index.md');
  const delegationFile = path.join(docsDir, 'delegation', 'index.md');
  
  try {
    // Check specification file
    const specContent = await fs.readFile(specFile, 'utf-8');
    console.log('✅ Specification file:');
    
    // Check for duplicate links
    const duplicateLinks = specContent.match(/\[([^\]]+)\]\(([^)]+)\)\[([^\]]+)\]\(([^)]+)\)/g);
    if (duplicateLinks) {
      console.log('❌ Found duplicate links:', duplicateLinks);
    } else {
      console.log('   ✓ No duplicate links found');
    }
    
    // Check for proper sub-spec links
    const subSpecLinks = specContent.match(/- \[UCAN [^\]]+\]\([^)]+\)/g);
    if (subSpecLinks) {
      console.log('   ✓ Sub-specification links:');
      subSpecLinks.forEach(link => console.log('     -', link));
    }
    
    // Check delegation file
    const delegationContent = await fs.readFile(delegationFile, 'utf-8');
    console.log('\n✅ Delegation file:');
    
    // Check for invocation links
    const invocationLinks = delegationContent.match(/\[UCAN Invocation\]\([^)]+\)/g);
    if (invocationLinks) {
      console.log('   ✓ Invocation links:', invocationLinks[0]);
    }
    
    // Check for envelope links
    const envelopeLinks = delegationContent.match(/\[UCAN Envelope\]\([^)]+\)/g);
    if (envelopeLinks) {
      console.log('   ✓ Envelope links:', envelopeLinks[0]);
    }
    
    console.log('\n✅ Link verification complete!');
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error during verification:', errorMessage);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  verifyLinks();
}
