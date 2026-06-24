# Deployment

## Recommended public-demo deployment

No backend is required for the public demo.

Recommended flow:

```text
GitHub
→ Vercel
→ Demo profiles in local browser storage
```

## Vercel

This is a static app.

Suggested Vercel settings:

```text
Framework Preset: Other
Build Command: empty
Output Directory: empty / root
Install Command: empty or npm install
```

## Safety note

Do not deploy personal backup exports, `.git/` folders, private setup notes or local configuration files.
