# saveUser

## Overview

Updates the current user's profile on the Stremio server. The full user object is sent as a replacement — there is no partial update.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/saveUser
```

## Headers

| Header       | Value            | Required |
|--------------|------------------|----------|
| Content-Type | application/json | Yes      |

## Request Body

```json
{
  "authKey": "YOUR_AUTH_KEY",
  "_id": "5f8b3c2e1a2b3c4d5e6f7a8b",
  "email": "user@example.com",
  "lastModified": "2026-04-07T12:00:00.000Z",
  "avatar": "https://example.com/avatar.png",
  "gdpr_consent": {
    "tos": true,
    "privacy": true,
    "marketing": true
  }
}
```

| Field        | Type   | Required | Description                              |
|--------------|--------|----------|------------------------------------------|
| authKey      | string | Yes      | Active session token                     |
| _id          | string | Yes      | The user's ID (from login/getUser)       |
| email        | string | Yes      | User's email address                     |
| lastModified | string | Yes      | ISO 8601 timestamp — set to current time |
| avatar       | string | No       | URL to user's avatar image               |
| gdpr_consent | object | No       | GDPR consent flags                       |

The request body is the **entire user object** with `authKey` merged in. Any fields present in the user object can be included.

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
curl -X POST "https://api.strem.io/api/saveUser" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "_id": "5f8b3c2e1a2b3c4d5e6f7a8b",
    "email": "user@example.com",
    "lastModified": "2026-04-07T12:00:00.000Z"
  }'
```

## Notes

- The official client (`stremio-api-client`) always sets `lastModified` to `new Date()` before calling this endpoint, so the server can track when the profile was last updated.
- The client stores the updated user locally before sending — even if the request fails, the local copy is updated.
- The exact set of writable fields is not documented. The client sends the full user object it has locally. Additional or unknown fields may be silently ignored by the server.
- The response body is assumed to be `{ "result": {} }` — the official client does not inspect the response.
