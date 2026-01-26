# OneHazel Implementation Guide

Complete step-by-step guide to implement the registration gate with Supabase and HubSpot integration.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Implementation Steps](#implementation-steps)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

**Total Setup Time**: ~30-45 minutes

### What You'll Build

A gated content registration system that:
- ✅ Blocks all site content until user registers
- ✅ Collects: Email, Name, Company, Job Title, Phone, Business Sector
- ✅ Stores leads in Supabase database
- ✅ Auto-syncs to HubSpot CRM
- ✅ Remembers returning users (localStorage)
- ✅ Handles duplicate registrations gracefully

---

## 📦 Prerequisites

### Required Accounts (All Free Tier)

1. **Supabase Account** - https://supabase.com
   - Free tier: 500MB database, 2GB bandwidth/month
   - No credit card required

2. **HubSpot Account** - https://hubspot.com
   - Free CRM plan works perfectly
   - Need access to create Private Apps (Settings → Integrations)

### Required Tools

1. **Supabase CLI** (for Edge Function deployment)

   ```bash
   # macOS
   brew install supabase/tap/supabase

   # Windows (via Scoop)
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase

   # Linux
   curl -sL https://github.com/supabase/cli/releases/download/v1.127.0/supabase_linux_amd64.tar.gz | tar xz
   sudo mv supabase /usr/local/bin/

   # Verify
   supabase --version
   ```

2. **Git** (optional, for version control)

3. **Text Editor** (VS Code, Sublime, etc.)

---

## 🛠️ Implementation Steps

### Phase 1: Frontend Setup (5 minutes)

The frontend code is already complete in `index.html`. You just need to configure Supabase credentials.

#### Step 1.1: Get Supabase Credentials

1. Create a new Supabase project: https://app.supabase.com
2. Wait for project to provision (~2 minutes)
3. Go to **Settings** → **API**
4. Copy two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### Step 1.2: Update index.html

Open `index.html` and find this section near the bottom:

```javascript
// TODO: Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Replace with your actual values:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

Save the file.

---

### Phase 2: Database Setup (10 minutes)

#### Step 2.1: Create Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create leads table
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

-- Create indexes
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_registered_at ON leads(registered_at);
CREATE INDEX idx_leads_synced ON leads(synced_to_hubspot);
```

4. Click **"Run"** or press `Cmd/Ctrl + Enter`
5. You should see: **"Success. No rows returned"**

#### Step 2.2: Set Up Row Level Security (RLS)

Run this SQL in the same editor:

```sql
-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to register (INSERT)
CREATE POLICY "Allow anonymous registration"
ON leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow service role full access (for Edge Functions)
CREATE POLICY "Allow service role full access"
ON leads
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

Click **"Run"**.

#### Step 2.3: Verify Table Creation

1. Go to **Table Editor** in the left sidebar
2. Click on the **"leads"** table
3. You should see all the columns listed

---

### Phase 3: Test Frontend → Database (5 minutes)

Let's verify the registration gate works before setting up HubSpot.

#### Step 3.1: Open Site Locally

1. Open `index.html` in your browser (double-click the file)
2. You should immediately see the registration gate modal
3. The background content should be blurred/blocked

#### Step 3.2: Submit Test Registration

Fill out the form with test data:
- **Email**: test@example.com
- **Full Name**: Test User
- **Company**: Test Company
- **Job Title**: Developer
- **Phone**: +1 555-123-4567
- **Business Sector**: Technology Provider

Click **"Get Access"**.

#### Step 3.3: Verify Success

1. You should see: **"Registration successful!"**
2. The modal should disappear after 2 seconds
3. You can now see the site content

#### Step 3.4: Test Returning User

1. Refresh the page
2. The registration gate should NOT appear
3. ✅ localStorage is working!

#### Step 3.5: Check Supabase Database

1. Go to Supabase dashboard → **Table Editor** → **leads**
2. You should see your test record
3. Note: `synced_to_hubspot` is `false` (we haven't set up HubSpot yet)

#### Step 3.6: Test Duplicate Registration

1. Open browser console (F12 → Console)
2. Run: `localStorage.removeItem('onehazel_registered')`
3. Refresh the page (gate reappears)
4. Submit the SAME email again
5. You should see: **"This email is already registered"**
6. The gate should still close (allowing access)

✅ **Phase 3 Complete!** Frontend → Database connection is working.

---

### Phase 4: HubSpot Setup (10 minutes)

#### Step 4.1: Create HubSpot Private App

1. Log in to HubSpot
2. Go to **Settings** (gear icon, top right)
3. Navigate to **Integrations** → **Private Apps**
4. Click **"Create a private app"**
5. Fill in:
   - **Name**: OneHazel Integration
   - **Description**: Syncs leads from OneHazel registration gate
6. Go to **"Scopes"** tab
7. Enable these scopes:
   - ✅ `crm.objects.contacts.write`
   - ✅ `crm.objects.contacts.read`
8. Click **"Create app"**
9. **⚠️ IMPORTANT**: Copy the **Access Token** immediately
   - It starts with `pat-na1-...`
   - Save it somewhere safe (you won't see it again!)
   - Example: ``

#### Step 4.2: Test HubSpot API (Optional)

Verify your token works:

```bash
curl -i --location --request GET 'https://api.hubapi.com/crm/v3/objects/contacts?limit=1' \
  --header 'Authorization: Bearer YOUR_HUBSPOT_TOKEN'
```

You should see a 200 response with contact data (or empty results if no contacts exist).

---

### Phase 5: Deploy Edge Function (15 minutes)

#### Step 5.1: Login to Supabase CLI

```bash
supabase login
```

This opens a browser for authentication.

#### Step 5.2: Link Your Project

```bash
cd /Users/user/Downloads/OneHazel
supabase link --project-ref YOUR_PROJECT_REF
```

To find your **Project Reference ID**:
1. Supabase dashboard → **Settings** → **General**
2. Copy the **Reference ID** (e.g., `abcdefgh`)

#### Step 5.3: Set HubSpot Token as Secret

```bash
supabase secrets set HUBSPOT_ACCESS_TOKEN=your_hubspot_token_here
```

Replace `your_hubspot_token_here` with your actual HubSpot token from Step 4.1.

Verify it's set:

```bash
supabase secrets list
```

You should see `HUBSPOT_ACCESS_TOKEN` listed.

#### Step 5.4: Deploy the Edge Function

```bash
supabase functions deploy sync-to-hubspot
```

You should see:
```
Deployed function sync-to-hubspot
```

#### Step 5.5: Test Edge Function Manually

```bash
supabase functions invoke sync-to-hubspot --data '{
  "lead_id": "test-123",
  "email": "edgetest@example.com",
  "full_name": "Edge Test User",
  "company_name": "Test Co",
  "job_title": "Developer",
  "phone_number": "+15551234567",
  "business_sector": "iGaming Operator"
}'
```

Expected response:
```json
{
  "success": true,
  "action": "created",
  "hubspot_contact_id": "123456"
}
```

#### Step 5.6: Verify in HubSpot

1. Go to HubSpot → **Contacts** → **Contacts**
2. Search for `edgetest@example.com`
3. You should see the contact with all fields populated!

---

### Phase 6: Connect Database to Edge Function (5 minutes)

Now we'll set up a database trigger to automatically call the Edge Function when a new lead registers.

#### Step 6.1: Get Service Role Key

1. Supabase dashboard → **Settings** → **API**
2. Copy the **service_role** key (under "Project API keys")
3. ⚠️ This key is SECRET - never expose it to the client!

#### Step 6.2: Create Database Trigger

Go to **SQL Editor** and run:

```sql
-- Create function to call Edge Function
CREATE OR REPLACE FUNCTION trigger_hubspot_sync()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  service_key TEXT;
BEGIN
  -- Set your project URL and service role key here
  function_url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/sync-to-hubspot';
  service_key := 'YOUR_SERVICE_ROLE_KEY';

  -- Call Edge Function asynchronously
  PERFORM
    net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key
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

-- Create trigger
CREATE TRIGGER on_lead_created
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION trigger_hubspot_sync();
```

**⚠️ IMPORTANT**: Replace:
- `YOUR_PROJECT_REF` with your project reference ID (e.g., `abcdefgh`)
- `YOUR_SERVICE_ROLE_KEY` with the service role key you copied

Click **"Run"**.

---

### Phase 7: End-to-End Test (5 minutes)

Let's test the complete flow: Frontend → Database → Edge Function → HubSpot

#### Step 7.1: Clear Previous Test Data

```javascript
// In browser console:
localStorage.removeItem('onehazel_registered');
```

#### Step 7.2: Submit New Registration

1. Refresh the page (gate reappears)
2. Use a NEW email (not test@example.com)
3. Fill out all fields:
   - **Email**: newtest@example.com
   - **Full Name**: Integration Test
   - **Company**: E2E Test Co
   - **Job Title**: QA Engineer
   - **Phone**: +1 555-999-8888
   - **Business Sector**: Casino
4. Click **"Get Access"**
5. Wait for success message

#### Step 7.3: Verify in Supabase

1. Go to **Table Editor** → **"leads"**
2. Find your new record
3. Initially: `synced_to_hubspot` = `false`
4. Wait 10-30 seconds
5. **Refresh the table**
6. Now: `synced_to_hubspot` = `true` ✅
7. `hubspot_contact_id` should have a value

#### Step 7.4: Verify in HubSpot

1. Go to HubSpot → **Contacts** → **Contacts**
2. Search for `newtest@example.com`
3. You should see the contact!
4. Verify all fields:
   - First name: Integration
   - Last name: Test
   - Company: E2E Test Co
   - Job title: QA Engineer
   - Phone: +1 555-999-8888
   - Industry: Casino

✅ **SUCCESS!** End-to-end integration is complete!

---

## 🧪 Testing

### Test Scenarios

#### 1. First-Time User
- Load site → Gate appears
- Fill form → Submit
- Success message → Gate disappears
- Content is now accessible

#### 2. Returning User
- Load site → No gate (localStorage check)
- Content immediately accessible

#### 3. Duplicate Email
- Register with existing email
- See: "This email is already registered"
- Gate still closes (allows access)

#### 4. Form Validation
- Try submitting empty fields → Error
- Invalid email format → Error
- Phone number too short → Error

#### 5. Database Sync
- New registration → Check Supabase
- Record should appear within seconds

#### 6. HubSpot Sync
- New registration → Wait 10-30 seconds
- Check Supabase: `synced_to_hubspot` = true
- Check HubSpot: Contact exists with all fields

### Monitoring Commands

```bash
# View Edge Function logs
supabase functions logs sync-to-hubspot --tail

# Check database records
# (Run in Supabase SQL Editor)
SELECT * FROM leads ORDER BY registered_at DESC LIMIT 10;

# Check sync success rate
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN synced_to_hubspot THEN 1 ELSE 0 END) as synced,
  ROUND(100.0 * SUM(CASE WHEN synced_to_hubspot THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM leads;
```

---

## 🚀 Deployment

### Deploying to Production

#### Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)

1. Push code to GitHub
2. Connect repository to hosting service
3. Deploy (no build step needed - it's static HTML)
4. Custom domain: Update DNS settings

#### Option 2: Traditional Web Server

1. Upload `index.html` to your server
2. Configure web server (Apache, Nginx, etc.)
3. Ensure HTTPS is enabled

#### Important: Update CORS (If Needed)

If you deploy to a custom domain, update the Edge Function CORS settings:

Edit `supabase/functions/sync-to-hubspot/index.ts`:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://yourdomain.com", // Update this
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

Redeploy:

```bash
supabase functions deploy sync-to-hubspot
```

---

## 🐛 Troubleshooting

### Issue: Registration Gate Doesn't Appear

**Possible Causes**:
- JavaScript error - check browser console
- Supabase credentials not set
- Ad blocker blocking Supabase CDN

**Solution**:
```javascript
// Check console for errors
// Verify credentials are set:
console.log(SUPABASE_URL); // Should not be 'YOUR_SUPABASE_PROJECT_URL'
```

### Issue: Form Submission Fails

**Possible Causes**:
- Supabase credentials incorrect
- RLS policies not set up
- Network issue

**Solution**:
1. Check browser console for error message
2. Verify credentials in index.html
3. Verify RLS policies exist:

```sql
SELECT * FROM pg_policies WHERE tablename = 'leads';
```

### Issue: Data Not Syncing to HubSpot

**Possible Causes**:
- Edge Function not deployed
- HubSpot token not set
- Database trigger not created

**Solution**:

```bash
# 1. Check Edge Function logs
supabase functions logs sync-to-hubspot

# 2. Verify HubSpot token
supabase secrets list

# 3. Check database trigger exists
# (Run in SQL Editor)
SELECT * FROM pg_trigger WHERE tgname = 'on_lead_created';
```

### Issue: "Failed to fetch" Error

**Possible Causes**:
- Supabase project URL incorrect
- Network/firewall blocking request
- Supabase project paused (free tier inactivity)

**Solution**:
1. Verify project URL is correct
2. Try accessing Supabase dashboard
3. Check if project is paused (resume it)

### Issue: HubSpot Contact Already Exists

**Expected Behavior**: Edge Function should automatically update existing contact instead of creating duplicate.

If duplicate contacts are being created:
1. Check Edge Function logs
2. Verify HubSpot scopes include `crm.objects.contacts.read`
3. Test search API manually:

```bash
curl -X POST https://api.hubapi.com/crm/v3/objects/contacts/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filterGroups":[{"filters":[{"propertyName":"email","operator":"EQ","value":"test@example.com"}]}]}'
```

---

## 📊 Analytics & Monitoring

### View Registration Stats

Run in Supabase SQL Editor:

```sql
-- Total registrations
SELECT COUNT(*) as total_leads FROM leads;

-- Registrations today
SELECT COUNT(*) as today_leads
FROM leads
WHERE registered_at::date = CURRENT_DATE;

-- Registrations by sector
SELECT
  business_sector,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 2) as percentage
FROM leads
GROUP BY business_sector
ORDER BY count DESC;

-- Recent registrations
SELECT
  email,
  full_name,
  company_name,
  business_sector,
  registered_at,
  synced_to_hubspot
FROM leads
ORDER BY registered_at DESC
LIMIT 20;

-- Sync success rate
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN synced_to_hubspot THEN 1 ELSE 0 END) as synced,
  SUM(CASE WHEN NOT synced_to_hubspot THEN 1 ELSE 0 END) as pending,
  ROUND(100.0 * SUM(CASE WHEN synced_to_hubspot THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate_percent
FROM leads;
```

### Set Up Alerts (Optional)

Create a webhook to notify your team of new registrations:

1. Go to **Database** → **Webhooks** in Supabase
2. Create webhook for `leads` table on `INSERT`
3. Send to Slack, Discord, email service, etc.

---

## 🎯 Next Steps

### Recommended Enhancements

1. **Email Verification** - Use Supabase Auth for verified emails
2. **CAPTCHA** - Add reCAPTCHA to prevent bot registrations
3. **Analytics** - Add Google Analytics or Plausible tracking
4. **A/B Testing** - Test different gate copy/designs
5. **Custom Fields** - Add more HubSpot custom properties
6. **Export** - Add CSV export of leads from Supabase
7. **Notifications** - Real-time Slack/email alerts for new leads

### Additional Resources

- 📘 [Supabase Documentation](https://supabase.com/docs)
- 📘 [HubSpot API Docs](https://developers.hubspot.com/docs/api/crm/contacts)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 📧 [HubSpot Developer Support](https://community.hubspot.com/t5/APIs-Integrations/ct-p/apis)

---

## 🎉 Congratulations!

You've successfully implemented a production-ready registration gate with:
- ✅ Gated content access
- ✅ Supabase database storage
- ✅ HubSpot CRM integration
- ✅ Automatic lead syncing
- ✅ Duplicate prevention
- ✅ Returning user support

Your OneHazel platform is now ready to capture and manage leads!
