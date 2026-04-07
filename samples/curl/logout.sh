#!/bin/bash
# Stremio API — Logout
# Invalidates the current authKey.

curl -X POST "https://api.strem.io/api/logout" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY"
  }'
