# addonCollectionGet

## Overview

Fetches the authenticated user's installed addon collection from the Stremio server. Returns an array of addon descriptors with their manifests and metadata.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/addonCollectionGet
```

## Headers

| Header       | Value            | Required |
|--------------|------------------|----------|
| Content-Type | application/json | Yes      |

## Request Body

```json
{
  "authKey": "YOUR_AUTH_KEY",
  "update": true,
  "addFromURL": []
}
```

| Field      | Type     | Required | Description                                                        |
|------------|----------|----------|--------------------------------------------------------------------|
| authKey    | string   | Yes      | Active session token                                               |
| update     | boolean  | No       | When `true`, forces a fresh fetch from the server                  |
| addFromURL | string[] | No       | Legacy addon URLs to migrate into the collection (deprecated flow) |

## Response

**Success (200)**

```json
{
  "result": {
    "addons": [
      {
        "transportUrl": "https://v3-cinemeta.strem.io/manifest.json",
        "transportName": "http",
        "manifest": {
          "id": "com.linvo.cinemeta",
          "version": "3.0.12",
          "name": "Cinemeta",
          "description": "The official addon for movie and series info",
          "types": ["movie", "series"],
          "resources": ["meta", "catalog"],
          "catalogs": [
            {
              "type": "movie",
              "id": "top",
              "name": "Popular"
            }
          ],
          "logo": "https://v3-cinemeta.strem.io/images/cinemeta-logo.png",
          "behaviorHints": {}
        },
        "flags": {
          "official": true,
          "protected": true
        }
      },
      {
        "transportUrl": "https://example-addon.com/manifest.json",
        "transportName": "http",
        "manifest": {
          "id": "org.example.myaddon",
          "version": "1.0.0",
          "name": "My Custom Addon",
          "description": "An example third-party addon",
          "types": ["movie"],
          "resources": ["stream"],
          "catalogs": []
        },
        "flags": {}
      }
    ],
    "lastModified": "2026-04-07T10:00:00.000Z"
  }
}
```

**Error**

```json
{
  "error": {
    "message": "Invalid authKey"
  }
}
```

## Example (curl)

```bash
curl -X POST "https://api.strem.io/api/addonCollectionGet" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "update": true
  }'
```

## Notes

- The **order of the `addons` array** is significant — it determines the priority/display order in Stremio. The first addon in the array has the highest priority.
- Each addon descriptor contains:
  - `transportUrl` — the URL to the addon's `manifest.json`
  - `transportName` — always `"http"` for HTTP-based addons
  - `manifest` — the full addon manifest object (max 8KB)
  - `flags` — metadata about the addon:
    - `official` — whether it's an official Stremio addon
    - `protected` — if `true`, the addon cannot be removed by the user
- The `lastModified` timestamp is used by clients to detect stale data and avoid overwriting newer server state with older local state.
- Some third-party clients include a `type` field (e.g., `"type": "AddonCollectionGet"`) in the request, but this is not required by the official API.
- The `addFromURL` field is a legacy migration mechanism from older Stremio addon formats. It is safe to omit or pass an empty array.
