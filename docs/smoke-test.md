# Smoke test

Run:

```bash
npm run check
```

This executes:

```bash
node --check app.js
node scripts/smoke-check.js
```

The smoke check verifies required files, public storage keys, service worker cache, demo/portfolio functions, and that no obvious secrets or private storage migrations are present.
