[![UCAN.xyz](https://repository-images.githubusercontent.com/1018732895/03266f7d-d715-4c9f-ac7b-f52f860dbfab)](https://ucan.xyz)

# UCAN.xyz

Documentation website for the User-Controlled Authorization Network (UCAN) v1.0 specification. UCAN is a trustless, secure, local-first, user-originated authorization scheme that provides public-key verifiable, delegable, and openly extensible capabilities.

This site aggregates documentation from UCAN Working Group repositories into a unified reference.

## Commands

| Command              | Action                                              |
| :------------------- | :-------------------------------------------------- |
| `pnpm install`       | Install dependencies                                |
| `pnpm dev`           | Start dev server at `localhost:4321`                |
| `pnpm build`         | Process docs and build production site to `./dist/` |
| `pnpm preview`       | Preview build locally                               |
| `pnpm process-docs`  | Fetch and process documentation from GitHub         |
| `pnpm content-format`| Format and validate processed content               |
| `pnpm lint`          | Run ESLint                                          |
| `pnpm lint:fix`      | Run ESLint with auto-fix                            |

## Source Repositories

Documentation is pulled from these repositories:

**Core Specifications:**
- [ucan-wg/spec](https://github.com/ucan-wg/spec) - Main specification
- [ucan-wg/delegation](https://github.com/ucan-wg/delegation) - Delegation spec + schema
- [ucan-wg/invocation](https://github.com/ucan-wg/invocation) - Invocation spec + schema
- [ucan-wg/promise](https://github.com/ucan-wg/promise) - Promise spec
- [ucan-wg/revocation](https://github.com/ucan-wg/revocation) - Revocation spec + schema

**References:**
- [ChainAgnostic/varsig](https://github.com/ChainAgnostic/varsig) - Variable Signature spec
- [ucan-wg/container](https://github.com/ucan-wg/container) - Container format spec

**Libraries:**
- [hugomrdias/iso-repo](https://github.com/hugomrdias/iso-repo) - JavaScript (iso-ucan)
- [ucan-wg/rs-ucan](https://github.com/ucan-wg/rs-ucan) - Rust
- [ucan-wg/go-ucan](https://github.com/ucan-wg/go-ucan) - Go

## Development

Built with [Astro Starlight](https://starlight.astro.build/), Vue 3, and Tailwind CSS.

See [DOCUMENTATION.md](./DOCUMENTATION.md) for details on the automated processing system.

## Contributing

- **Specification changes**: Submit to the relevant [ucan-wg](https://github.com/ucan-wg) repository
- **Website changes**: Submit PRs to this repository
- **New libraries**: Add to `src/config/content-processing.config.ts`

## Resources

- [UCAN Specification](https://github.com/ucan-wg/spec)
- [UCAN Working Group](https://github.com/ucan-wg)
- [Discord](https://discord.gg/zSfgeHhKxA)
