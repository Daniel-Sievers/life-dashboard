# Changelog

## public-v26-launch-demo-empty-state

- Added a neutral first-visit demo state: no demo profile is preselected.
- Added a soft attention state for the Demo-Modus card while no demo data is loaded.
- Demo loading now requires an explicit profile choice instead of falling back silently to the stable profile.
- Removed demo-video/GIF tasks from seeded demo content.
- Neutralized the browser title and refreshed roadmap, privacy and known-limitations docs for the public launch.
- Updated build version, service-worker cache and smoke checks for public V26.

## public-v25-portfolio-purchase-flow

- Added a global **Nachkauf eintragen** flow between asset creation and FX refresh.
- Added an asset picker that pre-fills currency, FX rate, current price, symbol and metadata from existing portfolio assets.
- New purchase entries calculate invested amount, EUR value, new total units and average buy price automatically.
- Replaced the old prompt-based per-asset purchase action with the same structured modal flow.
- Updated build version, service-worker cache and smoke checks for public V25.

## public-v24-demo-fx-protocol-polish

- Compacted demo weekly task spacing by removing whitespace-only note nodes.
- Added optional FX refresh for USD/CHF/GBP to EUR with local same-day cache and fallback values.
- Added an FX refresh button to the portfolio form.
- Extended demo protocol history to a full rolling 56-day window with profile-specific activity density.
- Updated smoke check for the new FX and demo protocol helpers.

## public-v23-clean-public-release

- Removed private backup folder and Git history folder from the distributable package.
- Removed Supabase setup files from the public release.
- Reworked backup export to use a public backup envelope.
- Removed legacy private finance note fields from default data and public backup exports.
- Added `docs/backup.md` for the public backup format.
- Updated smoke check to guard against private backup files and setup files.

## Public V22 – Architecture and License Notes

- Added Mermaid architecture diagrams to `docs/architecture.md`.
- Added plain-language MIT license explanation in `docs/license-explained.md`.
- Updated README documentation links.


## Public V21 – README Screenshots

- Added Vercel live demo link to README.
- Rebuilt README preview section around available screenshots.
- Updated screenshot documentation.
- Updated package homepage metadata.


## Public V20 – Compact Type Field

- Made the **Typ** dropdown in the portfolio form narrower and more space-efficient.
- Kept mobile behavior unchanged by restoring full width on narrow screens.


## Public V19 – Form Labels

- Added visible labels to the portfolio asset form.
- Made currency fields more compact.
- Improved clarity of asset editing fields.


## Public V18 – History Labels

- Added visible labels to purchase-history editor fields.
- Improved mobile readability of purchase-history rows.
- Clarified modal explanation for historical purchases.


## Public V17 – GitHub Ready

- Finalized repository metadata.
- Added MIT license.
- Added `.gitignore`.
- Added `.env.example`.
- Updated release checklist.
- Clarified GitHub/Vercel-first deployment flow.

## Public V16 – Smoke Check

- Added `scripts/smoke-check.js`.
- Added `npm run check` with JavaScript syntax check and smoke check.
- Clarified that Supabase is optional for the public demo.

## Public V15 – GitHub Presentation

- Rewrote README for public portfolio usage.
- Added setup, architecture, privacy and screenshot docs.
- Added screenshot folder structure.

## Public V14 – Demo Discipline Fix

- Improved fictional routine history for demo profiles.
- Calibrated discipline-related demo scores.

## Public V13 – Quote Source Hints

- Added quote-source hints and limitation notices.
- Improved market-data documentation.

## Public V12 – Portfolio UX Refinement

- Added compact portfolio action layout.
- Added history editor button in asset edit mode.
- Improved demo market-source metadata.

## Public V11 – Purchase History and Market Source

- Added purchase-history editor.
- Added manual price button.
- Prepared optional Alpha Vantage quote source.

## Earlier public packages

- Public storage separation
- Public branding
- Flexible portfolio module
- Multiple demo profiles
- Currency and target-share support
- Crypto and metal price updates
