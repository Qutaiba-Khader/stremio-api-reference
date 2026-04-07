#!/bin/bash
# Stremio API — Login
# Returns an authKey for use in subsequent API calls.

curl -X POST "https://api.strem.io/api/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "YOUR_PASSWORD"
  }'
