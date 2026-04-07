# Register

## Overview

Creates a new Stremio account and returns an `authKey` session token, logging the user in immediately.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/register
```

## Headers

| Header       | Value            | Required |
|--------------|------------------|----------|
| Content-Type | application/json | Yes      |

## Request Body

```json
{
  "email": "newuser@example.com",
  "password": "securepassword"
}
```

| Field    | Type   | Required | Description              |
|----------|--------|----------|--------------------------|
| email    | string | Yes      | Email for the new account |
| password | string | Yes      | Password for the account  |

## Response

**Success (200)**

```json
{
  "result": {
    "authKey": "abc123def456...",
    "user": {
      "_id": "new_user_id_hash",
      "email": "newuser@example.com",
      "lastModified": "2026-04-07T10:00:00.000Z"
    }
  }
}
```

**Error**

```json
{
  "error": {
    "message": "Email already exists"
  }
}
```

## Example (curl)

```bash
curl -X POST "https://api.strem.io/api/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "YOUR_PASSWORD"
  }'
```

## Notes

- Returns the same response shape as `login` — the user is immediately authenticated after registration.
- The returned `authKey` can be used right away for subsequent API calls.
- If the email is already registered, an error is returned.
