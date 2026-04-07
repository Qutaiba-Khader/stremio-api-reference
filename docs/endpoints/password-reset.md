# Password Reset

## Overview

No password reset endpoint was found in any of the five reference repositories examined. This page documents what is known and suspected.

## Status: Undocumented

The Stremio API almost certainly supports password reset functionality (the web app at stremio.com has a "Forgot password" flow), but the endpoint is not used by any of the reference client libraries:

- `stremio-api-client` — no reset method
- `stremio-addon-manager` — no reset functionality
- `stremio-addon-organizer` — no reset functionality
- `AIOManager` — no reset functionality
- `stremio-addon-sdk` — no reset functionality

## Likely Endpoint (Unconfirmed)

Based on the API's naming convention (`/api/{methodName}`), the endpoint is likely:

```
POST https://api.strem.io/api/forgotPassword
```

or

```
POST https://api.strem.io/api/passwordReset
```

### Probable Request Body

```json
{
  "email": "user@example.com"
}
```

### Probable Response

```json
{
  "result": {}
}
```

The server would send a reset email with a link or token. The actual password change likely happens via a separate endpoint or the Stremio web interface.

## Notes

- This endpoint is **entirely speculative**. The name, request format, and response format are guesses based on the API's conventions.
- If you discover the actual endpoint name, please update this document.
- The Stremio web app at `https://www.stremio.com` has a password reset flow — inspecting its network requests would reveal the real endpoint.
