# datastoreGet

## Overview

Retrieves items from a Stremio datastore collection. The primary use case is fetching the user's library (watch history and saved items). Each Stremio user has a `libraryItem` collection that tracks movies and series they've interacted with.

## HTTP Method

```
POST
```

## URL

```
https://api.strem.io/api/datastoreGet
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
  "all": true
}
```

| Field      | Type    | Required | Description                                    |
|------------|---------|----------|------------------------------------------------|
| authKey    | string  | Yes      | Active session token                           |
| collection | string  | Yes      | Collection name — typically `"libraryItem"`    |
| all        | boolean | No       | When `true`, fetches all items in the collection |

## Response

**Success (200)**

```json
{
  "result": [
    {
      "_id": "tt1375666",
      "name": "Inception",
      "type": "movie",
      "poster": "https://images.metahub.space/poster/small/tt1375666/img",
      "removed": false,
      "temp": false,
      "_ctime": "2025-06-15T14:30:00.000Z",
      "_mtime": "2026-04-01T20:45:00.000Z",
      "state": {
        "timeWatched": 5400000,
        "timesWatched": 1,
        "flaggedWatched": 1,
        "overallTimeWatched": 5400000,
        "timeOffset": 0,
        "lastWatched": "2026-04-01T20:45:00.000Z",
        "video_id": "tt1375666",
        "watched": "2026-04-01T20:45:00.000Z",
        "noNotif": false,
        "season": 0,
        "episode": 0,
        "duration": 8880000
      }
    },
    {
      "_id": "tt0903747",
      "name": "Breaking Bad",
      "type": "series",
      "poster": "https://images.metahub.space/poster/small/tt0903747/img",
      "removed": false,
      "temp": false,
      "_ctime": "2024-12-01T10:00:00.000Z",
      "_mtime": "2026-03-28T21:30:00.000Z",
      "state": {
        "timeWatched": 2700000,
        "timesWatched": 0,
        "flaggedWatched": 0,
        "overallTimeWatched": 180000000,
        "timeOffset": 1250000,
        "lastWatched": "2026-03-28T21:30:00.000Z",
        "video_id": "tt0903747:5:12",
        "watched": "",
        "noNotif": false,
        "season": 5,
        "episode": 12,
        "duration": 2820000
      }
    }
  ]
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

```bash
curl -X POST "https://api.strem.io/api/datastoreGet" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "collection": "libraryItem",
    "all": true
  }'
```

## Notes

- The response may return the array directly as `result` (an array), or wrapped as `result.library` (an array inside an object). AIOManager handles both cases.
- Items with `removed: true` are soft-deleted — they still exist in the collection but are hidden from the user's library view.
- The `_id` field uses IMDb IDs (e.g., `tt1375666`).
- For series, `video_id` uses the format `{imdbId}:{season}:{episode}` (e.g., `tt0903747:5:12`).
- The `state.timeWatched` and `state.duration` values are in **milliseconds**.
- The `temp` field indicates temporary/suggested items that the user hasn't explicitly added to their library.
- The only collection name confirmed in the reference repos is `"libraryItem"`. Other collections may exist but are not documented.
- AIOManager sanitizes responses to ensure `_ctime` and `_mtime` are valid ISO 8601 timestamps, suggesting some items may have malformed dates.
