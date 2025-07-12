# UCAN Documentation Processing Script

This script processes UCAN specification documents from the `/spec/*` folder and converts them into a structured documentation website using Astro Starlight.

## Features

- **Automatic Processing**: Converts README.md files from spec directories into Starlight-compatible documentation
- **Clean Slate**: Automatically clears existing documentation before processing to ensure fresh output
- **Proper Ordering**: Processes specs in dependency order to ensure correct cross-references
- **Link Resolution**: Automatically converts cross-references between specifications
- **Schema Integration**: Processes IPLD schema files and creates dedicated schema documentation
- **Sidebar Generation**: Auto-generates sidebar configuration for proper navigation
- **Frontmatter Generation**: Adds appropriate frontmatter with titles and descriptions
- **Metadata Cleanup**: Removes editor/author sections that aren't needed in docs
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

The script processes the following structure:

```
/spec/                          # Source specifications
├── spec/README.md             → /src/content/docs/specification/index.md
├── delegation/README.md       → /src/content/docs/delegation/index.md
├── delegation/delegation.ipldsch → /src/content/docs/delegation/schema.md
├── invocation/README.md       → /src/content/docs/invocation/index.md
├── invocation/invocation.ipldsch → /src/content/docs/invocation/schema.md
├── revocation/README.md       → /src/content/docs/revocation/index.md
├── revocation/revocation.ipldsch → /src/content/docs/revocation/schema.md
├── promise/README.md          → /src/content/docs/promise/index.md
├── container/README.md        → /src/content/docs/container/index.md
└── varsig/README.md           → /src/content/docs/varsig/index.md
```

## Processing Order

The script processes specifications in dependency order:

1. **specification** - Main UCAN specification (foundation)
2. **varsig** - Variable signature spec (used by others)
3. **delegation** - UCAN Delegation (depends on main spec)
4. **invocation** - UCAN Invocation (depends on delegation)
5. **revocation** - UCAN Revocation (depends on delegation & invocation)
6. **promise** - UCAN Promise (referenced by others)
7. **container** - Container format (transport layer)

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

## Configuration

The script can be configured by editing `scripts/config.js`:

```javascript
export const PROCESSING_CONFIG = {
  specOrder: [
    { name: 'specification', source: 'spec', title: 'UCAN Specification' },
    // ... more specs
  ],
  linkMappings: {
    '[UCAN]': '/specification/',
    // ... more mappings
  },
  // ... other options
};
```

## Generated Files

The script generates:

1. **Processed Documentation**: Markdown files in `/src/content/docs/`
2. **Schema Documentation**: IPLD schema files converted to markdown
3. **Sidebar Configuration**: JSON file with navigation structure
4. **Updated Landing Page**: Enhanced homepage with UCAN overview

## Troubleshooting

### Common Issues

1. **Missing Schema Files**: Some specs don't have IPLD schema files - this is normal
2. **Syntax Highlighting Warnings**: IPLD schema syntax highlighting may not be available
3. **Link Resolution**: If links aren't working, check the `linkMappings` configuration

### Re-running Processing

The script is safe to run multiple times - it will automatically clear the existing documentation directory and regenerate everything from scratch. This ensures you always get a clean, up-to-date version of the documentation.

### Development Server

After processing, start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## Script Architecture

- **`scripts/process-docs.js`**: Main processing script
- **`scripts/config.js`**: Configuration file
- **`sidebar-config.json`**: Generated sidebar configuration

## Future Enhancements

Potential improvements:

1. **Incremental Processing**: Only process changed files
2. **Custom Syntax Highlighting**: Add support for IPLD schema syntax
3. **Link Validation**: Verify all internal links are valid
4. **Image Processing**: Handle images from spec directories
5. **Cross-Reference Index**: Generate index of cross-references between specs
