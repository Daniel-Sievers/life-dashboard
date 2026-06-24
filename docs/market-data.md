# Market data

## Supported automatic sources

### Crypto

- BTC
- ETH
- SOL

Source: Coinbase exchange rates. Prices are loaded in EUR.

### Metals

- XAU
- XAG

Source: Gold API. Prices are loaded in USD and converted to EUR using the dashboard FX field. The FX field can be refreshed automatically and still remains manually editable.

### Stocks and ETFs

Selected stock/ETF presets can use Alpha Vantage Global Quote.

Examples:

- AAPL
- MSFT
- NVDA
- AMZN
- GOOGL
- IWDA.LON
- VUAA.LON

An Alpha Vantage API key is required and stored locally in the browser.

## Why stock/ETF quotes may differ

Stock and ETF quotes can vary slightly depending on:

- exchange / trading venue
- ticker symbol mapping
- currency
- delayed data
- bid/ask spread
- broker-specific execution price

For this reason, manual price editing remains available for every asset.


## FX rates

For USD, CHF and GBP, the dashboard can refresh the conversion rate to EUR from a public exchange-rate endpoint without an API key.

The value is stored locally in the browser cache for the current day. If the request fails, the app keeps a conservative built-in fallback value and the user can still edit the FX field manually.

This keeps the public demo backend-free while making portfolio examples more realistic.
