# Authentication Overview

## How Stremio Auth Works

Stremio uses a stateless, token-based authentication system. There are no OAuth flows, no bearer headers, and no cookies. Instead, an `authKey` is passed directly in the JSON request body of every authenticated API call.

## Auth Flow

```
┌──────────┐        POST /api/login         ┌──────────────┐
│  Client   │ ──── { email, password } ────▶ │  Stremio API │
│           │ ◀── { authKey, user }  ─────── │              │
└──────────┘                                 └──────────────┘
      │
      │  authKey stored locally
      ▼
┌──────────┐   POST /api/addonCollectionGet  ┌──────────────┐
│  Client   │ ──── { authKey, ... }  ──────▶ │  Stremio API │
│           │ ◀── { result: ... }  ───────── │              │
└──────────┘                                 └──────────────┘
      │
      │  when done
      ▼
┌──────────┐        POST /api/logout         ┌──────────────┐
│  Client   │ ──── { authKey }  ───────────▶ │  Stremio API │
│           │ ◀── { result: {} }  ─────────  │              │
└──────────┘                                 └──────────────┘
```

## Step-by-Step

### 1. Login (or Register)

Send the user's email and password to the login endpoint:

```bash
curl -X POST "https://api.strem.io/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "YOUR_PASSWORD"}'
```

The response includes an `authKey` and a `user` object:

```json
{
  "result": {
    "authKey": "abc123def456...",
    "user": {
      "_id": "5f8b3c2e1a2b3c4d5e6f7a8b",
      "email": "user@example.com",
      "lastModified": "2026-04-07T10:00:00.000Z"
    }
  }
}
```

Store the `authKey` — you'll need it for every subsequent call.

### 2. Use the authKey

Every authenticated endpoint expects `authKey` in the **request body** (not as a header):

```json
{
  "authKey": "abc123def456...",
  "update": true
}
```

This applies to all endpoints: `getUser`, `addonCollectionGet`, `addonCollectionSet`, `logout`, etc.

### 3. Validate the Session

To check if an `authKey` is still valid, call `getUser`:

```bash
curl -X POST "https://api.strem.io/api/getUser" \
  -H "Content-Type: application/json" \
  -d '{"authKey": "YOUR_AUTH_KEY"}'
```

If the key is valid, you get the user object. If expired or invalid, you get an error.

### 4. Logout

To end the session, call `logout`:

```bash
curl -X POST "https://api.strem.io/api/logout" \
  -H "Content-Type: application/json" \
  -d '{"authKey": "YOUR_AUTH_KEY"}'
```

After this, the `authKey` is invalidated and can no longer be used.

## Key Points

- **No Authorization header** — unlike most REST APIs, Stremio passes auth in the request body.
- **All requests are POST** — even read operations like `getUser` and `addonCollectionGet`.
- **Base URL** — all API endpoints are at `https://api.strem.io/api/{method}`.
- **Response format** — every response has `{ result: ... }` on success or `{ error: ... }` on failure.
- **Session persistence** — the `authKey` persists until explicitly logged out. There is no documented expiration.

## Error Handling

When authentication fails:

```json
{
  "error": {
    "message": "Invalid credentials"
  }
}
```

The official `stremio-api-client` treats any response with an `error` field as a failure and any response missing a `result` field as invalid.
