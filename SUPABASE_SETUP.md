# OneHazel Supabase Setup Guide

This guide walks you through setting up Supabase for the OneHazel registration gate and HubSpot integration.

---

## Prerequisites

- A Supabase account (free tier works fine): https://supabase.com
- A HubSpot account with access to Private Apps
- Basic familiarity with SQL and API concepts

---

## Phase 1: Create Supabase Project

1. Go to https://app.supabase.com and sign in
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: OneHazel
   - **Database Password**: (Generate a strong password and save it securely)
   - **Region**: Choose closest to your users
4. Click **"Create New Project"** (takes ~2 minutes to provision)

---

## Phase 2: Create Database Table

### Step 1: Navigate to SQL Editor

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

### Step 2: Run Database Setup Script

Copy and paste the following SQL script:

```sql
-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  business_sector TEXT NOT NULL,
  registered_at TIMESTAMP DEFAULT NOW(),
  synced_to_hubspot BOOLEAN DEFAULT FALSE,
  hubspot_contact_id TEXT
);

-- Create index on email for faster lookups
CREATE INDEX idx_leads_email ON leads(email);

-- Create index on registered_at for analytics
CREATE INDEX idx_leads_registered_at ON leads(registered_at);

-- Create index on synced_to_hubspot for HubSpot sync monitoring
CREATE INDEX idx_leads_synced ON leads(synced_to_hubspot);
```

3. Click **"Run"** (or press `Cmd/Ctrl + Enter`)
4. You should see: **"Success. No rows returned"**

### Step 3: Verify Table Creation

1. Click **"Table Editor"** in the left sidebar
2. You should see the **"leads"** table
3. Click on it to view the structure

---

## Phase 3: Configure Row Level Security (RLS)

Supabase requires RLS policies to control data access. We'll allow:
- **Anonymous users**: Can INSERT (register)
- **Service role only**: Can read/update/delete (for Edge Functions)

### Step 1: Enable RLS

1. Go to **"Authentication"** → **"Policies"**
2. Find the **"leads"** table
3. Click **"Enable RLS"** if not already enabled

### Step 2: Create RLS Policies

Go back to **SQL Editor** and run this script:

```sql
-- Enable RLS on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous users to INSERT (register)
CREATE POLICY "Allow anonymous registration"
ON leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 2: Allow service role full access (for Edge Functions)
CREATE POLICY "Allow service role full access"
ON leads
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

Click **"Run"**.

---

## Phase 4: Get Supabase Credentials

You need two values to connect your frontend to Supabase:

### 1. Project URL

1. Go to **"Settings"** → **"API"**
2. Copy the **"Project URL"**
   - Example: `https://abcdefgh.supabase.co`

### 2. Anon/Public Key

1. In the same **"Settings"** → **"API"** page
2. Copy the **"anon" key** (under "Project API keys")
   - This key is **safe** to use in client-side code
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Update index.html

Open `index.html` and replace the placeholder values:

```javascript
// Find these lines in the <script> section at the bottom:
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Replace with your actual values:
const SUPABASE_URL = 'https://abcdefgh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## Phase 5: Test the Registration Flow

### 1. Test Database Connection

1. Open `index.html` in a browser
2. Open browser console (F12 or right-click → Inspect → Console)
3. The registration gate should appear

### 2. Submit Test Registration

Fill out the form with test data:
- **Email**: test@example.com
- **Full Name**: Test User
- **Company**: Test Company
- **Job Title**: Developer
- **Phone**: +1 555-123-4567
- **Business Sector**: Technology Provider

Click **"Get Access"**.

### 3. Verify in Supabase Dashboard

1. Go to **"Table Editor"** → **"leads"**
2. You should see your test record
3. Note: `synced_to_hubspot` should be `false` (we haven't set up HubSpot yet)

### 4. Test Returning User Flow

1. Refresh the page
2. The registration gate should NOT appear (localStorage check)
3. Open console and run: `localStorage.removeItem('onehazel_registered')`
4. Refresh again - gate reappears

### 5. Test Duplicate Email Prevention

1. Try submitting the same email again
2. You should see: "This email is already registered"
3. The gate should still close (allowing access)

---

## Phase 6: HubSpot Setup (Preparation)

Before creating the Edge Function, set up HubSpot API access.

### Step 1: Create HubSpot Private App

1. Log in to your HubSpot account
2. Go to **Settings** (gear icon) → **Integrations** → **Private Apps**
3. Click **"Create a private app"**
4. Fill in details:
   - **Name**: OneHazel Integration
   - **Description**: Syncs leads from OneHazel registration gate
5. Go to the **"Scopes"** tab
6. Enable these scopes:
   - ✅ `crm.objects.contacts.write`
   - ✅ `crm.objects.contacts.read`
7. Click **"Create app"**
8. Copy the **Access Token** (starts with `pat-na1-...`)
9. **⚠️ IMPORTANT**: Save this token securely - it won't be shown again!

---

## Phase 7: Deploy Supabase Edge Function

Edge Functions run server-side and can securely call the HubSpot API.

### Step 1: Install Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (use Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Verify installation
supabase --version
```

### Step 2: Login to Supabase CLI

```bash
supabase login
```

This will open a browser for authentication.

### Step 3: Link Your Project

```bash
# Navigate to your project directory
cd /Users/user/Downloads/OneHazel

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF
```

To find your project ref:
1. Go to Supabase dashboard → **Settings** → **General**
2. Copy the **Reference ID** (e.g., `abcdefgh`)

### Step 4: Create Edge Function Directory

The Edge Function code is already prepared in the `supabase/functions/sync-to-hubspot/` directory.

### Step 5: Set HubSpot Token as Secret

```bash
supabase secrets set HUBSPOT_ACCESS_TOKEN=your_hubspot_token_here
```

Replace `your_hubspot_token_here` with the token you copied from HubSpot.

### Step 6: Deploy the Edge Function

```bash
supabase functions deploy sync-to-hubspot
```

You should see: **"Deployed function sync-to-hubspot"**

### Step 7: Set Up Database Trigger

Go to **SQL Editor** in Supabase and run:

```sql
-- Create a function to call the Edge Function
CREATE OR REPLACE FUNCTION trigger_hubspot_sync()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function asynchronously
  PERFORM
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/sync-to-hubspot',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'
      ),
      body := jsonb_build_object(
        'lead_id', NEW.id,
        'email', NEW.email,
        'full_name', NEW.full_name,
        'company_name', NEW.company_name,
        'job_title', NEW.job_title,
        'phone_number', NEW.phone_number,
        'business_sector', NEW.business_sector
      )
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on INSERT
CREATE TRIGGER on_lead_created
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION trigger_hubspot_sync();
```

**⚠️ Replace:**
- `YOUR_PROJECT_REF` with your Supabase project reference ID
- `YOUR_SUPABASE_SERVICE_ROLE_KEY` with your service role key (found in Settings → API)

---

## Phase 8: Test End-to-End Integration

### 1. Submit New Registration

1. Clear localStorage: `localStorage.removeItem('onehazel_registered')`
2. Refresh page
3. Submit a NEW test registration with a different email

### 2. Check Supabase

1. Go to **Table Editor** → **"leads"**
2. Find your new record
3. Wait ~10-30 seconds
4. Refresh the table
5. `synced_to_hubspot` should now be `true`
6. `hubspot_contact_id` should contain a HubSpot ID

### 3. Check HubSpot

1. Go to HubSpot → **Contacts** → **Contacts**
2. Search for the email you used
3. You should see the contact with all fields populated:
   - First name, Last name (split from full_name)
   - Company
   - Job title
   - Phone
   - Industry (business sector)

---

## Troubleshooting

### Issue: "Failed to insert row"

**Solution**: Check RLS policies. Make sure the anonymous INSERT policy is enabled.

```sql
-- Re-run this if needed:
CREATE POLICY "Allow anonymous registration"
ON leads FOR INSERT TO anon WITH CHECK (true);
```

### Issue: "Email already registered" but can't access content

**Solution**: Clear localStorage and try again:

```javascript
localStorage.removeItem('onehazel_registered');
localStorage.removeItem('onehazel_email');
```

### Issue: Edge Function not syncing to HubSpot

**Solution 1**: Check Edge Function logs:

```bash
supabase functions logs sync-to-hubspot
```

**Solution 2**: Verify HubSpot token is set:

```bash
supabase secrets list
```

**Solution 3**: Test Edge Function manually:

```bash
curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/sync-to-hubspot' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"lead_id":"test-id","email":"test@example.com","full_name":"Test User","company_name":"Test Co","job_title":"Developer","phone_number":"+15551234567","business_sector":"iGaming Operator"}'
```

### Issue: HubSpot contact not created

**Solution 1**: Check HubSpot API scopes (must have `crm.objects.contacts.write`)

**Solution 2**: Verify token hasn't expired (Private App tokens don't expire, but can be deleted)

**Solution 3**: Check Edge Function logs for error messages

---

## Security Notes

✅ **Safe to expose (client-side):**
- Supabase Project URL
- Supabase Anon Key

🔒 **Keep secret (never expose):**
- Supabase Service Role Key
- HubSpot Access Token
- Database password

---

## Monitoring & Analytics

### View Lead Registrations

```sql
-- Total leads
SELECT COUNT(*) FROM leads;

-- Leads today
SELECT COUNT(*) FROM leads
WHERE registered_at >= CURRENT_DATE;

-- Leads by business sector
SELECT business_sector, COUNT(*) as count
FROM leads
GROUP BY business_sector
ORDER BY count DESC;

-- Sync success rate
SELECT
  COUNT(*) as total_leads,
  SUM(CASE WHEN synced_to_hubspot THEN 1 ELSE 0 END) as synced,
  ROUND(100.0 * SUM(CASE WHEN synced_to_hubspot THEN 1 ELSE 0 END) / COUNT(*), 2) as sync_rate_percent
FROM leads;
```

### Set Up Real-time Notifications (Optional)

You can configure Supabase webhooks to notify your team when new leads register:

1. Go to **Database** → **Webhooks**
2. Create webhook for **"leads"** table on **INSERT**
3. Send to Slack, Discord, or email service

---

## Next Steps

1. ✅ Test the full registration flow
2. ✅ Monitor HubSpot contact creation
3. 📧 Set up email verification (optional)
4. 📊 Add analytics tracking
5. 🔐 Consider adding CAPTCHA for spam prevention
6. 🎨 Customize the registration gate design

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **HubSpot API Docs**: https://developers.hubspot.com/docs/api/crm/contacts
- **Supabase Discord**: https://discord.supabase.com

---

**Setup complete!** 🎉 Your OneHazel registration gate is now live with full Supabase + HubSpot integration.
