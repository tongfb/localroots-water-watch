# Fork LocalRoots Water Watch for another area

LocalRoots is designed so local data choices live in `config/localroots.config.json`.

1. Fork or copy the repository.
2. Change `title`, `area`, theme text and source links.
3. Add local `jsonMetrics` only for endpoints you have verified. Every metric must expose its original source URL and, when possible, an observation timestamp.
4. Add CCTV links/images only when public reuse is allowed by the source.
5. Run `npm install` and `npm run verify`.
6. Run locally with `npm run dev`.
7. Deploy to your own Cloudflare account. Do not copy another operator's Account ID, domain, API token, Worker name or secrets.

## JSON metric example

```json
{
  "id": "river-main",
  "group": "River",
  "label": "Main river gauge",
  "url": "https://example.go.th/api/station/ABC123",
  "valuePath": "data.0.level",
  "timePath": "data.0.observed_at",
  "unit": "m",
  "sourceUrl": "https://example.go.th/stations/ABC123",
  "note": "Describe datum/meaning here"
}
```

If the API requires a key, set `apiKeyEnv` plus either `apiKeyQueryParam` or `apiKeyHeader`. Store the actual key as a Cloudflare secret; never commit it.

## Safety and interpretation

A community dashboard should not invent warning thresholds unless the source publishes and defines them. Keep measured values, calculated values, model forecasts and official warnings clearly separated. If a number is derived locally, label the calculation and inputs.
