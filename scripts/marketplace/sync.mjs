#!/usr/bin/env node
/**
 * Marketplace sync — regenerates the connector catalog in marketplace.html from a
 * production export, and updates the connector count across all content pages.
 *
 * ── How to run ────────────────────────────────────────────────────────────────
 *   1. Export live connectors from the PROD Supabase project ("OneHazel"). Run the
 *      query in PROD_QUERY.sql (Supabase Studio → SQL editor, or the supabase MCP)
 *      and save the JSON array to scripts/marketplace/prod-connectors.json:
 *        [ { "name": "...", "category": "...", "base_url": "..." }, ... ]
 *   2. node scripts/marketplace/sync.mjs
 *   3. Review the git diff, preview locally, open a PR.
 *
 * The script is deterministic and idempotent: same export in → same page out.
 * Logo domains that can't be derived from base_url are pinned in
 * marketplace-domains.json (curated/brand-correct). New connectors fall back to
 * a derived domain, then a name slug (logo.dev shows a monogram if unknown).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const INPUT = path.join(HERE, 'prod-connectors.json');
const DOMAINS = path.join(HERE, 'marketplace-domains.json');
const MARKETPLACE = path.join(ROOT, 'marketplace.html');

// Content pages that reference the connector count.
const PAGES = ['about.html','contact.html','healthcare.html','energy.html','index.html',
  'how-we-build-connectors.html','pricing.html','marketplace.html','terms.html',
  'lifesciences.html','privacy.html','platform-providers.html','vendors.html'];

// ── Cleaning: drop test fixtures / internal fragments / placeholder entries ─────
const isJunk = (c) => {
  const n = c.name.trim(), b = (c.base_url || '').trim();
  if (!b) return true;                                   // no base URL → fragment/incomplete
  const badUrl = ['httpbin.org','jsonplaceholder','api.example.com','simcasino.example',
    'catfact','cat-fact','ai-cats','agify','openlibrary','petstore'];
  if (badUrl.some(p => b.toLowerCase().includes(p))) return true;
  if (/do not|test app/i.test(n)) return true;
  const badNames = new Set(['Agify.io','AI Cats','Cat Facts','Cat Facts 2','Open Library',
    'Swagger Petstore v3','SIM Casino','Giving Block Keith','httpbin','JSONPlaceholder']);
  return badNames.has(n);
};

// ── Variant dedupe: collapse same-brand sub-products to the parent entry ─────────
const DROP_VARIANTS = new Set(['HubSpot Marketing','Facebook Ads (Meta)','Snapchat Ads',
  'Hub88 Games','Hub88 Wallet','DocuSign eSignature','Help Scout Docs','Splunk On-Call',
  'Zendesk Chat','Customer.io Track API']);
const RENAME = { 'Customer.io Pipelines API': 'Customer.io' };

// ── Category consolidation (prod's ~40 noisy categories → clean set) ─────────────
const CAT = {
  'iGaming':'iGaming',
  'Payments':'Payments & Finance','Finance':'Payments & Finance','FinTech':'Payments & Finance','Accounting':'Payments & Finance',
  'AI':'AI','Data':'Analytics & Data','Analytics':'Analytics & Data',
  'Marketing':'Marketing','Marketing & Analytics':'Marketing','CRM':'CRM',
  'Communication':'Communication',
  'Productivity':'Productivity','Data & Productivity':'Productivity','Scheduling':'Productivity',
  'Project Management':'Project Management',
  'Cloud & Infra':'Cloud & Infrastructure','Cloud':'Cloud & Infrastructure','Database':'Cloud & Infrastructure',
  'Dev Tools':'Developer Tools','DevOps':'Developer Tools','CI/CD':'Developer Tools','Monitoring':'Developer Tools',
  'Security':'Security','E-commerce':'E-commerce','Social Media':'Social Media','Support':'Support',
  'CMS':'Content & Media','Media':'Content & Media','Design':'Content & Media',
  'Logistics':'Logistics','HR':'HR','Gaming':'Gaming',
  'Healthcare':'Other','Real Estate':'Other','Travel':'Other','Legal':'Other','Education':'Other','IoT':'Other',
};
const catOf = (c) => CAT[c] || 'Other';

// ── Domain resolution: explicit map → derive from base_url → name slug ───────────
const TWO_LEVEL = new Set(['co.uk','com.au','co.jp','co.nz','com.br','co.in','org.uk','ac.uk','com.sg','co.za']);
function derive(baseUrl) {
  if (!baseUrl) return null;
  let host = baseUrl.replace(/^https?:\/\//,'').split('/')[0].split(':')[0];
  host = host.replace(/\{[^}]*\}\.?/g,'');
  if (!host || host.includes('{') || !host.includes('.')) return null;
  if (host === 'example.com' || host.endsWith('.example.com')) return null;
  const parts = host.split('.').filter(Boolean);
  const lastTwo = parts.slice(-2).join('.');
  return TWO_LEVEL.has(lastTwo) ? parts.slice(-3).join('.') : lastTwo;
}
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,40) + '.com';

// ── Run ─────────────────────────────────────────────────────────────────────────
if (!fs.existsSync(INPUT)) {
  console.error(`Missing ${path.relative(ROOT, INPUT)} — export prod connectors first (see PROD_QUERY.sql).`);
  process.exit(1);
}
const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
const domains = JSON.parse(fs.readFileSync(DOMAINS, 'utf8'));

const seen = new Set();
const stats = { input: raw.length, junk: 0, variant: 0, explicit: 0, derived: 0, slugged: 0 };
const list = [];
for (const c of raw) {
  if (isJunk(c)) { stats.junk++; continue; }
  if (DROP_VARIANTS.has(c.name)) { stats.variant++; continue; }
  const name = RENAME[c.name] || c.name;
  const key = name.toLowerCase().trim();
  if (seen.has(key)) { stats.variant++; continue; }
  seen.add(key);
  let domain, src;
  if (domains[name]) { domain = domains[name]; src = 'explicit'; }
  else { const d = derive(c.base_url); if (d) { domain = d; src = 'derived'; } else { domain = slug(name); src = 'slugged'; } }
  stats[src]++;
  list.push({ name, category: catOf(c.category), domain });
}

// sort iGaming first, then category A→Z, then name
const ord = (cat) => (cat === 'iGaming' ? ' ' : cat);
list.sort((a,b) => ord(a.category).localeCompare(ord(b.category)) || a.name.localeCompare(b.name));

// splice the connector-data block into marketplace.html
let html = fs.readFileSync(MARKETPLACE, 'utf8');
const OPEN = '<script id="connector-data" type="application/json">';
const s = html.indexOf(OPEN);
if (s < 0) { console.error('connector-data block not found in marketplace.html'); process.exit(1); }
const start = s + OPEN.length;
const end = html.indexOf('</script>', start);
const prevCount = JSON.parse(html.slice(start, end)).length;
const block = '[\n' + list.map(c => '      ' + JSON.stringify(c)).join(',\n') + '\n    ]';
html = html.slice(0, start) + '\n    ' + block + '\n    ' + html.slice(end);
fs.writeFileSync(MARKETPLACE, html);

// update the connector count across content pages (prev → new)
const newCount = list.length;
let countEdits = 0;
if (prevCount !== newCount) {
  const re = new RegExp(`\\b${prevCount}\\b`, 'g');
  for (const p of PAGES) {
    const fp = path.join(ROOT, p);
    const before = fs.readFileSync(fp, 'utf8');
    const after = before.replace(re, String(newCount));
    if (after !== before) { fs.writeFileSync(fp, after); countEdits += (before.match(re) || []).length; }
  }
}

const byCat = {};
for (const c of list) byCat[c.category] = (byCat[c.category] || 0) + 1;
console.log(`Marketplace synced: ${stats.input} exported → ${newCount} published`);
console.log(`  dropped: ${stats.junk} junk, ${stats.variant} variant/dupe`);
console.log(`  domains: ${stats.explicit} pinned, ${stats.derived} derived, ${stats.slugged} slug-fallback`);
console.log(`  count ${prevCount} → ${newCount} (${countEdits} refs updated across ${PAGES.length} pages)`);
console.log(`  categories (${Object.keys(byCat).length}): ` +
  Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}:${v}`).join(', '));
