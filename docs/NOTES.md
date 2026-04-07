# Research Notes

Assumptions, conflicts, and gaps found while documenting the Stremio API from reference sources.

## Endpoints Where Request/Response Shape Was Guessed

### `register`

- **What we guessed:** The exact request and response shape. The official `stremio-api-client` calls `this.request('register', params)` and handles the result identically to `login` (`result.authKey` + `result.user`), but no test or documentation shows the exact fields accepted or returned.
- **Confidence:** High — the code path mirrors `login` exactly.

### `logout`

- **What we guessed:** The response body. The official client ignores the response entirely (it clears local state regardless). We documented `{ "result": {} }` based on convention.
- **Confidence:** Medium — consistent with other void-result endpoints, but never explicitly checked in any reference repo.

### `getUser`

- **What we guessed:** The full set of user object fields. The official client only checks for `user._id` and `user.lastModified`. The extra fields (`fbId`, `avatar`, `dateRegistered`, `trakt`, `gdpr_consent`) are inferred from AIOManager's TypeScript types and `saveUser` usage.
- **Confidence:** Medium — the fields exist in client code but the exact server response may include additional or fewer fields.

### `addonCollectionSet` response

- **What we guessed:** The response body. The official client does not inspect it at all. `stremio-addon-manager` checks for `data.result.success`, suggesting the server may return `{ "result": { "success": true } }`. We documented that shape.
- **Confidence:** Low-medium — only one third-party client checks for it, and the official client ignores it entirely.

### `addonPublish`

- **What we guessed:** The full request/response. Documented from the addon SDK's `publishToCentral.js`, which sends `{ transportUrl, transportName }` and checks `resp.error` / `resp.result`. The exact `result` content is not inspected.
- **Confidence:** High for request shape, low for response details.

### `saveUser`

- **What we guessed:** The response body. The official client sends the entire user object but does not inspect the response. We documented `{ "result": {} }` by convention.
- **Confidence:** High for request shape (sends the full user object with `authKey`), low for response body.

### `loginWithToken`

- **What we guessed:** The request fields. The official client accepts a generic `params` object — the exact fields the server expects (beyond `token`) are unknown. We documented `{ "token": "..." }` as the minimum.
- **Confidence:** Medium — the method exists and returns `authKey` + `user` (confirmed by code), but the exact accepted params are undocumented. No test coverage exists.

### `datastoreGet`

- **What we guessed:** The response format. AIOManager handles two response shapes (`result` as an array directly, or `result.library` as an array). The canonical shape is unclear.
- **Confidence:** High for request shape (confirmed by AIOManager), medium for response shape.

### `datastorePut`

- **What we guessed:** The response body. None of the reference repos inspect the response. We documented `{ "result": {} }` by convention.
- **Confidence:** High for request shape (confirmed by AIOManager with detailed item structure), low for response body.

### Password reset

- **What we guessed:** Everything. No reference repo uses a password reset endpoint. The endpoint name, request format, and response format are entirely speculative.
- **Confidence:** None — fully speculative.

---

## Conflicts Between Reference Repos

### 1. `type` field in request bodies

| Repo | Behavior |
|------|----------|
| `stremio-api-client` (official) | Does **not** include a `type` field in any request body |
| `stremio-addon-manager` | Includes `type: "AddonCollectionGet"`, `type: "AddonCollectionSet"` |
| `stremio-addon-organizer` | Same as addon-manager |
| `AIOManager` | Includes `type: "Auth"`, `type: "AddonCollectionGet"`, `type: "AddonCollectionSet"`, `type: "GetUser"`, `type: "DatastoreGet"`, `type: "DatastorePut"` |

**Resolution:** The `type` field is likely ignored by the server. The API method is determined by the URL path (`/api/login`, `/api/addonCollectionGet`, etc.), not the body. We omit `type` from our documentation to match the official client.

### 2. `authKey: null` in login request

| Repo | Behavior |
|------|----------|
| `stremio-api-client` (official) | Does **not** send `authKey` with login — the client only prepends `authKey` when one exists |
| `stremio-addon-manager` | Sends `authKey: null` explicitly in the login request body |

**Resolution:** The server likely ignores `authKey: null`. We omit it from login documentation.

### 3. Cinemeta version

| Repo | Version |
|------|---------|
| Our earlier docs | Referenced `3.0.12` |
| Live manifest (fetched 2026-04-07) | `3.0.14` |

**Resolution:** Updated all samples to `3.0.14` based on the live manifest.

### 4. `addonCollectionSet` response inspection

| Repo | Behavior |
|------|----------|
| `stremio-api-client` (official) | Does not inspect the response at all |
| `stremio-addon-manager` | Checks `data.result.success` and shows alert on failure |
| `AIOManager` | Checks `response.data?.error` but does not inspect `result` |

**Resolution:** Documented `{ "result": { "success": true } }` as the response with a note about the inconsistency.

### 5. `datastoreGet` response shape

| Repo | Behavior |
|------|----------|
| AIOManager | Handles `result` as direct array **or** `result.library` as array |

**Resolution:** Documented the direct array format as primary, with a note that `result.library` may also occur. No other repos use this endpoint for comparison.

---

## Endpoints Found But NOT Documented (and Why)

### `addonCatalog` resource endpoints

- **Source:** `stremio-addon-sdk` (router and protocol docs)
- **Why skipped:** These are addon-to-addon protocol endpoints (`GET /{resource}/{type}/{id}.json`), not Stremio API endpoints. They are served by individual addon servers, not by `api.strem.io`. The manifest fetch endpoint is documented as the primary interaction point.
