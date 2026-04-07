#!/bin/bash
# Stremio API — Restore Addon Collection
# Restores a previously backed-up addon collection from a JSON file.
# Usage: Replace YOUR_AUTH_KEY, set BACKUP_FILE to your backup, then run.

AUTH_KEY="YOUR_AUTH_KEY"
BACKUP_FILE="stremio-addons-backup.json"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file '${BACKUP_FILE}' not found."
  exit 1
fi

ADDONS=$(cat "${BACKUP_FILE}")
ADDON_COUNT=$(echo "${ADDONS}" | jq 'length')

echo "Restoring ${ADDON_COUNT} addons from ${BACKUP_FILE}..."

curl -s -X POST "https://api.strem.io/api/addonCollectionSet" \
  -H "Content-Type: application/json" \
  -d "{\"authKey\": \"${AUTH_KEY}\", \"addons\": ${ADDONS}}" \
  | jq .

echo "Restore complete."
