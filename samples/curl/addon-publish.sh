#!/bin/bash
# Stremio API — Publish Addon
# Registers an addon in the central Stremio catalog.
# The addon must be publicly accessible and serving a valid manifest.

curl -X POST "https://api.strem.io/api/addonPublish" \
  -H "Content-Type: application/json" \
  -d '{
    "transportUrl": "https://your-addon.example.com/manifest.json",
    "transportName": "http"
  }'
