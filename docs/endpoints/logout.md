# Logout

## Overview

Invalidates the current session's `authKey`, logging the user out.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/logout
```

## Headers

| Header       | Value            | Required |
|--------------|------------------|----------|
| Content-Type | application/json | Yes      |

## Request Body

```json
{
  "authKey": "YOUR_AUTH_KEY"
}
```

| Field   | Type   | Required | Description                    |
|---------|--------|----------|--------------------------------|
| authKey | string | Yes      | The session token to invalidate |

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
  "error": {
    "message": "Invalid authKey"
  }
}
```

## Example (curl)

```bash
curl -X POST "https://api.strem.io/api/logout" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY"
  }'
```

## Notes

- The official `stremio-api-client` clears user and addon state locally even if the logout request fails (e.g., due to network error). This is a defensive pattern — the client treats logout as best-effort.
- After logout, the `authKey` is no longer valid for any API call.
