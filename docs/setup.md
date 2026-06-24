# Setup

## Requirements

The app is plain HTML, CSS and JavaScript.

Recommended:

- a modern browser
- Python 3 for local static serving
- Node.js for syntax checks

## Start locally

```bash
npm run start
```

or:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Check JavaScript syntax

```bash
npm run check
```

## Optional market data key

Selected stock and ETF quotes can use an Alpha Vantage API key.

The key is entered in the app and stored locally in the browser.

Do not commit real API keys.
