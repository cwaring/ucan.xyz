[![UCAN.xyz](https://github.com/user-attachments/assets/823b0d64-1d4d-494d-8e53-ae8b83612ece)](https://ucan.xyz)

# UCAN.xyz

The official documentation website for the User-Controlled Authorization Network (UCAN) specification and ecosystem. This website automatically aggregates and processes documentation from multiple UCAN Working Group repositories to provide a unified documentation experience.

## 🚀 Project Overview

UCAN.xyz is a comprehensive documentation website built with Astro Starlight that automatically processes and aggregates documentation from multiple GitHub repositories in the UCAN ecosystem. The site provides:

- **Unified Documentation**: Aggregates specs from multiple UCAN Working Group repositories
- **Automated Processing**: Scripts that fetch, process, and format documentation from GitHub
- **Interactive Features**: Custom Vue components, Mermaid diagrams, and responsive design
- **Library Documentation**: Comprehensive coverage of UCAN implementations across languages
- **Implementation Guide**: Step-by-step guide for building UCAN libraries in any language
- **SEO Optimized**: Configured for search engines with proper meta tags and structured content

## 🏗️ Architecture

The website consists of several key components:

### Static Website
- **Framework**: Astro with Starlight for documentation
- **UI Components**: Vue 3 components with Tailwind CSS styling
- **Icons**: Lucide icons via astro-icon
- **Diagrams**: Mermaid.js for interactive diagrams

### Documentation Processing
- **GitHub Integration**: Fetches README files directly from UCAN repositories
- **Content Transformation**: Converts GitHub markdown to Starlight-compatible format
- **Link Processing**: Automatically resolves cross-references between specifications
- **Schema Processing**: Converts IPLD schema files to documentation format

### Site Structure
```
├── Home Page (/)              # Landing page with UCAN overview and features
├── Documentation (/docs/)     # Starlight-powered documentation
│   ├── Overview
│   │   └── Introduction       # Main UCAN specification
│   ├── Guides
│   │   ├── Getting Started    # Tutorial and quick start
│   │   └── Examples          # Code examples and use cases
│   ├── Core Specifications
│   │   ├── Delegation        # UCAN Delegation spec + schema
│   │   ├── Invocation        # UCAN Invocation spec + schema  
│   │   ├── Promise           # UCAN Promise spec
│   │   └── Revocation        # UCAN Revocation spec + schema
│   ├── References
│   │   ├── Variable Signature # VarSig specification
│   │   └── Container         # Container format specification
│   └── Libraries
│       ├── Implementation    # UCAN Library Implementation Guide
│       ├── JavaScript        # JavaScript/TypeScript implementations
│       ├── Rust             # Rust implementation
│       └── Go               # Go implementation
├── About (/about/)           # About UCAN and the working group
├── Libraries (/libraries/)   # Library showcase and comparison
├── Getting Started (/getting-started/) # Interactive getting started guide
└── Inspector (/inspector/)   # UCAN token inspector tool
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`                 | Starts local dev server at `localhost:4321`     |
| `pnpm build`               | Processes docs and builds production site to `./dist/` |
| `pnpm preview`             | Preview your build locally, before deploying    |
| `pnpm process-docs`        | Fetch and process documentation from GitHub     |
| `pnpm content-format`      | Format and validate processed content           |
| `pnpm lint`                | Run ESLint on the codebase                      |
| `pnpm lint:fix`            | Run ESLint and automatically fix issues         |

## 📚 Documentation Processing

The site uses automated scripts to fetch and process documentation from GitHub repositories. For detailed information about the processing system, see [DOCUMENTATION.md](./DOCUMENTATION.md).

### Processing Workflow
1. **`pnpm process-docs`** - Fetches README files from UCAN GitHub repositories
2. **`pnpm content-format`** - Formats and validates the processed content
3. **`pnpm build`** - Runs processing scripts and builds the static site

### Source Repositories
The documentation is automatically pulled from these repositories:

**Core Specifications:**
- [ucan-wg/spec](https://github.com/ucan-wg/spec) → Introduction
- [ucan-wg/delegation](https://github.com/ucan-wg/delegation) → Delegation spec + schema
- [ucan-wg/invocation](https://github.com/ucan-wg/invocation) → Invocation spec + schema
- [ucan-wg/promise](https://github.com/ucan-wg/promise) → Promise spec
- [ucan-wg/revocation](https://github.com/ucan-wg/revocation) → Revocation spec + schema

**References:**
- [ChainAgnostic/varsig](https://github.com/ChainAgnostic/varsig) → Variable Signature spec
- [ucan-wg/container](https://github.com/ucan-wg/container) → Container format spec

**Libraries:**
- [hugomrdias/iso-repo](https://github.com/hugomrdias/iso-repo) → JavaScript implementation
- [ucan-wg/rs-ucan](https://github.com/ucan-wg/rs-ucan) → Rust implementation  
- [ucan-wg/go-ucan](https://github.com/ucan-wg/go-ucan) → Go implementation

### Processing Features
- **Link Resolution**: Automatically converts cross-references between specs
- **Schema Integration**: Processes IPLD schema files into readable documentation
- **Frontmatter Generation**: Adds titles, descriptions, and edit links
- **Content Sanitization**: Removes editor/author sections and formats content
- **Sidebar Generation**: Auto-updates navigation based on processed content
- **Implementation Guide**: Includes comprehensive UCAN v1.0 library development guide

## 🛠️ Development

### Project Structure
```
.
├── public/                    # Static assets (favicons, images)
├── scripts/                   # Documentation processing scripts
│   ├── process-docs.js        # Main GitHub fetching and processing
│   ├── content-format.js      # Content formatting and validation
│   ├── config.js             # Repository URLs and processing config
│   ├── link-processing.js    # Link resolution utilities
│   └── verify-links.js       # Link validation utilities
├── src/
│   ├── assets/               # Images and media assets
│   ├── components/           # Astro and Vue components
│   │   ├── sections/         # Homepage sections (Hero, Features, etc.)
│   │   └── ui/              # Reusable UI components
│   ├── content/
│   │   └── docs/            # Generated documentation (auto-generated)
│   ├── layouts/             # Astro layout components
│   ├── pages/               # Static pages (about, libraries, etc.)
│   └── styles/              # Global CSS and Starlight customizations
├── astro.config.mjs          # Astro configuration with integrations
├── sidebar-config.json       # Generated sidebar configuration
└── package.json             # Dependencies and scripts
```

### Key Integrations
- **Starlight**: Documentation framework with search and navigation
- **Vue 3**: Interactive components and animations
- **Tailwind CSS**: Utility-first CSS framework
- **Mermaid**: Diagram rendering with theme support
- **astro-icon**: Icon system with Lucide icons
- **robots.txt**: SEO configuration to prevent indexing during development

## 👀 Want to learn more?

- **Processing System**: Check out [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed information about the automated documentation processing system
- **UCAN Specification**: Read the [main UCAN spec](https://github.com/ucan-wg/spec) to understand the core concepts
- **UCAN Working Group**: Visit the [UCAN Working Group](https://github.com/ucan-wg) for all related repositories
- **Starlight Documentation**: Read [Starlight's docs](https://starlight.astro.build/) for framework-specific guidance
- **Astro Documentation**: Explore [the Astro documentation](https://docs.astro.build) for advanced configuration
- **Discord Community**: Join the [UCAN Discord](https://discord.gg/zSfgeHhKxA) for community discussions

## 🔄 Updating Documentation

The documentation is automatically synchronized with the source repositories. To update:

1. **Automatic Updates**: The build process (`pnpm build`) automatically fetches the latest content
2. **Manual Refresh**: Run `pnpm process-docs` to refresh all documentation immediately
3. **Configuration**: Edit `scripts/config.js` to add new repositories or modify processing rules

For detailed information about configuring and troubleshooting the processing system, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## 📝 Contributing

To contribute to the documentation:

1. **Specification Changes**: Submit changes to the relevant repository (e.g., [ucan-wg/spec](https://github.com/ucan-wg/spec))
2. **Website Changes**: Submit PRs to this repository for website improvements
3. **New Libraries**: Add new library repositories to `scripts/config.js`

## 📄 License

This project follows the licensing of the UCAN specifications and implementations it documents.
