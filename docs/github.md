# GitHub publishing guide

## Recommended repository name

```text
life-dashboard
```

## First push

```bash
git init
git add .
git commit -m "Initial public release"
git branch -M main
git remote add origin https://github.com/Daniel-Sievers/life-dashboard.git
git push -u origin main
```

## After pushing

1. Open the GitHub repository.
2. Check that README renders correctly.
3. Confirm no `.env` or real API keys are present.
4. Connect the repository to Vercel.
5. Deploy as a static site.
6. Add screenshots and live URL to README.
