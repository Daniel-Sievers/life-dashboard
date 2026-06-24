# Privacy model

This public release is designed as a local-first demo.

## What is stored

The app stores demo/local user data in the visitor's browser via localStorage.

Public storage keys:

```text
modularLifeDashboardPublicData
modularLifeDashboardPublicEmergencyBackup
modularLifeDashboardPublicLastActiveTab
modularLifeDashboardPublicDemoProfile
modularLifeDashboardPublicAlphaVantageKey
modularLifeDashboardPublicFxRates
```

## What is not included

- no private backup files
- no `.git` history folder inside release ZIPs
- no Supabase setup files
- no real API keys
- no private user data

## Backup behavior

Generated backup files use the public backup schema and intentionally omit legacy private finance note fields from older private dashboard versions.
