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
- **Responsive Design** - Works on desktop and mobile devices
- **Email Setup Help** - Built-in guide for configuring mailto on Windows (shown only on desktop)

## Tech Stack

- Vanilla JavaScript (no frameworks)
- Firebase Authentication (Google sign-in)
- Cloud Firestore (database)
- Firebase Hosting (deployment)
- CSS custom properties (dark theme)

## Project Structure

```
index.html          Main HTML page
app.js              Application logic (I18n, Auth, DB, Calendar, EntryForm, TXTExport, CSVExport, Router)
style.css           Styles (dark theme, responsive)
favicon.svg         Site icon
firebase-config.js  Firebase project configuration
firebase.json       Firebase Hosting settings
```

## Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Google Authentication** in the Firebase console
3. Create a **Cloud Firestore** database
4. Copy your Firebase config into `firebase-config.js`:
   ```js
   const firebaseConfig = { /* your config */ };
   firebase.initializeApp(firebaseConfig);
   const auth = firebase.auth();
   const db = firebase.firestore();
   ```
5. Install Firebase CLI and deploy:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only hosting
   ```

## Deployment

```bash
firebase deploy --only hosting
```
