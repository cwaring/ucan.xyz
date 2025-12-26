[![UCAN.xyz](https://repository-images.githubusercontent.com/1018732895/10824ea6-7a51-489f-9c7f-e29e2a714d1e)](https://ucan.xyz)

# UCAN.xyz

Documentation website for the User-Controlled Authorization Network (UCAN) v1.0 specification. UCAN is a trustless, secure, local-first, user-originated authorization scheme that provides public-key verifiable, delegable, and openly extensible capabilities.

This site aggregates documentation from [UCAN Working Group](https://github.com/ucan-wg) repositories into a unified reference.

## Commands

| Command              | Action                                              |
| :------------------- | :-------------------------------------------------- |
| `pnpm install`       | Install dependencies                                |
| `pnpm dev`           | Start dev server at `localhost:4321`                |
| `pnpm build`         | Process docs and build production site to `./dist/` |
| `pnpm process-docs`  | Fetch and process documentation from GitHub         |
| `pnpm lint`          | Run ESLint                                          |

## Development

Built with [Astro Starlight](https://starlight.astro.build/), Vue 3, and Tailwind CSS.

See [DOCUMENTATION.md](./DOCUMENTATION.md) for details on the processing system and repository sources.

## Contributing

- **Specification changes**: Submit to the relevant [ucan-wg](https://github.com/ucan-wg) repository
- **Website changes**: Submit PRs to this repository
- **New libraries**: Add to `src/config/content-processing.config.ts`

## Resources

- [UCAN Specification](https://github.com/ucan-wg/spec)
- [UCAN Working Group](https://github.com/ucan-wg)
- [Discord](https://discord.gg/zSfgeHhKxA)
