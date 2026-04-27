# Deploying to Firebase Hosting

This project is built with **TanStack Start** (SSR-capable, default target Cloudflare Workers).
Firebase Hosting only serves static files, so we deploy the prerendered/static build.

## One-time setup

```bash
npm i -g firebase-tools
firebase login
# Update .firebaserc with your actual Firebase project ID
firebase use --add
```

## Build & deploy

```bash
bun install
bun run build
# The build outputs to .output/public (TanStack Start default).
# Copy/symlink it as `dist` for firebase.json, OR change firebase.json's
# "public" to ".output/public".
firebase deploy --only hosting
```

If `bun run build` produces `.output/public` instead of `dist`, either:

1. Change `firebase.json` -> `"public": ".output/public"`, or
2. Add a postbuild step: `cp -r .output/public dist`

## Notes

- Dynamic SSR routes / server functions will NOT run on Firebase Hosting.
  This demo uses mock data only, so static hosting is fine.
- For SSR on Firebase, use **Firebase App Hosting** (Blaze plan) instead.
- The SPA rewrite in `firebase.json` ensures deep links (e.g. `/leads`) work
  on refresh.
