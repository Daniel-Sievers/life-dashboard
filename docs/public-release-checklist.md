# Public release checklist

## Before GitHub

- [ ] Run `npm run check`
- [ ] Check that README renders well locally
- [ ] Confirm no real API keys are committed
- [ ] Confirm `.env` is ignored
- [ ] Confirm `.env.example` contains placeholders only
- [ ] Confirm no private dashboard data is present
- [ ] Confirm no backend setup files are committed

## GitHub

- [ ] Create repository, recommended: `life-dashboard`
- [ ] Push initial commit
- [ ] Check README on GitHub
- [ ] Check repository files
- [ ] Add topics/tags if desired

## Vercel

- [ ] Import GitHub repository
- [ ] Deploy as static site
- [ ] Open live URL
- [ ] Confirm first visit starts with no demo profile selected
- [ ] Confirm Demo-Modus card highlights the demo action before loading data
- [ ] Load all three demo profiles
- [ ] Check mobile layout
- [ ] Check portfolio and purchase history
- [ ] Check notes/goals/reflection sections

## After Vercel

- [ ] Take screenshots
- [ ] Add screenshots to `/screenshots`
- [ ] Add live URL to README
- [ ] Commit screenshot/README update
- [ ] Optional: create GitHub release
