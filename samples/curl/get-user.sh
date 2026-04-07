#!/bin/bash
# Stremio API — Get User
# Retrieves the current user's profile.

curl -X POST "https://api.strem.io/api/getUser" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY"
  }'
