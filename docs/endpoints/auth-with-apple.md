# authWithApple

## Overview

Authenticates or registers a user via Apple Sign In. If the Apple account is not yet linked to a Stremio account, a new account is created automatically. Returns the same `authKey` + `user` response as the standard `login` endpoint.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/authWithApple
```

## Headers

| Header       | Value            | Required |
|--------------|------------------|----------|
| Content-Type | application/json | Yes      |

## Request Body

```json
{
  "token": "apple_identity_token_jwt",
  "sub": "000123.abcdef1234567890.1234",
  "email": "user@privaterelay.appleid.com",
  "name": "Jane Doe"
}
```

| Field | Type   | Required | Description                                    |
|-------|--------|----------|------------------------------------------------|
| token | string | Yes      | Apple identity token (JWT from Sign in with Apple) |
| sub   | string | Yes      | Apple subject identifier (unique per user per app) |
| email | string | Yes      | Email from Apple (may be a private relay address)  |
| name  | string | Yes      | User's name from Apple                             |

## Response

**Success (200)**

```json
{
  "result": {
    "authKey": "session_auth_key",
    "user": {
      "_id": "user_id_hash",
      "email": "user@privaterelay.appleid.com",
      "lastModified": "2026-04-07T10:00:00.000Z"
    }
  }
}
```

**Error**

```json
{
  "error": {
    "message": "Invalid Apple token"
  }
}
```

## Example (curl)

```bash
curl -X POST "https://api.strem.io/api/authWithApple" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "APPLE_IDENTITY_TOKEN",
    "sub": "APPLE_SUBJECT_ID",
    "email": "user@privaterelay.appleid.com",
    "name": "Jane Doe"
  }'
```

## Notes

- The four request fields (`token`, `sub`, `email`, `name`) are confirmed by the official client's test suite, which calls `api.authWithApple({ token, sub, email, name })`.
- Apple may provide a private relay email (e.g., `user@privaterelay.appleid.com`) if the user chose to hide their real email. The `name` is only provided on the first authentication — Apple does not send it on subsequent logins.
- The response is handled identically to `login` — `result.authKey` and `result.user` are extracted and stored.
- After successful auth, the addon collection is reset/refreshed (same as `login` and `register`).
