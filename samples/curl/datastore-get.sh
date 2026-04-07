#!/bin/bash
# Stremio API — Datastore Get
# Fetches library items (watch history) for the authenticated user.

curl -X POST "https://api.strem.io/api/datastoreGet" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "collection": "libraryItem",
    "all": true
  }'
