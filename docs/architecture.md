# Architecture

Life Dashboard is a local-first, browser-based portfolio/demo application.

It is intentionally simple: a static frontend, browser storage and optional external quote APIs. Optional backend is not required for the public demo.

## System overview

```mermaid
flowchart TD
  A[User / Browser] --> B[index.html]
  B --> C[style.css]
  B --> D[app.js]

  D --> E[Local Storage]
  E --> E1[Dashboard data]
  E --> E2[Demo profile key]
  E --> E3[Optional Alpha Vantage key]

  D --> F[Demo Data Generator]
  F --> E

  D --> G[Portfolio Module]
  G --> H[Manual Prices]
  G --> I[Purchase History]
  G --> J[Optional Quote APIs]

  J --> K[Coinbase Rates]
  J --> L[Gold API]
  J --> M[Alpha Vantage]

  B --> N[manifest.webmanifest]
  B --> O[service-worker.js]
  O --> P[Offline Shell Cache]

  Q[GitHub Repository] --> R[Vercel Static Hosting]
  R --> A
```

## Data flow

```mermaid
sequenceDiagram
  participant User
  participant UI as Browser UI
  participant App as app.js
  participant LS as localStorage
  participant API as Optional Quote API

  User->>UI: Load public demo
  UI->>App: Initialize app
  App->>LS: Read public storage key
  User->>App: Select demo profile
  App->>LS: Write fictional demo data
  App->>UI: Render dashboard modules

  User->>App: Update portfolio quote
  App->>API: Request quote if source exists
  API-->>App: Return quote
  App->>LS: Save updated asset price
  App->>UI: Recalculate portfolio overview
```

## Main files

| File | Purpose |
|---|---|
| `index.html` | static app shell and sections |
| `style.css` | responsive UI and visual system |
| `app.js` | state model, rendering, persistence and module logic |
| `manifest.webmanifest` | PWA metadata |
| `service-worker.js` | offline shell cache |
| `README.md` | public project presentation |
| `docs/` | technical and project documentation |
| `screenshots/` | README screenshots |

## Public storage keys

```text
modularLifeDashboardPublicData
modularLifeDashboardPublicEmergencyBackup
modularLifeDashboardPublicLastActiveTab
modularLifeDashboardPublicDemoProfile
modularLifeDashboardPublicAlphaVantageKey
```

The public version intentionally does not migrate from private dashboard storage keys.

## Deployment model

```text
GitHub
→ Vercel static deployment
→ Demo data in visitor's browser storage
```

No backend is required for the public demo.

## Optional integrations

| Integration | Required for public demo? | Purpose |
|---|---:|---|
| Optional backend | No | Optional future cloud sync |
| Coinbase | No | Optional crypto price updates |
| Gold API | No | Optional gold/silver price updates |
| Alpha Vantage | No | Optional stock/ETF quotes with user-provided API key |

## Backup format

The public backup envelope is documented in `docs/backup.md`.
