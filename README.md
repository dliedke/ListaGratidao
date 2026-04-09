# Gratitude Journal / Diario da Gratidao

A personal gratitude journal web app. Record daily reasons for gratitude, view them on a calendar, and export your entries.

## Features

- **Google Authentication** - Sign in with your Google account to keep your data private and synced across devices
- **Calendar View** - Monthly calendar with visual indicators (dots) showing how many gratitude items were recorded each day
- **Daily Entries** - Write one reason per line; entries are saved to Firestore in real-time
- **Export to TXT** - Select a date range and download a formatted text file with all your entries
- **Export via Email** - Send your gratitude list to any email address using a mailto link
- **Internationalization (i18n)** - Automatic language detection (Portuguese and English) based on browser settings
- **Dark Theme** - Dark UI designed for comfortable daily use
- **Biometric Lock** - Optional fingerprint/Face ID lock for mobile devices (WebAuthn). Enable in Settings to require biometric verification before accessing the app
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- Vanilla JavaScript (no frameworks)
- Firebase Authentication (Google sign-in)
- Cloud Firestore (database)
- Firebase Hosting (deployment)
- CSS custom properties (dark theme)

## Project Structure

```
index.html              Main HTML page (Gratitude Journal)
app.js                  Application logic (I18n, Auth, DB, Biometric, Calendar, EntryForm, TXTExport, CSVExport, Router)
style.css               Styles (dark theme, responsive)
favicon.svg             Site icon
firebase-config.js      Firebase project configuration
firebase.json           Firebase Hosting + Realtime Database settings
database.rules.json     Realtime Database security rules (live location sessions)
live.html               Adventure Tracker live location viewer page
```

## Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Google Authentication** in the Firebase console
3. Create a **Cloud Firestore** database
4. Enable **Realtime Database** (Build > Realtime Database > Create Database)
5. Copy your Firebase config into `firebase-config.js`:
   ```js
   const firebaseConfig = { /* your config */ };
   firebase.initializeApp(firebaseConfig);
   const auth = firebase.auth();
   const db = firebase.firestore();
   ```
6. Install Firebase CLI and deploy:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy
   ```

## Deployment

### Deploy everything (hosting + database rules)

```bash
firebase deploy
```

### Deploy only hosting (Gratitude Journal + Live Location page)

```bash
firebase deploy --only hosting
```

### Deploy only Realtime Database rules

```bash
firebase deploy --only database
```

## Adventure Tracker - Live Location Sharing

This Firebase project also hosts the live location viewer page for the **Adventure Tracker** mobile app (`.NET MAUI`).

### How it works

1. During a workout, the Adventure Tracker app posts GPS position updates to the **Realtime Database** every 15 seconds
2. The user shares a link (e.g., `https://listagratidao.web.app/live?id=SESSION_ID`) with a safety contact
3. The safety contact opens the link in any browser and sees real-time position, route, distance, and elapsed time on a map
4. When the workout ends (or the app is closed), the session is marked as ended

### Files

| File | Purpose |
|------|---------|
| `live.html` | Viewer page — MapLibre GL map with Firebase Realtime Database listener |
| `database.rules.json` | Security rules — anyone can read sessions, write requires a matching token |

### Realtime Database structure

```
sessions/
  {sessionId}/
    sport: "run" | "walk" | "swim" | "cycling"
    status: "active" | "ended"
    writeToken: "<uuid>"
    startedAt: <timestamp>
    current/
      lat: <number>
      lon: <number>
      distance: <meters>
      elapsed: "HH:mm:ss"
      isPaused: <boolean>
      updatedAt: <timestamp>
```

### Security rules

- **Read**: Anyone can read any session (access is controlled by unguessable UUID session IDs)
- **Write**: Only allowed if the session doesn't exist yet (create) or the `writeToken` matches (update)
- Sessions should be periodically cleaned up (e.g., delete sessions older than 24h)

### Localization

The viewer page auto-detects the browser language and supports: English, Spanish, French, German, Italian, Dutch, Portuguese, Japanese, Chinese, Swedish, Korean, and Russian.

## Install as an App (Android and iOS)

### Android (Chrome or Edge)

1. Open the app URL in Chrome or Edge.
2. Wait for the install banner, then tap **Install**.
3. If no banner appears, open the browser menu and tap **Install app** or **Add to Home screen**.
4. Confirm the installation.
5. Open the app from the home screen.

### iOS (Safari)

1. Open the app URL in Safari.
2. Tap the **Share** button.
3. Tap **Add to Home Screen**.
4. Confirm by tapping **Add**.
5. Open the app from the home screen.

### Notes

1. On iOS, the install option only appears in Safari.
2. If the icon looks outdated after a new deploy, remove the app shortcut from the home screen and add it again.
