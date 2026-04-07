# addonPublish

## Overview

Publishes an addon to the Stremio central addon catalog, making it discoverable by all Stremio users. The addon must be hosted and serving its manifest at the provided URL.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/addonPublish
```

## Headers

| Header       | Value            | Required |
|--------------|------------------|----------|
| Content-Type | application/json | Yes      |

## Request Body

```json
{
  "transportUrl": "https://your-addon.example.com/manifest.json",
  "transportName": "http"
}
```

| Field         | Type   | Required | Description                                |
|---------------|--------|----------|--------------------------------------------|
| transportUrl  | string | Yes      | Public URL to the addon's manifest.json    |
| transportName | string | Yes      | Transport type, must be `"http"`           |

## Response

**Success (200)**

```json
{
  "result": {}
}
```

**Error**

```json
{
  "error": "Could not fetch manifest from the provided URL"
}
```

## Example (curl)

```bash
curl -X POST "https://api.strem.io/api/addonPublish" \
  -H "Content-Type: application/json" \
  -d '{
    "transportUrl": "https://your-addon.example.com/manifest.json",
    "transportName": "http"
  }'
```

## Notes

- The Stremio server will fetch the manifest from the provided `transportUrl` to validate it before publishing.
- The addon must be publicly accessible and serving valid JSON with CORS headers.
- This endpoint does **not** require authentication (`authKey`). Anyone can publish an addon if the URL serves a valid manifest.
- The public addon catalog is available at `https://api.strem.io/addonscollection.json`.
- This endpoint is called by the Stremio addon SDK's `publishToCentral()` helper function.
