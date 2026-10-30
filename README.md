# AI-ToDu · Logistics workspace

TB1 correction · v0.2.0 · Angular 22 + Angular Material · **en_US / es_419**.

The workspace connects receiving, inventory movements, sales, dispatches, returns and derived metrics through a persistent **Fake REST API**. Use fictional data; no actual payments or fiscal documents are issued.

```sh
npm ci
npm run demo
```

Open `http://127.0.0.1:8850/?api=http`. This builds the app and serves both the interface and the local HTTP adapter. Node 24+ is required. State persists in `.demo-data/state.json`, excluded from Git; reload and server restart preserve accepted transactions. The local HTTP choice survives hash navigation/reload within the tab.

For static hosting run `npm run build:pages`. On HTTPS/localhost the Service Worker intercepts same-origin `/api/v1` requests and persists to IndexedDB. Data is local to that browser/origin, can be cleared, and is not shared across devices. The Pages API URL is not a remote backend for curl. First load requires assets/worker initialization; failures show a visible startup error.

## Demo accounts

| Role | Email | Access |
| --- | --- | --- |
| Administrator | admin@demo.ai-todu.test | All demo sections and metrics. |
| Warehouse | warehouse@demo.ai-todu.test | Inventory, movements, purchasing and notifications. |
| Sales | sales@demo.ai-todu.test | Inventory, sales, returns and notifications. |
| Logistics | logistics@demo.ai-todu.test | Inventory, dispatches and notifications. |

All four intentionally public demo accounts use **DemoOnly2026!**. These identities, hashes, session storage and authorization checks are demonstration infrastructure, not production security.

## Review the integrated flow

1. Purchasing: create an order for four rice units and receive two. State becomes partially received; stock changes 8 → 10.
2. Sales: sell two units. Stock changes 10 → 8; historical demo receipt records PEN 290.
3. Dispatches: select that sale, driver, vehicle and destination. Start route, then confirm a recipient. A dispatch never issues stock a second time.
4. Overview: net sales PEN 290, gross contribution PEN 70, inventory at recorded cost PEN 1,510. Reload retains the result. These are synthetic data, not business outcomes.
5. Try excess receiving, oversale, damaged/quarantined product, repeated cancellation, occupied resources and a direct unauthorized metrics request. Rejected commands leave no partial state.

![Local HTTP flow, synthetic demo data](docs/evidence/overview.jpg)

## Verification and scope

```sh
npm test
npm run build
npm run build:pages
```

Tests cover domain rules, direct authorization/tenant isolation, actual HTTP concurrency, restart persistence, receipt migration, the 35-table SQL design, translation coverage and vendored-source integrity. Production compilation retains the original bundle budget. UI is lazy by domain, responsive, labelled and supports reduced motion; user research and a full accessibility audit remain pending.

The [35-table DDL](database/schema.sql) is a normalized relational migration target, validated in SQLite. The running prototype uses 35 JSON collections. Full lot/location/variant workflows, multiple delivery stops/failed attempts, customer administration UI, employee activation/recovery, subscription/fiscal/payment integrations and Java/PostgreSQL production services are not complete.

## Canonical mock source

[ai-todu-fake-api](https://github.com/AI-ToDu/ai-todu-fake-api/tree/fix/tb1-readiness) owns the engine, local adapter, OpenAPI and relational baseline. [mock-provenance.json](mock-provenance.json) pins the exact source commit and normalized file hashes. After committing changes there, run `npm run mock:sync -- ../ai-todu-fake-api`, then tests/build here. Do not independently patch a vendored file. [Bundled OpenAPI](public/mock/openapi.json) is the implemented demo contract.

## Branches and publication

`fix/tb1-readiness` contains four correction blocks, one commit each. `develop` starts at the preserved original main baseline; review the fix PR before integration. Release from reviewed `main`. Verification runs on fix/PR; Pages deployment is restricted to main. The current public site still uses the old `gh-pages` source until review and an explicit switch to GitHub Actions. There is no automatic production deployment from this fix branch.

Links: [Landing](https://ai-todu.github.io/ai-todu-platform/) · [Workspace](https://ai-todu.github.io/ai-todu-webapp/) · [Report](https://github.com/AI-ToDu/ai-todu-report/tree/fix/tb1-readiness) · [Review checklist](REVIEW.md).
