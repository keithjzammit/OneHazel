# OneHazel - Vertical iPaaS for iGaming

A modern landing page with integrated registration gate, Supabase database, and HubSpot CRM sync.

![OneHazel](https://img.shields.io/badge/Status-Production%20Ready-success)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E)
![HubSpot](https://img.shields.io/badge/CRM-HubSpot-FF7A59)
![Security](https://img.shields.io/badge/Security-Two%20Options-blue)

---

## 🔐 Two Security Approaches Available

This project offers **two implementations** - choose based on your security requirements:

### Option 1: Standard Approach (Recommended for Most)
**File:** `index.html`

✅ Uses Supabase's standard pattern (anon key in client)
✅ Secured by Row Level Security (RLS)
✅ Faster setup
✅ Industry standard for client-side apps

📖 **Guide:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)

### Option 2: Maximum Security Approach
**File:** `index-secure.html`

🔒 Zero credentials in client code
🔒 All operations via Edge Functions
🔒 Perfect for high-compliance requirements
🔒 Server-side validation

📖 **Guide:** [SECURE_SETUP.md](SECURE_SETUP.md)

**Not sure which to choose?** Read [SECURITY_COMPARISON.md](SECURITY_COMPARISON.md) for a detailed comparison.

---

## 🚀 Features

### Landing Page
- ✨ Modern, responsive design with Tailwind CSS
- 🎨 Gradient effects and animated AI agent visualizations
- 📱 Mobile-first, fully responsive layout
- 🎯 Clear value proposition for iGaming vertical iPaaS

### Registration Gate
- 🔒 **Gated Content**: Users must register before viewing site
- 📝 **Comprehensive Form**: Email, Name, Company, Job Title, Phone, Business Sector
- ✅ **Form Validation**: Email format, required fields, phone number validation
- 💾 **Persistent Access**: localStorage remembers returning users
- 🔄 **Duplicate Handling**: Graceful handling of existing emails

### Backend Integration
- 🗄️ **Supabase Database**: Secure, scalable PostgreSQL database
- 🔐 **Row Level Security (RLS)**: Proper access control policies
- ⚡ **Edge Functions**: Serverless functions for HubSpot sync
- 🔄 **Automatic Sync**: Database triggers call Edge Function on new leads
- 📊 **HubSpot CRM**: Auto-create/update contacts with full field mapping

---

## 📁 Project Structure

```
OneHazel/
├── index.html                          # Main landing page with registration gate
├── README.md                           # This file
├── IMPLEMENTATION_GUIDE.md             # Complete setup instructions
├── SUPABASE_SETUP.md                   # Detailed Supabase configuration
└── supabase/
    └── functions/
        └── sync-to-hubspot/
            ├── index.ts                # Edge Function for HubSpot sync
            └── README.md               # Edge Function documentation
```

---

## ⚡ Quick Start

### Prerequisites

- [Supabase Account](https://supabase.com) (free tier)
- [HubSpot Account](https://hubspot.com) (free CRM)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for Edge Function deployment)

### Setup (30 minutes)

1. **Clone/Download** this repository

2. **Set Up Supabase**
   - Create new project at https://app.supabase.com
   - Run SQL setup script (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md))
   - Copy Project URL and Anon Key

3. **Configure Frontend**
   - Open `index.html`
   - Replace Supabase credentials:
     ```javascript
     const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
     const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
     ```

4. **Set Up HubSpot**
   - Create Private App in HubSpot
   - Grant scopes: `crm.objects.contacts.write`, `crm.objects.contacts.read`
   - Copy Access Token

5. **Deploy Edge Function**
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase secrets set HUBSPOT_ACCESS_TOKEN=your_token
   supabase functions deploy sync-to-hubspot
   ```

6. **Test It!**
   - Open `index.html` in browser
   - Fill out registration form
   - Check Supabase database
   - Verify contact in HubSpot

For detailed step-by-step instructions, see **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)**.

---

## 🎯 How It Works

### User Flow

```
User visits site
    ↓
Registration gate appears (full-screen modal)
    ↓
User fills form and submits
    ↓
Data saved to Supabase "leads" table
    ↓
Success message → Gate disappears
    ↓
localStorage saves registration status
    ↓
Database trigger fires → Calls Edge Function
    ↓
Edge Function syncs to HubSpot CRM
    ↓
Supabase record updated: synced_to_hubspot = true
```

### Architecture

```
┌─────────────────┐
│   index.html    │  Frontend (Static HTML)
│  (Client-side)  │
└────────┬────────┘
         │
         │ Supabase JS Client
         │
┌────────▼────────┐
│   Supabase      │  Backend (PostgreSQL + Edge Functions)
│   - Database    │
│   - RLS         │
│   - Triggers    │
└────────┬────────┘
         │
         │ Edge Function
         │
┌────────▼────────┐
│   HubSpot CRM   │  External API
│   - Contacts    │
└─────────────────┘
```

---

## 📊 Database Schema

### Table: `leads`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| email | TEXT | Unique email address |
| full_name | TEXT | Full name of registrant |
| company_name | TEXT | Company/organization name |
| job_title | TEXT | Job title/role |
| phone_number | TEXT | Phone number |
| business_sector | TEXT | Industry/sector |
| registered_at | TIMESTAMP | Registration timestamp |
| synced_to_hubspot | BOOLEAN | Sync status flag |
| hubspot_contact_id | TEXT | HubSpot contact ID |

---

## 🔐 Security

### What's Safe

✅ **Client-side (Exposed in HTML)**:
- Supabase Project URL
- Supabase Anon Key (designed for public use)

### What's Secret

🔒 **Server-side (Never expose)**:
- Supabase Service Role Key
- HubSpot Private App Access Token
- Database password

### Security Features

- ✅ Row Level Security (RLS) prevents unauthorized data access
- ✅ Edge Functions run server-side (tokens never exposed)
- ✅ CORS headers properly configured
- ✅ Input validation on all form fields
- ✅ Prepared statements prevent SQL injection

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Registration gate appears on first visit
- [ ] All form fields validate correctly
- [ ] Email format validation works
- [ ] Phone number validation works
- [ ] Duplicate email shows appropriate message
- [ ] Successful registration hides gate
- [ ] localStorage persists registration
- [ ] Returning users don't see gate
- [ ] Data appears in Supabase `leads` table
- [ ] Contact created in HubSpot CRM
- [ ] All HubSpot fields populated correctly
- [ ] `synced_to_hubspot` updates to `true`

### Testing Commands

```bash
# View Edge Function logs
supabase functions logs sync-to-hubspot --tail

# Test Edge Function manually
supabase functions invoke sync-to-hubspot --data '{
  "lead_id": "test-123",
  "email": "test@example.com",
  "full_name": "Test User",
  "company_name": "Test Co",
  "job_title": "Developer",
  "phone_number": "+15551234567",
  "business_sector": "Technology Provider"
}'

# Clear localStorage (browser console)
localStorage.removeItem('onehazel_registered')
```

---

## 📈 Analytics Queries

Run these in Supabase SQL Editor:

```sql
-- Total registrations
SELECT COUNT(*) FROM leads;

-- Registrations today
SELECT COUNT(*) FROM leads WHERE registered_at::date = CURRENT_DATE;

-- By business sector
SELECT business_sector, COUNT(*) as count
FROM leads
GROUP BY business_sector
ORDER BY count DESC;

-- Sync success rate
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN synced_to_hubspot THEN 1 ELSE 0 END) as synced,
  ROUND(100.0 * SUM(CASE WHEN synced_to_hubspot THEN 1 ELSE 0 END) / COUNT(*), 2) || '%' as success_rate
FROM leads;
```

---

## 🚀 Deployment

### Static Hosting (Recommended)

Deploy to any static hosting service:

- **Netlify**: Drag and drop `index.html`
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Push to `gh-pages` branch
- **Cloudflare Pages**: Connect GitHub repo

### Traditional Hosting

Upload `index.html` to your web server:

```bash
# Example: SCP to server
scp index.html user@yourserver.com:/var/www/html/

# Example: FTP upload
# Use FileZilla or similar to upload index.html
```

### Custom Domain

1. Configure DNS records with your hosting provider
2. Update CORS in Edge Function if needed:
   ```typescript
   const corsHeaders = {
     "Access-Control-Allow-Origin": "https://yourdomain.com",
   };
   ```

---

## 🐛 Troubleshooting

### Registration gate doesn't appear
- Check browser console for errors
- Verify Supabase credentials are set correctly
- Disable ad blockers

### Form submission fails
- Check Supabase RLS policies are configured
- Verify anon key is correct
- Check network tab in browser dev tools

### HubSpot sync not working
- Check Edge Function logs: `supabase functions logs sync-to-hubspot`
- Verify HubSpot token is set: `supabase secrets list`
- Test Edge Function manually (see Testing section)
- Verify HubSpot Private App scopes

For more troubleshooting, see [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md).

---

## 🔧 Customization

### Change Form Fields

Edit `index.html` - modify the form section:
```html
<!-- Add new field -->
<div>
  <label class="...">New Field <span class="text-red-400">*</span></label>
  <input type="text" id="newField" required class="...">
</div>
```

Update database schema:
```sql
ALTER TABLE leads ADD COLUMN new_field TEXT;
```

Update Edge Function to include new field in HubSpot sync.

### Customize Styling

All styles are in `index.html`:
- Edit Tailwind classes in HTML
- Modify custom CSS in `<style>` section
- Update colors in `gradient-text` class

### Change Business Sectors

Edit the `<select id="businessSector">` dropdown in `index.html`:
```html
<option value="New Sector">New Sector</option>
```

---

## 📚 Documentation

- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Complete setup walkthrough
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Detailed Supabase configuration
- **[supabase/functions/sync-to-hubspot/README.md](supabase/functions/sync-to-hubspot/README.md)** - Edge Function docs

---

## 🤝 Support

### Resources

- 📘 [Supabase Documentation](https://supabase.com/docs)
- 📘 [HubSpot API Docs](https://developers.hubspot.com/docs/api/crm/contacts)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 📧 [HubSpot Community](https://community.hubspot.com/t5/APIs-Integrations/ct-p/apis)

### Common Issues

Check the troubleshooting sections in:
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md#-troubleshooting)
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md#troubleshooting)

---

## 📝 License

This project is provided as-is for OneHazel. Modify and use as needed.

---

## 🎉 Credits

Built with:
- [Supabase](https://supabase.com) - Backend as a Service
- [HubSpot](https://hubspot.com) - CRM Platform
- [Tailwind CSS](https://tailwindcss.com) - CSS Framework
- [Font Awesome](https://fontawesome.com) - Icons

---

**OneHazel** - The Last Integration You Will Ever Build

*Elevate AI | Vertical iPaaS Architecture*
