# Login

## Overview

Authenticates a user with email and password, returning an `authKey` session token used for all subsequent authenticated API calls.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/login
```

## Headers

| Header       | Value            | Required |
|--------------|------------------|----------|
| Content-Type | application/json | Yes      |

## Request Body

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

| Field    | Type   | Required | Description                  |
|----------|--------|----------|------------------------------|
| email    | string | Yes      | User's registered email      |
| password | string | Yes      | User's password              |

## Response

**Success (200)**

```json
{
  "result": {
    "authKey": "abc123def456...",
    "user": {
      "_id": "user_id_hash",
      "email": "user@example.com",
      "lastModified": "2026-04-07T10:00:00.000Z"
    }
  }
}
```

**Error**

```json
{
  "error": {
    "message": "Invalid credentials"
  }
}
```

## Example (curl)

```bash
curl -X POST "https://api.strem.io/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "YOUR_PASSWORD"
  }'
```

## Notes

- The `authKey` is a session token, not a permanent API key. It can be invalidated by calling `logout`.
- The `authKey` is passed in the **request body** of subsequent calls, not as an Authorization header.
- Some third-party clients include a `type` field (e.g., `"type": "Auth"`) in the request body, but this is not required by the official API.
- Facebook login was historically supported via a `fbLoginToken` field, but this is deprecated.
- There is also an `authWithApple` endpoint for Apple ID authentication and a `loginWithToken` endpoint for token-based login, both returning the same response shape.
