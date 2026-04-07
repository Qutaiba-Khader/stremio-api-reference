# Stremio API Explorer — GitHub Pages Setup

This folder contains a static single-page web app for testing the Stremio API interactively.

## Enabling GitHub Pages

1. Go to your repository on GitHub: `https://github.com/Qutaiba-Khader/stremio-api-reference`
2. Click **Settings** (top menu bar)
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/docs`
5. Click **Save**
6. Wait 1-2 minutes for deployment
7. Your site will be live at: `https://qutaiba-khader.github.io/stremio-api-reference/`

## How It Works

- **No build step** — pure HTML, CSS, and JavaScript served directly
- **No frameworks** — vanilla JS, works in any modern browser
- **All API calls go directly from the browser to `https://api.strem.io`**
- AuthKeys are stored in `localStorage` — only use on trusted devices

## CORS Note

The Stremio API (`api.strem.io`) may or may not serve CORS headers allowing browser requests from GitHub Pages. If CORS blocks requests:

- The login and addon management features will show a clear error message
- As a workaround, users can paste an authKey obtained via curl
- Addon manifest fetches (to individual addon servers) work if those servers send CORS headers — official Stremio addons do, but third-party addons may not

## Features

- Login with email/password or paste an existing authKey
- Multi-account support (save and switch between accounts)
- View, reorder, add, remove, and test addons
- Edit addon URLs inline
- Backup addon list to JSON file
- Restore addon list from JSON file
- Dark mode, mobile-friendly
