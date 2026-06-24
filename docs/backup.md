# Public backup format

The public demo can export and import JSON backups from the Backup tab.

## Current file name

```text
life-dashboard-public-backup-YYYY-MM-DD-HH-MM.json
```

## Current envelope

```json
{
  "schema": "life-dashboard-public-backup",
  "schemaVersion": 1,
  "appName": "Life Dashboard",
  "saveVersion": "public-v23-clean-public-release",
  "savedAt": "2026-06-14T09:30:00.000Z",
  "storageKey": "modularLifeDashboardPublicData",
  "publicDemo": true,
  "data": {}
}
```

## Public cleanup rules

Before export, the app removes legacy private finance note fields from older versions:

```text
finance.btcNote
finance.ltcNote
```

The public release does not ship with a `backup/` folder. Backup files are personal runtime exports and should not be committed to the public repository.
