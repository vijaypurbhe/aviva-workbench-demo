# Deploying to Firebase Hosting

This project is built with **TanStack Start**. Firebase Hosting only serves
static files, so we deploy the prerendered/static build output.

## One-time setup

```bash
npm i -g firebase-tools
firebase login
# Update .firebaserc with your actual Firebase project ID
firebase use --add
```

## Build & deploy

```bash
bun install      # or: npm install
bun run build    # or: npm run build
firebase deploy --only hosting
```

`firebase.json` is already set to serve from `.output/public` (TanStack Start's
default build directory), so no copy step is needed.

### If `bun install` hangs

Use npm instead:

```bash
npm install
npm run build
firebase deploy --only hosting
```

## Notes

- Dynamic SSR routes / server functions will NOT run on Firebase Hosting.
  This demo uses mock data only, so static hosting is fine.
- For SSR on Firebase, use **Firebase App Hosting** (Blaze plan) instead.
- The SPA rewrite in `firebase.json` ensures deep links (e.g. `/leads`) work
  on refresh.
