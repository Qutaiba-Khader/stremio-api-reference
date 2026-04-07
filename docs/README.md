# Endpoint Index

All documented Stremio API endpoints, grouped by scope.

## Authentication

| Endpoint | Description | Docs | JSON Sample | curl Sample |
|----------|-------------|------|-------------|-------------|
| `login` | Authenticate with email/password | [login.md](endpoints/login.md) | [login.json](../samples/json/login.json) | [login.sh](../samples/curl/login.sh) |
| `register` | Create a new account | [register.md](endpoints/register.md) | [register.json](../samples/json/register.json) | [register.sh](../samples/curl/register.sh) |
| `loginWithToken` | Authenticate with existing token | [login-with-token.md](endpoints/login-with-token.md) | [login-with-token.json](../samples/json/login-with-token.json) | [login-with-token.sh](../samples/curl/login-with-token.sh) |
| `authWithApple` | Authenticate via Apple Sign In | [auth-with-apple.md](endpoints/auth-with-apple.md) | [auth-with-apple.json](../samples/json/auth-with-apple.json) | [auth-with-apple.sh](../samples/curl/auth-with-apple.sh) |
| `logout` | Invalidate a session | [logout.md](endpoints/logout.md) | [logout.json](../samples/json/logout.json) | [logout.sh](../samples/curl/logout.sh) |
| `getUser` | Get user profile | [get-user.md](endpoints/get-user.md) | [get-user.json](../samples/json/get-user.json) | [get-user.sh](../samples/curl/get-user.sh) |
| `saveUser` | Update user profile | [save-user.md](endpoints/save-user.md) | [save-user.json](../samples/json/save-user.json) | [save-user.sh](../samples/curl/save-user.sh) |
| Password reset | Status: undocumented | [password-reset.md](endpoints/password-reset.md) | — | — |

**Auth flow overview:** [authentication/overview.md](authentication/overview.md)

## Addon Collection Management

| Endpoint | Description | Docs | JSON Sample | curl Sample |
|----------|-------------|------|-------------|-------------|
| `addonCollectionGet` | Fetch installed addons | [addon-collection-get.md](endpoints/addon-collection-get.md) | [addon-collection-get.json](../samples/json/addon-collection-get.json) | [addon-collection-get.sh](../samples/curl/addon-collection-get.sh) |
| `addonCollectionSet` | Save/update addon list | [addon-collection-set.md](endpoints/addon-collection-set.md) | [addon-collection-set.json](../samples/json/addon-collection-set.json) | [addon-collection-set.sh](../samples/curl/addon-collection-set.sh) |
| Addon manifest fetch | GET manifest from addon URL | [addon-manifest.md](endpoints/addon-manifest.md) | [addon-manifest.json](../samples/json/addon-manifest.json) | [addon-manifest.sh](../samples/curl/addon-manifest.sh) |
| `addonPublish` | Publish addon to central catalog | [addon-publish.md](endpoints/addon-publish.md) | [addon-publish.json](../samples/json/addon-publish.json) | [addon-publish.sh](../samples/curl/addon-publish.sh) |

## Datastore (Library / Watch History)

| Endpoint | Description | Docs | JSON Sample | curl Sample |
|----------|-------------|------|-------------|-------------|
| `datastoreGet` | Fetch library items | [datastore-get.md](endpoints/datastore-get.md) | [datastore-get.json](../samples/json/datastore-get.json) | [datastore-get.sh](../samples/curl/datastore-get.sh) |
| `datastorePut` | Add/update/remove library items | [datastore-put.md](endpoints/datastore-put.md) | [datastore-put.json](../samples/json/datastore-put.json) | [datastore-put.sh](../samples/curl/datastore-put.sh) |

## Addon Ordering / Sorting

Addon order is determined by **array position** in the addon collection. Index 0 has the highest priority.

To reorder addons:
1. Fetch the current collection via `addonCollectionGet`
2. Rearrange the `addons` array
3. Save back via `addonCollectionSet`

There is no dedicated reorder endpoint — ordering is implicit in the array sent to `addonCollectionSet`. See [addon-collection-set.md](endpoints/addon-collection-set.md) for details.

## Backup / Restore

Backup and restore are accomplished using the standard collection endpoints:

| Operation | Description | curl Sample |
|-----------|-------------|-------------|
| Backup | Export addon collection to JSON file | [backup-addons.sh](../samples/curl/backup-addons.sh) |
| Restore | Import addon collection from JSON file | [restore-addons.sh](../samples/curl/restore-addons.sh) |

**How it works:**
- **Backup:** Call `addonCollectionGet`, save the `result.addons` array to a JSON file.
- **Restore:** Load the JSON file, pass the array to `addonCollectionSet`.

See the curl scripts for ready-to-use implementations.

## Research Notes

See [NOTES.md](NOTES.md) for documented assumptions, conflicts between reference repos, and confidence levels for each endpoint.
