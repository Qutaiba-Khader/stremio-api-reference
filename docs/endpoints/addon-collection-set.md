# addonCollectionSet

## Overview

Saves/updates the authenticated user's addon collection on the Stremio server. This is the single endpoint for installing, removing, and reordering addons — the entire collection is replaced atomically.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/addonCollectionSet
```

## Headers

| Header       | Value            | Required |
|--------------|------------------|----------|
| Content-Type | application/json | Yes      |

## Request Body

```json
{
  "authKey": "YOUR_AUTH_KEY",
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
        "catalogs": []
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
        "description": "An example addon",
        "types": ["movie"],
        "resources": ["stream"],
        "catalogs": []
      },
      "flags": {}
    }
  ]
}
```

| Field   | Type     | Required | Description                                    |
|---------|----------|----------|------------------------------------------------|
| authKey | string   | Yes      | Active session token                           |
| addons  | array    | Yes      | The complete addon collection (replaces existing) |

Each addon object in the array:

| Field         | Type   | Required | Description                              |
|---------------|--------|----------|------------------------------------------|
| transportUrl  | string | Yes      | URL to the addon's manifest.json         |
| transportName | string | No       | Transport type, typically `"http"`       |
| manifest      | object | Yes      | The addon's manifest object              |
| flags         | object | No       | Metadata flags (`official`, `protected`) |

## Response

**Success (200)**

```json
{
  "result": {
    "success": true
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
curl -X POST "https://api.strem.io/api/addonCollectionSet" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "addons": [
      {
        "transportUrl": "https://v3-cinemeta.strem.io/manifest.json",
        "transportName": "http",
        "manifest": {
          "id": "com.linvo.cinemeta",
          "version": "3.0.12",
          "name": "Cinemeta",
          "types": ["movie", "series"],
          "resources": ["meta", "catalog"],
          "catalogs": []
        },
        "flags": { "official": true, "protected": true }
      }
    ]
  }'
```

## Notes

- This is a **full replacement** — the server's addon collection is entirely replaced by the `addons` array you send. There is no partial update or patch mechanism.
- **Addon ordering** is determined by array position. Index 0 = highest priority. To reorder addons, rearrange the array and call this endpoint.
- **To install** a new addon: fetch the current collection, append the new addon descriptor, then call `addonCollectionSet`.
- **To remove** an addon: fetch the current collection, filter it out, then call `addonCollectionSet`. Addons with `flags.protected === true` should not be removed.
- The official client updates `lastModified` locally to `Date.now()` after pushing, to track sync state.
- AIOManager performs post-sync verification after a 2-second delay to confirm the server accepted the changes.
- Each addon's manifest must be under 8KB when serialized to JSON (enforced by the addon SDK).
