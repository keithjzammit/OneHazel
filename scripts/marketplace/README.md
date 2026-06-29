# Marketplace sync

Regenerates the connector catalog in `marketplace.html` from a production export and
updates the connector count across every content page. Deterministic and idempotent —
same export in, same pages out.

## Steps

1. **Export from prod.** Run [`PROD_QUERY.sql`](./PROD_QUERY.sql) against the **prod**
   Supabase project ("OneHazel") — Supabase Studio SQL editor, or the `supabase` MCP
   (`mcp__plugin_supabase_supabase__execute_sql`, project `xrtlnyhfxcxhncxiszdf`).
   Save the returned JSON array to `prod-connectors.json`:
   ```json
   [ { "name": "Stripe", "category": "Payments", "base_url": "https://api.stripe.com/" }, ... ]
   ```
2. **Run the sync:**
   ```bash
   node scripts/marketplace/sync.mjs
   ```
3. **Review & ship.** Check `git diff`, preview locally (`python3 -m http.server`), open a PR.

## What it does

- **Cleans** test fixtures, internal Stripe fragments, placeholder/`{template}`-only and
  empty-baseURL entries.
- **Dedupes** same-brand sub-products to the parent (`DROP_VARIANTS` / `RENAME` in `sync.mjs`).
- **Consolidates** prod's ~40 noisy categories into a clean set (`CAT` map), iGaming first.
- **Resolves logo domains**: pinned in [`marketplace-domains.json`](./marketplace-domains.json)
  when they can't be derived (curated/brand-correct), otherwise derived from `base_url`,
  otherwise a name slug (logo.dev shows a monogram for unknowns).
- **Updates the connector count** everywhere it appears (previous count → new count).

## Maintaining

- New connector logo wrong? Add/fix an entry in `marketplace-domains.json` (name → domain) and re-run.
- New same-brand variant to collapse? Add it to `DROP_VARIANTS` (or `RENAME`) in `sync.mjs`.
- New prod category? Map it in `CAT` (unmapped categories fall back to `Other`).

`prod-connectors.json` is the raw export used for the most recent sync (kept for provenance).
