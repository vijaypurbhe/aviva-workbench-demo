# Deploying to Firebase Hosting

Standard Vite + React SPA. Builds to `dist/` with an `index.html` Firebase Hosting serves directly.

## One-time setup

```bash
npm i -g firebase-tools
firebase login
# Update .firebaserc with your actual Firebase project ID
firebase use --add
```

## Build & deploy

```bash
npm install
npm run build
firebase deploy --only hosting
```

The SPA rewrite in `firebase.json` ensures deep links (e.g. `/leads`) work on refresh.
