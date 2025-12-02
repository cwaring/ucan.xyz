# Documentation Processing System

Automated system that fetches UCAN specification documents from GitHub repositories and converts them into unified documentation using Astro Starlight.

## Quick Start

```bash
pnpm install        # Install dependencies
pnpm process-docs   # Fetch documentation from GitHub
pnpm content-format # Format and validate content
pnpm dev            # Start dev server at localhost:4321
```

For production: `pnpm build` runs all processing and builds to `./dist/`.

## Repository Sources

### Core Specifications
| Repository | Output |
|------------|--------|
| [ucan-wg/spec](https://github.com/ucan-wg/spec) | Main specification |
| [ucan-wg/delegation](https://github.com/ucan-wg/delegation) | Delegation spec + schema |
| [ucan-wg/invocation](https://github.com/ucan-wg/invocation) | Invocation spec + schema |
| [ucan-wg/promise](https://github.com/ucan-wg/promise) | Promise spec |
| [ucan-wg/revocation](https://github.com/ucan-wg/revocation) | Revocation spec + schema |

### References
| Repository | Output |
|------------|--------|
| [ChainAgnostic/varsig](https://github.com/ChainAgnostic/varsig) | Variable signature spec |
| [ucan-wg/container](https://github.com/ucan-wg/container) | Container format spec |

### Libraries
| Repository | Output |
|------------|--------|
| [hugomrdias/iso-repo](https://github.com/hugomrdias/iso-repo) | JavaScript (iso-ucan) |
| [ucan-wg/rs-ucan](https://github.com/ucan-wg/rs-ucan) | Rust |
| [ucan-wg/go-ucan](https://github.com/ucan-wg/go-ucan) | Go |

### Static Templates
| Source | Output |
|--------|--------|
| `scripts/templates/guides/` | Getting started, examples |
| `scripts/templates/libraries/implementation.md` | Library implementation guide |

## Processing Features

- **GitHub Integration**: Fetches README.md and IPLD schema files directly from repositories
- **Link Resolution**: Converts cross-references between specifications (e.g., `[UCAN Delegation]` → `/delegation/`)
- **Schema Processing**: Converts `.ipldsch` files to documentation pages
- **Frontmatter Generation**: Adds titles, descriptions, version info, and edit URLs
- **Content Sanitization**: Removes editor/author sections, standardizes formatting
- **Sidebar Generation**: Auto-generates navigation from processed content

## Configuration

Edit `src/config/content-processing.config.ts` to modify repository sources:

```typescript
export default defineProcessingConfig({
  specs: [
    { 
      name: 'specification', 
      title: 'UCAN Specification',
      githubUrl: 'https://raw.githubusercontent.com/ucan-wg/spec/main/README.md',
      schemaUrl: null
    },
    // ... more specs
  ],
  sidebarConfig: { /* navigation structure */ },
  options: {
    processSchemas: true,
    maxDescriptionLength: 160,
  }
});
```

### Adding a New Repository

1. Add entry to `specs` array with `name`, `title`, `githubUrl`, and optional `schemaUrl`
2. Update `sidebarConfig` if needed
3. Run `pnpm process-docs`

## Output Structure

```
src/content/docs/
├── specification/index.md      # Main UCAN spec
├── delegation/
│   ├── index.md                # Delegation spec
│   └── schema.md               # IPLD schema
├── invocation/
│   ├── index.md
│   └── schema.md
├── promise/index.md
├── revocation/
│   ├── index.md
│   └── schema.md
├── varsig/index.md
├── container/index.md
├── guides/
│   ├── getting-started.md
│   └── examples.md
└── libraries/
    ├── implementation.md
    ├── javascript/index.mdx
    ├── rust/index.mdx
    └── go/index.mdx
```

## Script Architecture

| Script | Purpose |
|--------|---------|
| `scripts/process-docs.ts` | Main processing: fetches from GitHub, transforms content |
| `scripts/content-format.ts` | Formatting and validation |
| `scripts/link-processing.ts` | Cross-reference resolution |
| `scripts/verify-links.ts` | Broken link detection |
| `scripts/types/processing.types.ts` | TypeScript interfaces |
| `scripts/utils/github.utils.ts` | GitHub utilities |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| GitHub rate limits | Wait a few minutes, then retry |
| 404 errors | Update URLs in `content-processing.config.ts` |
| Missing schemas | Expected - not all specs have IPLD schemas |
| Build failures | Run `pnpm install` first |

## Maintenance

- **Specification updates**: Monitor [ucan-wg](https://github.com/ucan-wg) repositories for changes
- **Implementation guide**: Manually update `scripts/templates/libraries/implementation.md` when specs change
- **Link validation**: Run `pnpm verify-links` periodically
