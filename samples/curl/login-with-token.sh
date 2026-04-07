#!/bin/bash
# Stremio API — Login with Token
# Authenticates using an existing token instead of email/password.

curl -X POST "https://api.strem.io/api/loginWithToken" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN"
  }'
