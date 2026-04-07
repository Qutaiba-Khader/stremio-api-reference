#!/bin/bash
# Stremio Addon — Fetch Manifest
# GET request directly to an addon's URL.
# Replace the URL with the addon you want to inspect.

curl -s "https://v3-cinemeta.strem.io/manifest.json" | jq .
