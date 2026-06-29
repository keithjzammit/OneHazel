-- Export live connectors from the PROD Supabase project ("OneHazel").
-- Run in Supabase Studio (SQL editor) or via the `supabase` MCP, then save the
-- JSON array to scripts/marketplace/prod-connectors.json and run sync.mjs.
--
-- Returns the latest version of every connector whose latest version is `active`.
-- All cleaning/dedupe/category/domain logic lives in sync.mjs — keep this query raw.

with latest as (
  select distinct on (connector_key)
    connector_key,
    status,
    catalog_data->>'name'     as name,
    catalog_data->>'category' as category,
    catalog_data->>'baseUrl'  as base_url
  from connector_versions
  order by connector_key, version desc
)
select json_agg(
         json_build_object('name', name, 'category', category, 'base_url', base_url)
         order by name
       ) as data
from latest
where status = 'active';
