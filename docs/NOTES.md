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

---

## Endpoints Found But NOT Documented (and Why)

### `saveUser`

- **Source:** `stremio-api-client` (`apiStore.js`, `pushUser` method)
- **Why skipped:** Outside requested scope (user profile management, not auth or addon management). Sends the full user object to update profile fields.

### `loginWithToken`

- **Source:** `stremio-api-client` (`apiStore.js`)
- **Why skipped:** Alternative auth method (token-based, possibly for device pairing). Outside requested scope. Request takes a `token` field instead of email/password. Returns same shape as `login`.

### `authWithApple`

- **Source:** `stremio-api-client` (`apiStore.js`)
- **Why skipped:** Apple ID authentication. Outside requested scope. Takes `token`, `sub`, `email`, `name` fields. Returns same shape as `login`.

### `datastoreGet` / `datastorePut`

- **Source:** AIOManager (whitelisted in server proxy, used for library/watch history)
- **Why skipped:** Outside requested scope (library/watch history, not addon management). `datastoreGet` takes `{ authKey, collection, all }` where `collection` is typically `"libraryItem"`. `datastorePut` stores items back. These manage the user's watch history and library state.

### `addonCatalog` resource endpoints

- **Source:** `stremio-addon-sdk` (router and protocol docs)
- **Why skipped:** These are addon-to-addon protocol endpoints (`GET /{resource}/{type}/{id}.json`), not Stremio API endpoints. They are served by individual addon servers, not by `api.strem.io`. The manifest fetch endpoint is documented as the primary interaction point.

### Password reset / email verification

- **Source:** None — not present in any reference repo
- **Why skipped:** No evidence in any source. Almost certainly exists in the Stremio web app but is not exposed through the public API or documented in any client library.
