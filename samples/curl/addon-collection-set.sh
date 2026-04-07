#!/bin/bash
# Stremio API — Set Addon Collection
# Replaces the user's entire addon collection.
# Modify the addons array to install, remove, or reorder addons.

curl -X POST "https://api.strem.io/api/addonCollectionSet" \
  -H "Content-Type: application/json" \
  -d '{
    "authKey": "YOUR_AUTH_KEY",
    "addons": [
      {
        "transportUrl": "https://v3-cinemeta.strem.io/manifest.json",
        "transportName": "http",
        "manifest": {
          "id": "com.linvo.cinemeta",
          "version": "3.0.12",
          "name": "Cinemeta",
          "types": ["movie", "series"],
          "resources": ["meta", "catalog"],
          "catalogs": []
        },
        "flags": { "official": true, "protected": true }
      }
    ]
  }'
