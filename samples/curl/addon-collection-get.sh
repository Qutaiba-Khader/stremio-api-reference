#!/bin/bash
# Stremio API — Get Addon Collection
# Fetches the user's installed addons.

curl -X POST "https://api.strem.io/api/addonCollectionGet" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "update": true
  }'
