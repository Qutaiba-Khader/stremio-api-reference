#!/bin/bash
# Stremio API — Register
# Creates a new account and returns an authKey.

curl -X POST "https://api.strem.io/api/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "YOUR_PASSWORD"
  }'
