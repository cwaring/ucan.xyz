#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PROCESSING_CONFIG, convertToEditUrl } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.resolve(rootDir, 'src', 'content', 'docs');

// Link mapping for cross-references
const LINK_MAPPINGS = PROCESSING_CONFIG.linkMappings;

async function fetchFromGitHub(url) {
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
    console.error(`  ❌ Failed to fetch from ${url}:`, error.message);
    throw error;
  }
}

async function processSpecs() {
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
          console.log(`  � Created schema documentation for ${spec.name}`);
        } catch (error) {
          console.warn(`  ⚠️  Could not fetch schema for ${spec.name}:`, error.message);
        }
      }
      
      console.log(`  ✅ Processed ${spec.name}`);
    } catch (error) {
      console.error(`  ❌ Error processing ${spec.name}:`, error.message);
    }
  }
  
  return PROCESSING_CONFIG.specs;
}

async function processMarkdown(content, specName = '', githubUrl = null) {
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
  
  // Remove title from body if configured to do so
  if (PROCESSING_CONFIG.options.removeTitleFromBody && titleMatch) {
    // Remove the first h1 heading and any immediately following version line
    processed = processed.replace(/^# .+$\n(## Version .+$\n)?/m, '');
  }
  
  // Extract description from abstract or first paragraph
  const abstractMatch = processed.match(/# Abstract\s*\n\s*(.+?)(?=\n#|\n\n|$)/s);
  const description = abstractMatch ? 
    abstractMatch[1].replace(/\n/g, ' ').replace(/\[([^\]]+)\]/g, '$1').trim().substring(0, PROCESSING_CONFIG.options.maxDescriptionLength) + '...' :
    `Documentation for ${cleanTitle}`;
  
  // Add frontmatter with optional version and editUrl
  let frontmatter = `---
title: "${cleanTitle}"
description: "${description}"`;
  
  if (version) {
    frontmatter += `\nversion: "${version}"`;
  }
  
  // Add editUrl if githubUrl is provided
  const editUrl = convertToEditUrl(githubUrl);
  if (editUrl) {
    frontmatter += `\neditUrl: "${editUrl}"`;
  }
  
  frontmatter += `\n---\n\n`;
  
  // Process cross-references with a simple, elegant approach
  // Split document into main content and reference links section
  const externalLinksMarker = '<!-- External Links -->';
  const parts = processed.split(externalLinksMarker);
  let mainContent = parts[0];
  let referenceSection = parts.length > 1 ? externalLinksMarker + parts[1] : '';
  
  // Only process inline links in the main content, leave reference section untouched
  // Process in specific order to avoid conflicts
  
  // First, handle reference-style link usage (these should be converted to direct links)
  mainContent = mainContent.replace(/\[UCAN Delegation\]\[delegation\]/g, '[UCAN Delegation](/delegation/)');
  mainContent = mainContent.replace(/\[UCAN Invocation\]\[invocation\]/g, '[UCAN Invocation](/invocation/)');
  mainContent = mainContent.replace(/\[UCAN Revocation\]\[revocation\]/g, '[UCAN Revocation](/revocation/)');
  mainContent = mainContent.replace(/\[UCAN Promise\]\[promise\]/g, '[UCAN Promise](/promise/)');
  
  // Then handle standalone UCAN references (not already linked and not reference definitions)
  mainContent = mainContent.replace(/\[UCAN Delegation\](?!\(|\[|:)/g, '[UCAN Delegation](/delegation/)');
  mainContent = mainContent.replace(/\[UCAN Invocation\](?!\(|\[|:)/g, '[UCAN Invocation](/invocation/)');
  mainContent = mainContent.replace(/\[UCAN Revocation\](?!\(|\[|:)/g, '[UCAN Revocation](/revocation/)');
  mainContent = mainContent.replace(/\[UCAN Promise\](?!\(|\[|:)/g, '[UCAN Promise](/promise/)');
  mainContent = mainContent.replace(/\[UCAN Envelope\](?!\(|\[|:)/g, '[UCAN Envelope](/specification/#ucan-envelope)');
  
  // Handle other references
  mainContent = mainContent.replace(/\[high level spec\](?!\(|\[|:)/g, '[high level spec](/specification/)');
  
  // UCAN should be last to avoid conflicts
  mainContent = mainContent.replace(/\[UCAN\](?!\(|\[|:|\s)/g, '[UCAN](/specification/)');
  
  // Update reference definitions in the reference section using LINK_MAPPINGS
  Object.entries(LINK_MAPPINGS).forEach(([pattern, replacement]) => {
    // Handle reference-style links like [UCAN]: https://github.com/ucan-wg/spec
    const githubPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const refPattern = new RegExp(`\\[([^\\]]+)\\]:\\s*${githubPattern}`, 'g');
    referenceSection = referenceSection.replace(refPattern, `[$1]: ${replacement}`);
  });
  
  // Recombine the document
  processed = mainContent + referenceSection;
  
  // Process internal section links (convert to anchor links)
  processed = processed.replace(/\[([^\]]+)\]:\s*#([a-zA-Z0-9-]+)/g, '[$1]: #$2');
  
  // Remove metadata sections that aren't needed in docs
  processed = processed.replace(/## Editors\s*\n[\s\S]*?(?=\n## [^E]|\n# [^E]|$)/g, '');
  processed = processed.replace(/## Authors\s*\n[\s\S]*?(?=\n## [^A]|\n# [^A]|$)/g, '');
  processed = processed.replace(/## Dependencies\s*\n[\s\S]*?(?=\n## [^D]|\n# [^D]|$)/g, '');
  processed = processed.replace(/## Language\s*\n[\s\S]*?(?=\n## [^L]|\n# [^L]|$)/g, '');
  
  return frontmatter + processed;
}

async function processIPLDSchema(schemaContent, specName) {
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
    console.error('❌ Error clearing docs directory:', error.message);
    throw error;
  }
}

async function generateSidebarConfig() {
  // Use the sidebar configuration from config.js
  const sidebarConfig = PROCESSING_CONFIG.sidebarConfig;
  
  const configPath = path.join(rootDir, 'sidebar-config.json');
  await fs.writeFile(configPath, JSON.stringify(sidebarConfig, null, 2));
  console.log('Generated sidebar configuration at sidebar-config.json');
  console.log('Sidebar configuration will be automatically loaded by astro.config.mjs');
}

async function updateLandingPage() {
  const landingPageContent = `---
title: "UCAN Specification"
description: "User Controlled Authorization Network (UCAN) - A trustless, secure, local-first, user-originated authorization scheme"
template: splash
hero:
  title: "UCAN Specification"
  tagline: "User Controlled Authorization Network - A trustless, secure, local-first, user-originated authorization scheme"
  actions:
    - text: "Get Started"
      link: "/specification/"
      icon: "right-arrow"
      variant: "primary"
    - text: "View on GitHub"
      link: "https://github.com/ucan-wg/spec"
      icon: "external"
      variant: "minimal"
---

import { Card, CardGrid } from '@astrojs/starlight/components';

## Core Specifications

<CardGrid stagger>
  <Card title="UCAN Specification" icon="document" href="/specification/">
    The main UCAN specification providing high-level concepts and motivation.
  </Card>
  <Card title="Delegation" icon="approve-check" href="/delegation/">
    Cryptographically verifiable authority delegation between principals.
  </Card>
  <Card title="Invocation" icon="rocket" href="/invocation/">
    Format for expressing intention to execute delegated capabilities.
  </Card>
  <Card title="Revocation" icon="cancel" href="/revocation/">
    Manual method for invalidating delegations after issuance.
  </Card>
</CardGrid>

## Supporting Specifications

<CardGrid>
  <Card title="Variable Signature" icon="puzzle" href="/varsig/">
    Compact format for describing signatures and codec information.
  </Card>
  <Card title="Container Format" icon="box" href="/container/">
    Transport format for bundling UCAN tokens.
  </Card>
  <Card title="Promise" icon="star" href="/promise/">
    Specification for UCAN promises (coming soon).
  </Card>
</CardGrid>

## What is UCAN?

UCAN (User Controlled Authorization Network) is a trustless, secure, local-first, user-originated authorization scheme. It provides:

- **Public-key verifiable** - Cryptographically secure without central authority
- **Delegable** - Transfer authority without transferring keys  
- **Expressive** - Flexible capability system with policy language
- **Partition tolerant** - Works offline and in distributed systems
- **Openly extensible** - Supports custom capabilities and resources

## Key Features

### 🔐 **Cryptographic Security**
Built on public-key cryptography with verifiable certificate chains and decentralized identifiers (DIDs).

### 🌐 **Decentralized**
No central authorization server required - resources grant authority directly to users.

### 📱 **Local-First**
Designed for offline operation with partition tolerance and caching support.

### 🔄 **Composable**
Capabilities can be combined and delegated in flexible ways to build complex authorization patterns.
`;

  const landingPagePath = path.join(docsDir, 'index.mdx');
  await fs.writeFile(landingPagePath, landingPageContent);
  console.log('Updated landing page');
}

async function createGuides() {
  console.log('Creating guides...');
  
  // Create getting-started.md
  const gettingStartedContent = `---
title: "Getting Started with UCAN"
description: "A beginner's guide to understanding and using User Controlled Authorization Network (UCAN)"
---

# Getting Started with UCAN

This guide provides a gentle introduction to UCAN (User Controlled Authorization Network) and its core concepts.

## What is UCAN?

UCAN is a **trustless**, **secure**, **local-first**, **user-originated** authorization scheme that lets you:

- **Delegate authority** without sharing cryptographic keys
- **Work offline** with full authorization capabilities
- **Scale authorization** across distributed systems
- **Maintain user control** over their data and permissions

## Key Concepts

### 1. Capabilities vs Permissions

Traditional systems use **Access Control Lists (ACLs)** - a list of who can do what:
\`\`\`
Alice can read file.txt
Bob can write file.txt
Charlie can read file.txt
\`\`\`

UCAN uses **capabilities** - tokens that grant specific abilities:
\`\`\`
Token A grants "read file.txt"
Token B grants "write file.txt"
\`\`\`

### 2. Delegation

With UCAN, you can delegate authority to others without sharing your keys:

\`\`\`mermaid
graph LR
    A[Alice] -->|delegates read permission| B[Bob]
    B -->|delegates read permission| C[Charlie]
    C -->|can now read file.txt| D[File System]
\`\`\`

### 3. Verification

Each UCAN can be verified independently:
- **Cryptographic signatures** prove authenticity
- **Certificate chains** show delegation path
- **No central authority** needed for verification

## Core Specifications

### [UCAN Delegation](/delegation/)
The foundation of UCAN - how to create and delegate capabilities.

**Key features:**
- Cryptographically verifiable
- Hierarchical authority
- Expiration times
- Policy language for conditions

### [UCAN Invocation](/invocation/)
How to execute the capabilities you've been delegated.

**Key features:**
- Clear intention to act
- Proof of authorization
- Execution receipts
- Causal relationships

### [UCAN Revocation](/revocation/)
How to revoke capabilities after they've been issued.

**Key features:**
- Manual invalidation
- Revocation chains
- Last resort security

## Common Use Cases

### 1. File System Access
\`\`\`javascript
// Alice delegates read access to Bob
const delegation = await alice.delegate({
  audience: bob.did(),
  capabilities: [{
    resource: "file://alice/documents/report.pdf",
    ability: "read"
  }],
  expiration: Date.now() + 3600000 // 1 hour
});

// Bob can now read the file
const result = await bob.invoke({
  capability: delegation,
  resource: "file://alice/documents/report.pdf",
  ability: "read"
});
\`\`\`

### 2. API Access
\`\`\`javascript
// Service owner delegates API access
const apiAccess = await service.delegate({
  audience: user.did(),
  capabilities: [{
    resource: "api://service.com/users",
    ability: "read",
    conditions: {
      rateLimit: 100, // requests per hour
      scope: "public" // only public data
    }
  }]
});
\`\`\`

### 3. Collaborative Documents
\`\`\`javascript
// Alice shares edit access to document
const editAccess = await alice.delegate({
  audience: collaborator.did(),
  capabilities: [{
    resource: "doc://alice/project-proposal",
    ability: "edit",
    conditions: {
      sections: ["comments", "suggestions"], // limited sections
      expiry: "2024-01-01T00:00:00Z"
    }
  }]
});
\`\`\`

## Next Steps

1. **Read the specifications** - Start with the [UCAN Delegation](/delegation/) spec
2. **Explore examples** - Check out the code samples in each specification
3. **Try an implementation** - Look for UCAN libraries in your preferred language
4. **Join the community** - Participate in discussions on the UCAN GitHub

## Additional Resources

- [UCAN Website](https://ucan.xyz)
- [GitHub Repository](https://github.com/ucan-wg/spec)
- [Implementation Libraries](https://github.com/ucan-wg)

## Questions?

Common questions about UCAN:

**Q: How is UCAN different from OAuth?**
A: OAuth requires online authorization servers. UCAN works offline and doesn't need central authorities.

**Q: Can I revoke a UCAN after issuing it?**
A: Yes, through the [UCAN Revocation](/revocation/) mechanism, though this requires the revocation message to be delivered.

**Q: Are UCANs secure?**
A: UCANs use public-key cryptography and are designed with security best practices. However, they require proper implementation and key management.

**Q: Can I use UCAN with existing systems?**
A: Yes! UCAN is designed to wrap existing authorization systems while adding its benefits.`;

  // Create examples.md
  const examplesContent = `---
title: "UCAN Examples"
description: "Practical examples of using UCAN for authorization and delegation"
---

# UCAN Examples

This page contains practical examples of using UCAN for various authorization scenarios.

## Example 1: File System Access

### Scenario
Alice wants to give Bob temporary read access to a specific file.

### Implementation

\`\`\`javascript
// Alice creates a delegation
const delegation = {
  iss: "did:key:alice123", // Alice's DID
  aud: "did:key:bob456",   // Bob's DID
  sub: "did:key:alice123", // Subject (Alice owns the file)
  cmd: "/fs/read",         // Command to read files
  pol: [                   // Policy constraints
    ["==", ".path", "/documents/report.pdf"],
    ["<", ".size", 1000000] // Max 1MB
  ],
  exp: 1704067200,         // Expires Jan 1, 2024
  nonce: "random-nonce-123"
};

// Alice signs the delegation
const signedDelegation = await alice.sign(delegation);

// Bob receives the delegation and can now read the file
const invocation = {
  iss: "did:key:bob456",
  aud: "did:key:filesystem",
  cmd: "/fs/read",
  args: {
    path: "/documents/report.pdf"
  },
  prf: [signedDelegation], // Proof of authorization
  nonce: "invocation-nonce-456"
};

const result = await bob.invoke(invocation);
\`\`\`

## Example 2: API Rate Limiting

### Scenario
A service wants to delegate API access with rate limiting.

### Implementation

\`\`\`javascript
// Service delegates API access with constraints
const apiDelegation = {
  iss: "did:key:service789",
  aud: "did:key:client123",
  sub: "did:key:service789",
  cmd: "/api/users/read",
  pol: [
    ["<=", ".requests_per_hour", 100],
    ["==", ".scope", "public"]
  ],
  exp: Date.now() + 86400000, // 24 hours
  nonce: "api-nonce-789"
};
\`\`\`

## Example 3: Collaborative Document Editing

### Scenario
Alice wants to allow Bob to edit specific sections of a document.

### Implementation

\`\`\`javascript
// Alice delegates edit access for specific sections
const editDelegation = {
  iss: "did:key:alice123",
  aud: "did:key:bob456",
  sub: "did:key:alice123",
  cmd: "/document/edit",
  pol: [
    ["==", ".document_id", "doc_abc123"],
    ["any", ".section", ["comments", "suggestions", "footnotes"]],
    ["not", ["==", ".section", "final_text"]] // Bob can't edit final text
  ],
  exp: 1704067200,
  nonce: "edit-nonce-101"
};

// Bob invokes the delegation to edit comments
const editInvocation = {
  iss: "did:key:bob456",
  aud: "did:key:document-service",
  cmd: "/document/edit",
  args: {
    document_id: "doc_abc123",
    section: "comments",
    content: "This looks good to me!"
  },
  prf: [editDelegation],
  nonce: "edit-invoke-102"
};
\`\`\`

## Example 4: Chain of Delegation

### Scenario
Alice delegates to Bob, who then delegates to Charlie.

### Implementation

\`\`\`javascript
// 1. Alice delegates to Bob
const aliceToBob = {
  iss: "did:key:alice123",
  aud: "did:key:bob456",
  sub: "did:key:alice123",
  cmd: "/storage/read",
  pol: [["like", ".path", "/shared/*"]],
  exp: 1704067200,
  nonce: "alice-bob-nonce"
};

// 2. Bob delegates to Charlie (with additional constraints)
const bobToCharlie = {
  iss: "did:key:bob456",
  aud: "did:key:charlie789",
  sub: "did:key:alice123", // Still about Alice's resources
  cmd: "/storage/read",
  pol: [
    ["like", ".path", "/shared/*"],
    ["==", ".format", "json"] // Additional constraint
  ],
  exp: 1704063600, // Earlier expiry than Alice's delegation
  nonce: "bob-charlie-nonce"
};

// 3. Charlie invokes with proof chain
const charlieInvocation = {
  iss: "did:key:charlie789",
  aud: "did:key:storage-service",
  cmd: "/storage/read",
  args: {
    path: "/shared/data.json",
    format: "json"
  },
  prf: [aliceToBob, bobToCharlie], // Chain of proofs
  nonce: "charlie-invoke-nonce"
};
\`\`\`

## Example 5: Revocation

### Scenario
Alice needs to revoke Bob's access due to a security concern.

### Implementation

\`\`\`javascript
// Alice creates a revocation
const revocation = {
  iss: "did:key:alice123",
  aud: "did:key:revocation-service",
  cmd: "/ucan/revoke",
  args: {
    rev: delegationToRevoke, // The delegation to revoke
    pth: []                  // Empty path means direct revocation
  },
  nonce: "revoke-nonce-555"
};

// Alice signs and publishes the revocation
const signedRevocation = await alice.sign(revocation);
await revocationService.publish(signedRevocation);

// Now Bob's delegation will be rejected
const bobAttempt = {
  iss: "did:key:bob456",
  aud: "did:key:storage-service",
  cmd: "/storage/read",
  args: { path: "/shared/data.json" },
  prf: [revokedDelegation], // This will fail
  nonce: "bob-attempt-nonce"
};

// Service checks revocation before processing
const isRevoked = await revocationService.check(revokedDelegation);
if (isRevoked) {
  throw new Error("Delegation has been revoked");
}
\`\`\`

## Policy Language Examples

The UCAN policy language supports various conditions:

### Equality Checks
\`\`\`javascript
// Exact match
["==", ".status", "active"]

// Not equal
["!=", ".type", "admin"]
\`\`\`

### Comparisons
\`\`\`javascript
// Numeric comparisons
["<", ".age", 18]
[">=", ".score", 100]

// String comparisons
["like", ".email", "*@company.com"]
\`\`\`

### Logical Operations
\`\`\`javascript
// AND - all conditions must be true
["and", 
  ["==", ".status", "active"],
  [">=", ".age", 18]
]

// OR - at least one condition must be true
["or",
  ["==", ".role", "admin"],
  ["==", ".role", "moderator"]
]

// NOT - condition must be false
["not", ["==", ".banned", true]]
\`\`\`

### Array Operations
\`\`\`javascript
// All items in array must match condition
["all", ".tags", ["!=", ".", "private"]]

// At least one item in array must match
["any", ".permissions", ["==", ".", "read"]]
\`\`\`

## Best Practices

1. **Principle of Least Authority**: Only delegate the minimum necessary permissions
2. **Short Expiry Times**: Use short-lived delegations when possible
3. **Specific Policies**: Be as specific as possible in policy constraints
4. **Revocation Planning**: Have a plan for revoking delegations if needed
5. **Secure Key Management**: Keep private keys secure and never share them

## Implementation Libraries

- **JavaScript/TypeScript**: \`@ucan/core\`
- **Rust**: \`ucan-rs\`
- **Go**: \`go-ucan\`
- **Python**: \`py-ucan\`

Check the [UCAN GitHub organization](https://github.com/ucan-wg) for the latest implementations.`;

  // Write guide files
  const gettingStartedPath = path.join(docsDir, 'guides', 'getting-started.md');
  const examplesPath = path.join(docsDir, 'guides', 'examples.md');
  
  await fs.writeFile(gettingStartedPath, gettingStartedContent);
  await fs.writeFile(examplesPath, examplesContent);
  
  console.log('  ✓ Created getting-started.md');
  console.log('  ✓ Created examples.md');
}

async function main() {
  try {
    console.log('🚀 Starting UCAN documentation processing...');
    
    await clearDocsDirectory();
    const specs = await processSpecs();
    await generateSidebarConfig();
    await updateLandingPage();
    await createGuides();
    
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
