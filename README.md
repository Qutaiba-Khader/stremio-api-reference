# Stremio API Reference

Organized documentation of the Stremio API with testable samples.

## Purpose

This repository provides clear, structured documentation for the Stremio API, including endpoint references, authentication guides, and ready-to-use request samples that can be tested directly.

## Scopes Covered

- **Authentication** — login, register, logout, getUser
- **Addon Collection Management** — fetch, save, install, remove, and publish addons
- **Addon Ordering / Sorting** — how addon priority is represented and persisted
- **Backup / Restore** — export and import addon collections as JSON

**Planned:** A GitHub Pages testing UI for interactive API exploration.

## Entry Point

See **[docs/README.md](docs/README.md)** for a full index of all documented endpoints with links to docs, JSON samples, and curl scripts.

## Folder Structure

```
stremio-api-reference/
├── docs/
│   ├── README.md           # Endpoint index (start here)
│   ├── TEMPLATE.md         # Standard structure for endpoint docs
│   ├── endpoints/          # Individual endpoint documentation
│   └── authentication/     # Auth flow overview
├── samples/
│   ├── curl/               # Copy-paste curl commands (.sh)
│   └── json/               # Request/response JSON examples
├── references/             # Additional reference material
└── README.md
```

## Primary Source

Documentation is derived from the official [stremio-api-client](https://github.com/Stremio/stremio-api-client) repository, cross-referenced with:
- [stremio-addon-sdk](https://github.com/Stremio/stremio-addon-sdk)
- [stremio-addon-manager](https://github.com/pancake3000/stremio-addon-manager)
- [AIOManager](https://github.com/Sonicx161/AIOManager)
- [stremio-addon-organizer](https://github.com/sleeyax/stremio-addon-organizer)

## License

MIT
