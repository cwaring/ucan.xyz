# UCAN.xyz Documentation Processing System

This documentation describes the automated system that processes UCAN specification documents from GitHub repositories and converts them into a unified documentation website using Astro Starlight.

## Overview

The UCAN.xyz website automatically aggregates documentation from multiple repositories in the UCAN ecosystem, providing a single source of truth for UCAN specifications, implementations, and guides. The system fetches content directly from GitHub, processes it for web consumption, and generates a cohesive documentation experience.

## Key Features

- **GitHub Integration**: Fetches README.md and IPLD schema files directly from GitHub repositories
- **Automated Processing**: Converts GitHub-hosted markdown into Starlight-compatible documentation
- **Clean Slate Processing**: Automatically clears existing documentation before processing to ensure fresh output
- **Dependency-Aware Ordering**: Processes specifications in logical order to ensure correct cross-references
- **Intelligent Link Resolution**: Automatically converts cross-references between specifications
- **Schema Integration**: Processes IPLD schema files and creates dedicated schema documentation pages
- **Dynamic Sidebar Generation**: Auto-generates navigation structure based on processed content
- **Frontmatter Generation**: Adds appropriate frontmatter with titles, descriptions, and edit URLs
- **Content Sanitization**: Removes unnecessary sections (editors, authors) and standardizes formatting
- **Multi-Language Library Support**: Includes UCAN implementations across JavaScript, Rust, Go, and more
- **Implementation Guide**: Comprehensive guide for building UCAN v1.0 libraries from scratch
- **Mermaid Diagram Support**: Renders interactive diagrams for visualizing UCAN concepts
- **SEO Optimization**: Generates meta tags and structured content for search engines

## Usage

### Quick Start

```bash
# Install dependencies
pnpm install

# Process all documentation from GitHub
pnpm process-docs

# Format and validate content
pnpm content-format

# Start the development server
pnpm dev
```

### Production Build

```bash
# Full build process (includes documentation processing)
pnpm build

# Preview the built site
pnpm preview
```

### Manual Processing

```bash
# Run documentation processing directly
pnpm process-docs

# Run content formatting directly  
pnpm content-format

# Verify links
pnpm verify-links
```

## Site Architecture

The website is structured as follows:

### Main Pages (Astro)
```
src/pages/
├── index.astro           # Homepage with UCAN overview and features
├── about.astro           # About UCAN and the working group  
├── libraries.astro       # Library showcase and comparison
├── getting-started.astro # Interactive getting started guide
└── inspector.astro       # UCAN token inspector tool
```

### Documentation Structure (Starlight)
```
src/content/docs/                    # Auto-generated from GitHub repositories
├── specification/
│   └── index.md                     # Main UCAN specification
├── guides/
│   ├── getting-started.md           # Tutorial and quick start guide
│   └── examples.md                  # Code examples and use cases
├── Core Specifications/
│   ├── delegation/
│   │   ├── index.md                 # UCAN Delegation specification
│   │   └── schema.md                # IPLD schema documentation
│   ├── invocation/
│   │   ├── index.md                 # UCAN Invocation specification  
│   │   └── schema.md                # IPLD schema documentation
│   ├── promise/
│   │   └── index.md                 # UCAN Promise specification
│   └── revocation/
│       ├── index.md                 # UCAN Revocation specification
│       └── schema.md                # IPLD schema documentation
├── References/
│   ├── varsig/
│   │   └── index.md                 # Variable Signature specification
│   └── container/
│       └── index.md                 # Container format specification
└── Libraries/
    ├── implementation.md            # UCAN Library Implementation Guide (v1.0)
    ├── javascript/
    │   └── index.md                 # JavaScript/TypeScript implementations
    ├── rust/
    │   └── index.md                 # Rust implementation
    └── go/
        └── index.md                 # Go implementation
```

## Repository Sources

The documentation system automatically fetches content from these GitHub repositories:

### Core Specifications
- **[ucan-wg/spec](https://github.com/ucan-wg/spec)** → Introduction (Main UCAN specification)
- **[ucan-wg/delegation](https://github.com/ucan-wg/delegation)** → Delegation spec + IPLD schema
- **[ucan-wg/invocation](https://github.com/ucan-wg/invocation)** → Invocation spec + IPLD schema
- **[ucan-wg/promise](https://github.com/ucan-wg/promise)** → Promise specification
- **[ucan-wg/revocation](https://github.com/ucan-wg/revocation)** → Revocation spec + IPLD schema

### Reference Specifications  
- **[ChainAgnostic/varsig](https://github.com/ChainAgnostic/varsig)** → Variable signature specification
- **[ucan-wg/container](https://github.com/ucan-wg/container)** → Container format specification

### Implementation Libraries
- **[hugomrdias/iso-repo](https://github.com/hugomrdias/iso-repo)** → JavaScript/TypeScript implementation (`packages/iso-ucan/`)
- **[ucan-wg/rs-ucan](https://github.com/ucan-wg/rs-ucan)** → Rust implementation
- **[ucan-wg/go-ucan](https://github.com/ucan-wg/go-ucan)** → Go implementation

### Static Implementation Guides
- **`scripts/templates/libraries/implementation.md`** → UCAN Library Implementation Guide (manually maintained, reflects UCAN v1.0.0-rc.1 specification)

## Processing Workflow

The documentation processing happens in this sequence:

1. **specification** - Main UCAN specification (foundation for all others)
2. **delegation** - UCAN Delegation (extends main specification)
3. **invocation** - UCAN Invocation (builds on delegation concepts)
4. **promise** - UCAN Promise (referenced by invocation and revocation)
5. **revocation** - UCAN Revocation (depends on delegation and invocation)
6. **varsig** - Variable signature specification (used by UCAN implementations)
7. **container** - Container format (transport layer specification)
8. **libraries/implementation** - UCAN Library Implementation Guide (comprehensive v1.0 guide)
9. **libraries/javascript** - JavaScript/TypeScript implementation documentation
10. **libraries/rust** - Rust implementation documentation
11. **libraries/go** - Go implementation documentation

This order ensures that cross-references between specifications are resolved correctly during link processing.

## Link Processing and Cross-References

The system intelligently handles various types of links found in the source documentation:

### Cross-Specification Links
Automatically converts references between UCAN specifications:
- `[UCAN Delegation]` → `[UCAN Delegation](/delegation/)`
- `[UCAN Invocation]` → `[UCAN Invocation](/invocation/)`
- `[UCAN]` → `[UCAN](/specification/)`
- `[delegation]` → `[delegation](/delegation/)`

### Reference-Style Links
Converts GitHub repository links to internal documentation links:
- `[UCAN]: https://github.com/ucan-wg/spec` → `[UCAN]: /specification/`
- `[UCAN Delegation]: https://github.com/ucan-wg/delegation` → `[UCAN Delegation]: /delegation/`

### Section Links
Preserves internal document navigation:
- `[Subject]: #subject` → `[Subject]: #subject` (unchanged)

### External Links
Maintains links to external resources:
- Repository links to GitHub remain as external links
- NPM package links are preserved as external links
- Crate.io links are preserved as external links

## Configuration

The documentation processing system is configured through `src/config/content-processing.config.ts`:

```typescript
import { defineProcessingConfig } from '../../scripts/types/processing.types.js';

export default defineProcessingConfig({
  // Repository sources and their documentation paths
  specs: [
    { 
      name: 'specification', 
      title: 'UCAN Specification',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/spec/main/README.md',
      schemaUrl: null // No schema file for main spec
    },
    { 
      name: 'delegation', 
      title: 'UCAN Delegation',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/delegation/main/README.md',
      schemaUrl: 'https://raw.githubusercontent.com/ucan-wg/delegation/main/delegation.ipldsch'
    },
    // ... more specifications
  ],

  // Auto-generated sidebar configuration
  sidebarConfig: {
    sidebar: [
      {
        label: 'Overview',
        items: [
          { label: 'Introduction', slug: 'specification' },
        ],
      },
      {
        label: 'Guides',
        autogenerate: { directory: 'guides' },
      },
      // ... more sections
    ],
  },

  // Processing options
  options: {
    processSchemas: true,           // Process IPLD schema files
    createBackup: false,            // Don't backup existing files
    removeTitleFromBody: true,      // Remove title duplication
    maxDescriptionLength: 160,      // Max meta description length
  }
};
```

### Adding New Repositories

To add a new repository to the documentation:

1. Add an entry to the `specs` array in `src/config/content-processing.config.ts`
2. Include the GitHub raw URL for the README file
3. Optionally include a schema URL for IPLD schemas
4. Update the sidebar configuration if needed
5. Run `pnpm process-docs` to fetch and process the new content

## Generated Content

The processing system generates several types of content:

### 1. Processed Documentation Files
- **Location**: `/src/content/docs/`
- **Format**: Markdown files with Starlight-compatible frontmatter
- **Content**: Core specifications, library documentation, and guides
- **Features**: Cross-linked references, sanitized content, proper metadata

### 2. IPLD Schema Documentation  
- **Location**: `/src/content/docs/*/schema.md`
- **Source**: `.ipldsch` files from specification repositories
- **Format**: Formatted schema definitions with syntax highlighting

### 3. Implementation Guide
- **Location**: `/src/content/docs/libraries/implementation.md`
- **Source**: `scripts/templates/libraries/implementation.md` (manually maintained)
- **Content**: Comprehensive guide for implementing UCAN v1.0 libraries
- **Features**: Language-agnostic guidance, v1.0 envelope format, policy language implementation

### 4. Navigation Configuration
- **File**: `sidebar-config.json`
- **Purpose**: Auto-generated sidebar structure for Starlight
- **Content**: Hierarchical navigation reflecting the documentation structure

### 5. Enhanced Frontmatter
Each processed document includes:
```yaml
---
title: "Specification Title"
description: "Auto-extracted description from content"
version: "1.0.0-rc.1"  # Extracted from badges or headers
editUrl: "https://github.com/org/repo/blob/main/README.md"
---
```

## Technical Implementation

### Script Architecture

The documentation processing system consists of several key scripts with modular organization:

**Core Scripts:**
- **`scripts/process-docs.ts`**: Main processing script with GitHub integration and content transformation
- **`scripts/content-format.ts`**: Content formatting, validation, and cleanup utilities  
- **`scripts/link-processing.ts`**: Link resolution and cross-reference handling utilities
- **`scripts/verify-links.ts`**: Link validation and broken link detection

**Configuration & Types:**
- **`src/config/content-processing.config.ts`**: Main configuration file using `defineProcessingConfig` helper
- **`scripts/types/processing.types.ts`**: Interface definitions and helper functions
- **`scripts/utils/github.utils.ts`**: GitHub-related utility functions

**Static Templates:**
- **`scripts/templates/`**: Manually maintained content templates (guides, library documentation)

### Astro Integration

The website uses several Astro integrations for enhanced functionality:

- **Starlight**: Documentation framework with built-in search, navigation, and responsive design
- **Vue 3**: Interactive components for the homepage and enhanced user experiences
- **Mermaid**: Diagram rendering with automatic theme adaptation (light/dark modes)
- **astro-icon**: Comprehensive icon system using Lucide icons
- **Tailwind CSS**: Utility-first CSS framework for custom styling
- **robots.txt**: SEO configuration for search engine optimization

### Content Processing Features

- **Automatic Frontmatter Generation**: Extracts titles, descriptions, and metadata from content
- **Version Detection**: Identifies version information from badges and headers
- **Cross-Reference Resolution**: Intelligently links between related specifications
- **Content Sanitization**: Removes unnecessary sections and standardizes formatting
- **Schema Transformation**: Converts IPLD schemas to readable documentation format
- **Edit URL Generation**: Creates links back to source repositories for contribution
- **Static Template Processing**: Copies manually maintained guides (like Implementation Guide) to documentation structure

## Troubleshooting

### Common Issues

1. **GitHub Rate Limits**: If you encounter rate limiting, wait a few minutes before retrying the process
2. **Missing Schema Files**: Some specifications don't include IPLD schema files - this is expected behavior
3. **404 Errors**: Repositories may have moved or renamed their README files - update URLs in `src/config/content-processing.config.ts`
4. **Build Failures**: Ensure all dependencies are installed with `pnpm install` before running processing scripts

### Repository Changes

When source repositories change:

1. **Moved Repositories**: Update the `githubUrl` in `src/config/content-processing.config.ts` with the new location
2. **Filename Changes**: Check for case differences (README.md vs Readme.md) and update accordingly
3. **Organization Changes**: Update the GitHub organization/owner name in repository URLs
4. **Branch Changes**: Ensure the branch reference in GitHub URLs is correct (usually `main`)

### Updating Content

The processing system is designed to be run multiple times safely:

1. **Clean Processing**: Each run clears existing documentation and regenerates from scratch
2. **Incremental Updates**: Run `pnpm process-docs` to refresh only the documentation content  
3. **Full Rebuild**: Run `pnpm build` for complete site regeneration including documentation processing
4. **Development Mode**: Use `pnpm dev` after processing to see changes immediately

### Development Workflow

```bash
# Recommended development workflow
pnpm install           # Install dependencies
pnpm process-docs      # Fetch latest documentation
pnpm content-format    # Format and validate content
pnpm dev              # Start development server at localhost:4321
```

## Maintenance and Updates

### Regular Maintenance Tasks

1. **Update Dependencies**: Keep Astro, Starlight, and other dependencies current
2. **Monitor Source Repositories**: Watch for changes in UCAN specification repositories
3. **Link Validation**: Periodically check for broken external links
4. **Performance Monitoring**: Ensure the site builds and loads efficiently
5. **Implementation Guide Updates**: Keep the implementation guide current with UCAN specification changes

### Implementation Guide Maintenance

The Implementation Guide (`scripts/templates/libraries/implementation.md`) requires manual maintenance:

1. **Specification Updates**: When UCAN specifications change, review and update the guide accordingly
2. **Version Tracking**: Update version references (currently v1.0.0-rc.1) when new versions are released
3. **Code Examples**: Verify example code remains accurate with specification changes
4. **Language Support**: Add new language-specific guidance as implementations emerge
5. **Best Practices**: Update security and performance recommendations based on community feedback

### Adding New Content Types

To extend the system with new content types:

1. Add new repository configurations to `src/config/content-processing.config.ts`
2. Update sidebar configuration for new navigation sections  
3. Modify link processing rules if needed for new cross-references
4. Test processing and verify content renders correctly

### SEO and Optimization

The site includes several SEO optimizations:

- **Meta Tags**: Auto-generated descriptions and titles
- **Structured Data**: Proper heading hierarchy and semantic markup
- **robots.txt**: Configured to prevent indexing during development
- **Performance**: Optimized images and efficient asset loading
