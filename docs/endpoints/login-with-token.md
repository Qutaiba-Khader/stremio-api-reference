# loginWithToken

## Overview

Authenticates a user using an existing token (such as a session token from another device or a one-time login link) instead of email and password. Returns the same `authKey` + `user` response as the standard `login` endpoint.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/loginWithToken
```

## Headers

| Header       | Value            | Required |
|--------------|------------------|----------|
| Content-Type | application/json | Yes      |

## Request Body

```json
{
  "token": "existing_session_or_pairing_token"
}
```

| Field | Type   | Required | Description                                          |
|-------|--------|----------|------------------------------------------------------|
| token | string | Yes      | An existing token (session, device pairing, or OAuth) |

## Response

**Success (200)**

```json
{
  "result": {
    "authKey": "new_session_auth_key",
    "user": {
      "_id": "5f8b3c2e1a2b3c4d5e6f7a8b",
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
    "message": "Invalid token"
  }
}
```

## Example (curl)

```bash
curl -X POST "https://api.strem.io/api/loginWithToken" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN"
  }'
```

## Notes

- The exact token format and origin are not documented in any reference repo. This endpoint likely supports multiple token types (device pairing, email magic links, etc.).
- The official `stremio-api-client` accepts a generic `params` object and passes it directly to the API, so the request body may accept additional fields depending on the token type.
- The response is handled identically to `login` — `result.authKey` and `result.user` are extracted and stored.
- No test coverage exists in the official client's test suite. The endpoint's existence is confirmed by its implementation in `apiStore.js`.
