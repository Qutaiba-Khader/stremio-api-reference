# getUser

## Overview

Retrieves the current user's profile information using their `authKey`.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/getUser
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

| Field   | Type   | Required | Description          |
|---------|--------|----------|----------------------|
| authKey | string | Yes      | Active session token |

## Response

**Success (200)**

```json
{
  "result": {
    "_id": "user_id_hash",
    "email": "user@example.com",
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
curl -X POST "https://api.strem.io/api/getUser" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY"
  }'
```

## Notes

- The official client uses `lastModified` to determine whether the remote user data is newer than the local copy, and only updates locally if it is.
- The user object may contain additional fields beyond `_id`, `email`, and `lastModified` depending on the account configuration.
- AIOManager uses this endpoint (via the whitelist type `GetUser`) to validate auth keys — a successful response means the key is still valid.
