# Stremio API Reference

Organized documentation of the Stremio API with testable samples.

## Purpose

This repository provides clear, structured documentation for the Stremio API, including endpoint references, authentication guides, and ready-to-use request samples that can be tested directly.

## Try It Live

An interactive testing UI is available at:\
**https://qutaiba-khader.github.io/stremio-api-reference/**

Login with your Stremio credentials (or paste an authKey) to view, reorder, add, remove, test, backup, and restore your addon collection — all from the browser.

## Scopes Covered

- **Authentication** — login, register, logout, getUser, saveUser, loginWithToken, authWithApple
- **Addon Collection Management** — fetch, save, install, remove, and publish addons
- **Addon Ordering / Sorting** — how addon priority is represented and persisted
- **Backup / Restore** — export and import addon collections as JSON
- **Datastore** — library and watch history (datastoreGet, datastorePut)

## Entry Point

See **[docs/README.md](docs/README.md)** for a full index of all documented endpoints with links to docs, JSON samples, and curl scripts.

## Folder Structure

```
stremio-api-reference/
├── docs/
│   ├── README.md           # Endpoint index (start here)
│   ├── TEMPLATE.md         # Standard structure for endpoint docs
│   ├── NOTES.md            # Research notes, assumptions, conflicts
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
