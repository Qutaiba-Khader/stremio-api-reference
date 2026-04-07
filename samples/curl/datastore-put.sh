#!/bin/bash
# Stremio API — Datastore Put
# Adds or updates library items for the authenticated user.
# Set "removed": true to soft-delete an item.

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
