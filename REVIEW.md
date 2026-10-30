# TB1 review checklist

- Run `npm ci`, `npm test`, production build and Pages build with Node 24+.
- Run the integrated local demo and review receiving → sale → dispatch → delivery, reload and alternate failures. Use fictional records.
- Switch en_US/es_419; test 375 px, 768 px and desktop; keyboard navigation, dialogs, errors and internal table scrolling.
- Review the pinned source manifest and OpenAPI; domain changes belong in the canonical Fake API repository and are synced deliberately.
- Review C4/DDD, relational constraints and the per-area capability gaps in the report. A collection/table is not proof of a completed feature.
- Each teammate reviews their context and supplies actual board, oral/written evidence and interview records; current correction commits must not be reassigned as their historical work.
- Merge fix → develop only after review. Prepare reviewed release → main, switch Pages to Actions and verify public landing/worker/CTA after approval. Keep the old source available for rollback.

Java/Spring Boot/PostgreSQL/JPA, production security, deep lot/location/routing workflows and research validation remain AV2 work. Do not claim these as implemented from a diagram or passing mock test.
