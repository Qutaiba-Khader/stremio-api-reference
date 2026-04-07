#!/bin/bash
# Stremio API — Backup Addon Collection
# Exports the user's addon collection to a local JSON file.
# Usage: Replace YOUR_AUTH_KEY, then run this script.

AUTH_KEY="YOUR_AUTH_KEY"
OUTPUT_FILE="stremio-addons-backup.json"

echo "Fetching addon collection..."

curl -s -X POST "https://api.strem.io/api/addonCollectionGet" \
  -H "Content-Type: application/json" \
  -d "{\"authKey\": \"${AUTH_KEY}\", \"update\": true}" \
  | jq '.result.addons' > "${OUTPUT_FILE}"

echo "Backup saved to ${OUTPUT_FILE}"
echo "Addon count: $(jq 'length' "${OUTPUT_FILE}")"
