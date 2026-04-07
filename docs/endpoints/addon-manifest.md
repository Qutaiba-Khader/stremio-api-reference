# Addon Manifest Fetch

## Overview

Fetches an addon's manifest from its transport URL. This is a direct GET request to the addon server, not to the Stremio API. The manifest describes the addon's capabilities, resources, and metadata.

## HTTP Method

```
GET
```

## URL

```
https://{addon-host}/manifest.json
```

For addons with user configuration:

```
https://{addon-host}/{url-encoded-config}/manifest.json
```

## Headers

| Header | Value            | Required |
|--------|------------------|----------|
| Accept | application/json | No       |

## Request Body

None (GET request).

## Response

**Success (200)**

```json
{
  "id": "org.example.myaddon",
  "version": "1.0.0",
  "name": "My Addon",
  "description": "An example Stremio addon",
  "resources": ["catalog", "stream"],
  "types": ["movie", "series"],
  "catalogs": [
    {
      "type": "movie",
      "id": "topmovies",
      "name": "Top Movies"
    }
  ],
  "logo": "https://example.com/logo.png",
  "background": "https://example.com/bg.jpg",
  "contactEmail": "addon@example.com",
  "behaviorHints": {
    "adult": false,
    "p2p": false,
    "configurable": false,
    "configurationRequired": false
  },
  "idPrefixes": ["tt"]
}
```

**Error (404 / timeout)**

The addon server is down or the URL is invalid. No standard error format — clients should handle HTTP errors and timeouts.

## Example (curl)

```bash
curl -s "https://v3-cinemeta.strem.io/manifest.json" | jq .
```

With configuration:

```bash
curl -s "https://example-addon.com/%7B%22lang%22%3A%22en%22%7D/manifest.json" | jq .
```

## Manifest Fields Reference

### Required

| Field       | Type     | Description                                          |
|-------------|----------|------------------------------------------------------|
| id          | string   | Unique addon identifier (reverse-domain recommended) |
| version     | string   | Semver version string                                |
| name        | string   | Human-readable addon name                            |
| description | string   | Brief description of the addon                       |
| resources   | array    | Resources provided: `catalog`, `meta`, `stream`, `subtitles`, `addon_catalog` |
| types       | array    | Content types handled: `movie`, `series`, `channel`, `tv` |
| catalogs    | array    | Catalog definitions (can be empty `[]`)              |

### Optional

| Field         | Type   | Description                                                |
|---------------|--------|------------------------------------------------------------|
| logo          | string | URL to a 256x256 monochrome PNG logo                       |
| background    | string | URL to a background image (min 1024x786)                   |
| contactEmail  | string | Contact email for issues                                   |
| behaviorHints | object | Flags: `adult`, `p2p`, `configurable`, `configurationRequired` |
| idPrefixes    | array  | Only respond to content IDs matching these prefixes        |
| config        | array  | User configuration fields (see below)                      |

### Config Field Types

```json
{
  "config": [
    { "key": "username", "type": "text", "title": "Username", "required": true },
    { "key": "password", "type": "password", "title": "Password", "required": true },
    { "key": "quality", "type": "select", "title": "Quality", "options": ["480p", "720p", "1080p"], "default": "720p" },
    { "key": "adult", "type": "checkbox", "title": "Include adult content" }
  ]
}
```

Supported types: `text`, `number`, `password`, `checkbox`, `select`

## Notes

- Manifests must be **8KB or less** when JSON-serialized, as enforced by the `addonCollectionSet` API.
- Addon servers must serve CORS headers (`Access-Control-Allow-Origin: *`) for browser-based clients. The Stremio addon SDK handles this automatically.
- When an addon has `configurable` or `configurationRequired` set, the manifest served **after configuration** strips those hints (so Stremio doesn't keep showing the configure prompt).
- AIOManager appends a cache-buster query parameter (`?cb=...`) to force fresh fetches, using a 30-minute interval.
- For well-known Stremio domains (`v3-cinemeta.strem.io`, `opensubtitles-v3.strem.io`, etc.), clients can fetch manifests directly. For third-party addons, a CORS proxy may be needed in browser contexts.
- To validate an addon URL, fetch its manifest and confirm the response is valid JSON with the required fields (`id`, `version`, `name`, `resources`, `types`, `catalogs`).
