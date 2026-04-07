# datastorePut

## Overview

Adds or updates items in a Stremio datastore collection. Used to sync library changes (adding, updating, or removing watched items) back to the server.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/datastorePut
```

## Headers

| Header       | Value            | Required |
|--------------|------------------|----------|
| Content-Type | application/json | Yes      |

## Request Body

```json
{
  "authKey": "YOUR_AUTH_KEY",
  "collection": "libraryItem",
  "changes": [
    {
      "_id": "tt1375666",
      "name": "Inception",
      "type": "movie",
      "poster": "https://images.metahub.space/poster/small/tt1375666/img",
      "removed": false,
      "temp": false,
      "_ctime": "2025-06-15T14:30:00.000Z",
      "_mtime": "2026-04-07T12:00:00.000Z",
      "state": {
        "timeWatched": 5400000,
        "timesWatched": 1,
        "flaggedWatched": 1,
        "overallTimeWatched": 5400000,
        "timeOffset": 0,
        "lastWatched": "2026-04-07T12:00:00.000Z",
        "video_id": "tt1375666",
        "watched": "2026-04-07T12:00:00.000Z",
        "noNotif": false,
        "season": 0,
        "episode": 0,
        "duration": 8880000
      }
    }
  ]
}
```

| Field      | Type   | Required | Description                                      |
|------------|--------|----------|--------------------------------------------------|
| authKey    | string | Yes      | Active session token                             |
| collection | string | Yes      | Collection name — typically `"libraryItem"`      |
| changes    | array  | Yes      | Array of items to add, update, or soft-delete    |

Each item in `changes`:

| Field   | Type    | Required | Description                                  |
|---------|---------|----------|----------------------------------------------|
| _id     | string  | Yes      | Item ID (IMDb ID for movies/series)          |
| name    | string  | No       | Item title                                   |
| type    | string  | No       | Content type (`"movie"` or `"series"`)       |
| poster  | string  | No       | Poster image URL                             |
| removed | boolean | Yes      | Set `true` to soft-delete, `false` to keep   |
| temp    | boolean | No       | Temporary/suggested item flag                |
| _ctime  | string  | No       | Creation timestamp (ISO 8601)                |
| _mtime  | string  | Yes      | Modification timestamp (ISO 8601) — set to now |
| state   | object  | No       | Watch progress state                         |

## Response

**Success (200)**

```json
{
  "result": {}
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

**Add/update an item:**

```bash
curl -X POST "https://api.strem.io/api/datastorePut" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "collection": "libraryItem",
    "changes": [
      {
        "_id": "tt1375666",
        "name": "Inception",
        "type": "movie",
        "removed": false,
        "_mtime": "2026-04-07T12:00:00.000Z",
        "state": {}
      }
    ]
  }'
```

**Remove an item (soft-delete):**

```bash
curl -X POST "https://api.strem.io/api/datastorePut" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "collection": "libraryItem",
    "changes": [
      {
        "_id": "tt1375666",
        "removed": true,
        "_mtime": "2026-04-07T12:00:00.000Z",
        "state": {
          "timeWatched": 0,
          "timesWatched": 0,
          "flaggedWatched": 0,
          "overallTimeWatched": 0,
          "timeOffset": 0,
          "lastWatched": "",
          "video_id": "",
          "watched": "",
          "noNotif": false,
          "season": 0,
          "episode": 0,
          "duration": 0
        }
      }
    ]
  }'
```

## Notes

- Items are upserted — if an item with the same `_id` exists, it is updated; otherwise it is created.
- To **remove** an item, set `removed: true` and zero out the `state` fields. AIOManager also sets `_ctime` to `"0001-01-01T00:00:00Z"` as a fallback for removed items.
- Multiple items can be sent in a single `changes` array for batch operations.
- The `_mtime` field should always be set to the current time to ensure proper sync ordering.
- The response body is assumed to be `{ "result": {} }` — none of the reference repos inspect the result.
- The only confirmed collection name is `"libraryItem"`. Other collections may exist but are not documented in any reference repo.
