# CLAUDE.md

## Project Overview

**Diario da Gratidao** (Gratitude Journal) is a PWA web app for daily gratitude journaling. Users sign in with Google, write gratitude entries on a calendar, and can export them as TXT or email. Hosted at `https://listagratidao.web.app` via Firebase Hosting.

## Tech Stack

- **Vanilla JavaScript** — no frameworks, no build step, no bundler
- **Firebase Authentication** — Google sign-in (compat SDK v10.12.2 loaded from CDN)
- **Cloud Firestore** — database for entries and user settings
- **Firebase Hosting** — deployment target
- **Service Worker** — PWA support with network-first and stale-while-revalidate caching
- **CSS custom properties** — dark theme with responsive design

## Project Structure

```
index.html            Single HTML page (all modals are inline)
app.js                All application logic (~1100 lines, module pattern)
style.css             All styles (dark theme, responsive breakpoints at 400px and 600px)
firebase-config.js    Firebase project configuration (API keys, project ID)
sw.js                 Service worker (PWA caching, versioned with APP_VERSION)
manifest.json         PWA manifest
favicon.svg           SVG icon
icon-192x192.png      PWA icon 192px
icon-512x512.png      PWA icon 512px
firebase.json         Firebase Hosting config (headers, ignore rules)
.firebaserc           Firebase project alias ("listagratidao")
generate-icons.html   Utility page for generating icon PNGs from SVG
ListaGratidao.esproj  Visual Studio project file
ListaGratidao.slnx    Visual Studio solution file
```

## Architecture (app.js Modules)

All code lives in `app.js` as plain JavaScript modules using the revealing module pattern (object literals with methods). There are no classes, no imports/exports, no build step.

| Module | Purpose |
|---|---|
| `I18n` | Internationalization — auto-detects browser language (pt/en), translates DOM via `data-i18n` attributes |
| `Auth` | Firebase Google authentication — login, logout, `onAuthStateChanged` listener |
| `DB` | Firestore CRUD — save/load/remove entries, loadMonth, loadAll, loadRange |
| `Settings` | User preferences — configurable quick emoji buttons, stored in Firestore |
| `Streak` | Calculates consecutive days streak from all entries |
| `Stats` | Calculates statistics (streak, best streak, total entries, monthly/weekly/yearly counts, avg reasons/day) |
| `Calendar` | Renders monthly calendar grid, shows entry dots, navigates months |
| `EntryForm` | Modal editor for gratitude entries — open, save, delete, emoji insertion |
| `CSVExport` | Downloads all entries as CSV (Presently-compatible format) |
| `TXTExport` | Exports date range as formatted TXT file or via mailto email |
| `Router` | Hash-based routing — `#export` triggers CSV export |

Initialization happens in `DOMContentLoaded` at the bottom of app.js, wiring all event listeners.

## Firestore Data Model

```
users/{uid}/entries/{YYYY-MM-DD}
  - content: string (one reason per line)
  - date: string ("YYYY-MM-DD")

users/{uid}/settings/preferences
  - emojis: string[] (up to 5 emoji characters)
```

## Internationalization (I18n)

- Two languages: Portuguese (`pt`) and English (`en`)
- Auto-detected from `navigator.language`
- DOM elements use data attributes:
  - `data-i18n` — sets `textContent`
  - `data-i18n-placeholder` — sets `placeholder`
  - `data-i18n-title` — sets `title`
  - `data-i18n-html` — sets `innerHTML` (for rich text with `<strong>` tags)
- All translatable strings are in `I18n.strings.pt` and `I18n.strings.en`
- When adding new user-facing text, add keys to **both** language objects

## CSS Conventions

- Dark theme using CSS custom properties (`:root` variables like `--bg-primary`, `--green-500`, etc.)
- Modal system: `.modal` (overlay) + `.modal-content` (dialog box)
  - Specific modal variants use additional classes: `.modal-content-stats`, `.modal-content-settings`, `.modal-content-help`
- Visibility toggled via `.hidden` class (`display: none !important`)
- Responsive breakpoints:
  - `@media (max-width: 600px)` — tablet/small screens (reduces modal size)
  - `@media (max-width: 400px)` — mobile (compact layout)
- Desktop-first: default modal `max-width: 750px`, textarea `min-height: 350px`

## Service Worker & PWA

- `sw.js` uses versioned cache (`CACHE_NAME`, `APP_VERSION`)
- Caching strategies:
  - **Network-first** for HTML documents, manifest, icons
  - **Stale-while-revalidate** for JS/CSS assets
  - **Network-only** for Firebase SDK requests
- Auto-updates: app.js sends `SKIP_WAITING` message on new SW detection, then reloads

### CRITICAL: Cache Versioning

**ALWAYS update cache versions after ANY code change** (HTML, CSS, JS):

1. Increment `CACHE_NAME` in `sw.js` (e.g., `gratitude-v3` → `gratitude-v4`)
2. Update `APP_VERSION` in `sw.js` (use current date: `YYYYMMDD-N` format)
3. Update ALL version query strings in `index.html` to match `APP_VERSION`
4. Update ALL version query strings in `manifest.json` to match `APP_VERSION`

**Why:** Without version bumps, users will see cached (old) versions of the app even after deployment. The service worker aggressively caches assets, so version changes are the only way to force cache invalidation.

**Example workflow:**
```bash
# After editing style.css or app.js:
# 1. Edit sw.js: CACHE_NAME = "gratitude-v4", APP_VERSION = "20260215-2"
# 2. Find/replace in index.html: ?v=20260215-1 → ?v=20260215-2
# 3. Find/replace in manifest.json: ?v=20260215-1 → ?v=20260215-2
# 4. Deploy
```

## Deployment

```bash
firebase deploy --only hosting
```

The `firebase.json` sets `public: "."` (root directory) and ignores `node_modules`, `.vs`, `.vscode`, project files, `package.json`, and documentation.

## Development Notes

- **No build step** — edit files directly; refresh browser to test
- **No test framework** — no automated tests currently
- **node_modules** only contains ESLint (dev tooling); not used at runtime
- All Firebase SDK scripts are loaded from CDN in `index.html`, not from node_modules
- The `firebase-config.js` contains the project's Firebase API keys (these are client-side keys, standard for Firebase web apps)
- Modal open/close is done by toggling the `.hidden` class on modal elements
- Overlay click and Escape key close all modals
- Emoji insertion uses `textarea.selectionStart/End` for cursor-aware insertion

## Code Style

- 4-space indentation
- Double quotes for strings in JavaScript
- camelCase for variables and functions
- Module methods are regular functions (not arrow), called as `Module.method()`
- DOM queries use `document.getElementById` / `document.querySelector`
- Async/await for all Firestore operations
- Comments in Portuguese and English (mixed)
- Commit messages in English
