# HubSpot Sync Edge Function

This Supabase Edge Function automatically syncs new lead registrations from the OneHazel registration gate to HubSpot CRM.

## How It Works

1. **Trigger**: Automatically invoked when a new lead is inserted into the `leads` table
2. **Process**: Extracts lead data and calls HubSpot Contacts API
3. **Update**: Marks the lead as `synced_to_hubspot = true` in Supabase

## Features

- ✅ Creates new contacts in HubSpot
- ✅ Updates existing contacts if email already exists
- ✅ Splits full name into first/last name
- ✅ Maps all registration fields to HubSpot properties
- ✅ Error handling with retry logic
- ✅ Updates Supabase with sync status

## Required Environment Variables

Configure these in Supabase:

```bash
supabase secrets set HUBSPOT_ACCESS_TOKEN=your_token_here
```

The function also uses these automatic Supabase env vars:
- `SUPABASE_URL` (auto-injected)
- `SUPABASE_SERVICE_ROLE_KEY` (auto-injected)

## HubSpot Field Mapping

| OneHazel Field | HubSpot Property |
|----------------|------------------|
| email | email |
| full_name (first word) | firstname |
| full_name (remaining) | lastname |
| company_name | company |
| job_title | jobtitle |
| phone_number | phone |
| business_sector | industry |

## Deployment

```bash
# Deploy the function
supabase functions deploy sync-to-hubspot

# View logs
supabase functions logs sync-to-hubspot

# Test manually
supabase functions invoke sync-to-hubspot --data '{
  "lead_id": "test-123",
  "email": "test@example.com",
  "full_name": "John Doe",
  "company_name": "Test Company",
  "job_title": "CTO",
  "phone_number": "+1234567890",
  "business_sector": "iGaming Operator"
}'
```

## Error Handling

The function handles:
- ✅ Duplicate contacts (409 conflict) - Updates instead
- ✅ Missing required fields - Returns error
- ✅ HubSpot API failures - Logs and returns error
- ✅ Supabase update failures - Logs but doesn't fail the sync

## Monitoring

Check function logs for sync status:

```bash
supabase functions logs sync-to-hubspot --tail
```

Look for:
- `"Processing lead: ..."` - Function started
- `"Successfully created HubSpot contact: ..."` - Success
- `"Contact already exists, updating instead..."` - Update flow
- `"Error syncing to HubSpot: ..."` - Failures

## Troubleshooting

### "HUBSPOT_ACCESS_TOKEN not configured"

**Solution**: Set the HubSpot token:

```bash
supabase secrets set HUBSPOT_ACCESS_TOKEN=your_token
```

### "Missing required scopes"

**Solution**: Ensure your HubSpot Private App has these scopes:
- `crm.objects.contacts.write`
- `crm.objects.contacts.read`

### Function not triggering

**Solution**: Check the database trigger:

```sql
-- Verify trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_lead_created';

-- Re-create if needed (see SUPABASE_SETUP.md)
```

## Local Development

To test locally:

```bash
# Start Supabase locally
supabase start

# Serve the function
supabase functions serve sync-to-hubspot

# Test in another terminal
curl -i --location --request POST 'http://localhost:54321/functions/v1/sync-to-hubspot' \
  --header 'Authorization: Bearer eyJhbG...' \
  --header 'Content-Type: application/json' \
  --data '{
    "lead_id": "test-123",
    "email": "test@example.com",
    "full_name": "Jane Smith",
    "company_name": "Example Corp",
    "job_title": "VP of Engineering",
    "phone_number": "+15551234567",
    "business_sector": "Technology Provider"
  }'
```

## Performance

- Average execution time: ~500-800ms
- HubSpot API rate limit: 100 requests/10 seconds (burst: 10/s)
- Supabase Edge Functions: 1 million invocations free per month

## Security

✅ **Secure**:
- HubSpot token stored as Edge Function secret (server-side only)
- Service role key never exposed to client
- CORS headers properly configured

⚠️ **Important**:
- Never commit the HubSpot token to version control
- Rotate tokens if compromised
- Monitor function logs for suspicious activity
