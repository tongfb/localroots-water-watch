# LocalRoots Water Watch

LocalRoots Water Watch is a fork-friendly, open-source starter for local flood and water-situation dashboards. The public core keeps locality, source and deployment choices configurable so each community can adapt the project without inheriting another operator's account, domain or infrastructure values.

The goal is simple: a community in another district or province should be able to fork the project, change one main config file, connect verified local sources, and run its own dashboard on Cloudflare Workers.

## Principles

- Source first: every displayed metric links back to its original source.
- Freshness first: show when data was observed when the source provides a timestamp.
- Official warnings take priority during emergencies.
- Keep measured data, calculations, forecasts and warnings distinguishable.
- Fork-friendly configuration: area, sources, cameras and branding live in `config/localroots.config.json`.
- Free-first architecture: the starter requires no D1, KV or R2.
- No owner credentials in source code.

## Quick start

```sh
npm install
npm run verify
npm run dev
```

Then edit `config/localroots.config.json`.

## Generic JSON metrics

For a verified JSON endpoint, configure the endpoint plus `valuePath` and optionally `timePath`. The starter reads nested object/array paths such as `data.0.level`.

API keys can be injected from Cloudflare secrets via `apiKeyEnv`; the secret itself must never be committed.

## Support the original project

The public core includes an original-project donation block for `donate@zapm.uk`, with both an Open Lightning action and a Copy address fallback. It is intentionally part of the core rather than the locality config, so normal province or district customization does not remove the original LocalRoots support point by accident.

Fork maintainers can add their own local support channel separately if they wish. The MIT license does not make donations mandatory.

## Deploy

`wrangler.jsonc` intentionally contains no Cloudflare Account ID, production hostname or another operator's Worker names. A fork owner should configure deployment for their own Cloudflare account.

For projects using a shared deployment system, keep the project-specific account/domain/resource values outside the application core.

## Adapt another province

See `docs/FORKING.md`.

## License

MIT. Check the terms of each upstream data source separately; this license covers the LocalRoots code, not third-party data, imagery or CCTV streams.
