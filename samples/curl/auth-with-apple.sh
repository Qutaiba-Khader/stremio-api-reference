#!/bin/bash
# Stremio API — Auth with Apple
# Authenticates or registers using Apple Sign In credentials.

curl -X POST "https://api.strem.io/api/authWithApple" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "APPLE_IDENTITY_TOKEN",
    "sub": "APPLE_SUBJECT_ID",
    "email": "user@privaterelay.appleid.com",
    "name": "Jane Doe"
  }'
