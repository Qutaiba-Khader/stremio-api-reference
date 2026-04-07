#!/bin/bash
# Stremio API — Save User
# Updates the user's profile on the server.

curl -X POST "https://api.strem.io/api/saveUser" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "_id": "YOUR_USER_ID",
    "email": "user@example.com",
    "lastModified": "2026-04-07T12:00:00.000Z"
  }'
