# UCAN Documentation Processing Script

This script processes UCAN specification documents from GitHub repositories and converts them into a structured documentation website using Astro Starlight.

## Features

- **GitHub Integration**: Fetches README.md files directly from GitHub repositories
- **Automatic Processing**: Converts GitHub-hosted markdown files into Starlight-compatible documentation
- **Clean Slate**: Automatically clears existing documentation before processing to ensure fresh output
- **Proper Ordering**: Processes specs in dependency order to ensure correct cross-references
- **Link Resolution**: Automatically converts cross-references between specifications
- **Schema Integration**: Processes IPLD schema files and creates dedicated schema documentation
- **Sidebar Generation**: Auto-generates sidebar configuration for proper navigation
- **Frontmatter Generation**: Adds appropriate frontmatter with titles and descriptions
- **Metadata Cleanup**: Removes editor/author sections that aren't needed in docs
- **Library Documentation**: Includes UCAN implementation libraries across multiple languages
- **Mermaid Diagrams**: Supports Mermaid diagrams for visualizing concepts
- **Git Integration**: Generated documentation is gitignored to avoid committing processed files

## Usage

### Quick Start

```bash
# Process all documentation
npm run process-docs

# Start the development server
npm run dev
```

### Manual Processing

```bash
# Run the script directly
node scripts/process-docs.js
```

## Directory Structure

The script processes GitHub repositories and creates the following structure:

```
GitHub Sources                    → Generated Documentation
├── ucan-wg/spec/README.md       → /src/content/docs/specification/index.md
├── ucan-wg/delegation/README.md → /src/content/docs/delegation/index.md
├── ucan-wg/delegation/delegation.ipldsch → /src/content/docs/delegation/schema.md
├── ucan-wg/invocation/README.md → /src/content/docs/invocation/index.md
├── ucan-wg/invocation/invocation.ipldsch → /src/content/docs/invocation/schema.md
├── ucan-wg/revocation/README.md → /src/content/docs/revocation/index.md
├── ucan-wg/revocation/revocation.ipldsch → /src/content/docs/revocation/schema.md
├── ucan-wg/promise/README.md    → /src/content/docs/promise/index.md
├── ucan-wg/container/Readme.md  → /src/content/docs/container/index.md
├── ChainAgnostic/varsig/README.md → /src/content/docs/varsig/index.md
├── hugomrdias/iso-repo/packages/iso-ucan/readme.md    → /src/content/docs/libraries/javascript/index.md
├── ucan-wg/rs-ucan/README.md    → /src/content/docs/libraries/rust/index.md
├── ucan-wg/go-ucan/Readme.md    → /src/content/docs/libraries/go/index.md
├── fission-suite/fission/hs-ucan/README.md → /src/content/docs/libraries/haskell/index.md
├── ipld/js-dag-ucan/README.md   → /src/content/docs/libraries/js-dag-ucan/index.md
└── storacha/ucanto/Readme.md    → /src/content/docs/libraries/ucanto/index.md
```

## Processing Order

The script processes specifications in dependency order:

1. **specification** - Main UCAN specification (foundation)
2. **delegation** - UCAN Delegation (depends on main spec)
3. **invocation** - UCAN Invocation (depends on delegation)
4. **promise** - UCAN Promise (referenced by others)
5. **revocation** - UCAN Revocation (depends on delegation & invocation)
6. **varsig** - Variable signature spec (used by others)
7. **container** - Container format (transport layer)
8. **libraries/javascript** - JavaScript implementation
9. **libraries/rust** - Rust implementation
10. **libraries/go** - Go implementation
11. **libraries/haskell** - Haskell implementation
12. **libraries/js-dag-ucan** - UCAN IPLD (JavaScript)
13. **libraries/ucanto** - UCAN-RPC (JavaScript)

## GitHub Source Repositories

The script fetches documentation from these repositories:

### Core Specifications
- **ucan-wg/spec** - Main UCAN specification
- **ucan-wg/delegation** - UCAN Delegation
- **ucan-wg/invocation** - UCAN Invocation
- **ucan-wg/promise** - UCAN Promise
- **ucan-wg/revocation** - UCAN Revocation
- **ucan-wg/container** - Container format
- **ChainAgnostic/varsig** - Variable signature

### Libraries
- **hugomrdias/iso-repo** - JavaScript implementation
- **ucan-wg/rs-ucan** - Rust implementation
- **ucan-wg/go-ucan** - Go implementation
- **fission-suite/fission** - Haskell implementation
- **ipld/js-dag-ucan** - UCAN IPLD (JavaScript)
- **storacha/ucanto** - UCAN-RPC (JavaScript)

## Link Processing

The script automatically handles:

### Cross-Specification Links
- `[UCAN Delegation]` → `[UCAN Delegation](/delegation/)`
- `[UCAN Invocation]` → `[UCAN Invocation](/invocation/)`
- `[UCAN]` → `[UCAN](/specification/)`
- `[delegation]` → `[delegation](/delegation/)`

### Reference-Style Links
- `[UCAN]: https://github.com/ucan-wg/spec` → `[UCAN]: /specification/`
- `[UCAN Delegation]: https://github.com/ucan-wg/delegation` → `[UCAN Delegation]: /delegation/`

### Internal Section Links
- `[Subject]: #subject` → `[Subject]: #subject` (preserved)

### GitHub External Links
- Repository links are preserved as external links
- NPM package links are preserved as external links
- Crate.io links are preserved as external links

## Configuration

The script can be configured by editing `scripts/config.js`:

```javascript
export const PROCESSING_CONFIG = {
  specs: [
    { 
      name: 'specification', 
      title: 'UCAN Specification',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/spec/main/README.md',
      schemaUrl: null
    },
    // ... more specs and libraries
  ],
  linkMappings: {
    '[UCAN]': '/specification/',
    // ... more mappings
  },
  sidebarConfig: {
    sidebar: [
      {
        label: 'Overview',
        items: [
          { label: 'Introduction', slug: 'specification' },
        ],
      },
      {
        label: 'Libraries',
        items: [
          { label: 'TypeScript', slug: 'libraries/typescript' },
          { label: 'Rust', slug: 'libraries/rust' },
          // ... more libraries
        ],
      },
    ],
  },
  // ... other options
};
```

## Generated Files

The script generates:

1. **Processed Documentation**: Markdown files in `/src/content/docs/`
   - Core specifications (delegation, invocation, etc.)
   - Library implementations (JavaScript, Rust, Go, etc.)
   - Generated guides and examples
2. **Schema Documentation**: IPLD schema files converted to markdown
3. **Sidebar Configuration**: JSON file with navigation structure including Libraries section
4. **Updated Landing Page**: Enhanced homepage with UCAN overview and library cards
5. **Mermaid Diagrams**: Interactive diagrams for visualizing UCAN concepts

## Troubleshooting

### Common Issues

1. **GitHub Rate Limits**: If you hit GitHub API limits, wait a few minutes before retrying
2. **Missing Schema Files**: Some specs don't have IPLD schema files - this is normal
3. **404 Errors**: Some repositories may have moved or renamed their README files
4. **Syntax Highlighting Warnings**: IPLD schema syntax highlighting may not be available
5. **Link Resolution**: If links aren't working, check the `linkMappings` configuration

### Repository Changes

If a repository moves or changes structure:
1. Update the `githubUrl` in `scripts/config.js`
2. Check if the README filename changed (README.md vs Readme.md)
3. Update the organization name if the repo moved

### Re-running Processing

The script is safe to run multiple times - it will automatically clear the existing documentation directory and regenerate everything from scratch. This ensures you always get a clean, up-to-date version of the documentation.

### Development Server

After processing, start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## Script Architecture

- **`scripts/process-docs.js`**: Main processing script with GitHub integration
- **`scripts/config.js`**: Configuration file with GitHub URLs and library definitions
- **`sidebar-config.json`**: Generated sidebar configuration (auto-updated)
- **`astro.config.mjs`**: Astro configuration with Mermaid support

## Development Features

### Astro Starlight Integration
- **Responsive documentation** with dark/light theme support
- **Search functionality** across all content
- **Navigation breadcrumbs** and previous/next links
- **Mobile-friendly** responsive design

### Mermaid Diagram Support
- **Interactive diagrams** using `astro-mermaid` integration
- **Theme-aware rendering** that adapts to light/dark modes
- **Performance optimized** with client-side rendering

### Content Processing
- **Automatic frontmatter generation** with titles and descriptions
- **Version extraction** from various markdown patterns
- **Cross-reference resolution** between specifications
- **GitHub link preservation** for external resources

## Future Enhancements

Potential improvements:

1. **Incremental Processing**: Only process changed files based on GitHub commit SHAs
2. **Custom Syntax Highlighting**: Add support for IPLD schema syntax
3. **Link Validation**: Verify all internal links are valid during processing
4. **Image Processing**: Handle images from GitHub repositories
5. **Cross-Reference Index**: Generate index of cross-references between specs
6. **Automated Updates**: GitHub Actions to update docs when specs change
7. **Library Statistics**: Fetch and display GitHub stars, downloads, etc.
8. **Version Management**: Support multiple versions of specifications
