# OneHazel Quick Start Guide

Choose your path based on your security requirements:

---

## 🚀 Path 1: Standard Setup (Recommended)

**Best for:** Most projects, startups, MVPs, standard security requirements

**Time:** 30 minutes
**Complexity:** ⭐⭐☆☆☆

### What You'll Use
- `index.html` - Main file
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Follow this guide

### Quick Steps

1. **Create Supabase project** (5 min)
2. **Run database setup SQL** (5 min)
3. **Add credentials to index.html** (2 min)
4. **Test registration** (3 min)
5. **Set up HubSpot** (10 min)
6. **Deploy Edge Function** (5 min)
7. **Test end-to-end** (5 min)

✅ **Start here:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)

---

## 🔒 Path 2: Maximum Security Setup

**Best for:** Financial services, healthcare, high-compliance environments

**Time:** 35 minutes
**Complexity:** ⭐⭐⭐☆☆

### What You'll Use
- `index-secure.html` - Main file (rename to index.html)
- [SECURE_SETUP.md](SECURE_SETUP.md) - Follow this guide

### Quick Steps

1. **Create Supabase project** (5 min)
2. **Run database setup SQL** (5 min)
3. **Set up HubSpot** (10 min)
4. **Deploy register-lead Edge Function** (5 min)
5. **Update Edge Function URL in HTML** (2 min)
6. **Test end-to-end** (5 min)

✅ **Start here:** [SECURE_SETUP.md](SECURE_SETUP.md)

---

## 🤔 Still Deciding?

Read [SECURITY_COMPARISON.md](SECURITY_COMPARISON.md) to understand:
- Why the standard approach is already secure
- When you need the maximum security approach
- Performance differences
- Compliance considerations

---

## 📁 File Structure Guide

```
OneHazel/
├── index.html                  ← Standard approach (uses Supabase client)
├── index-secure.html           ← Max security (Edge Function only)
│
├── QUICKSTART.md              ← You are here!
├── IMPLEMENTATION_GUIDE.md    ← Guide for standard approach
├── SECURE_SETUP.md            ← Guide for max security approach
├── SECURITY_COMPARISON.md     ← Explains both approaches
├── SUPABASE_SETUP.md          ← Database configuration (both)
│
└── supabase/functions/
    ├── sync-to-hubspot/       ← HubSpot sync (standard approach)
    └── register-lead/         ← Registration (max security approach)
```

---

## ⚡ Super Quick Decision Matrix

| Question | Answer | Use |
|----------|--------|-----|
| Is this for a startup/MVP? | Yes | **Standard** |
| Need to launch ASAP? | Yes | **Standard** |
| Healthcare/Finance industry? | Yes | **Max Security** |
| Strict compliance requirements? | Yes | **Max Security** |
| Want simplest setup? | Yes | **Standard** |
| Want zero client credentials? | Yes | **Max Security** |
| Learning Supabase? | Yes | **Standard** |
| Already know Supabase well? | Either | **Either** |

---

## 🆘 Need Help?

### Standard Approach Issues
- Check: [IMPLEMENTATION_GUIDE.md - Troubleshooting](IMPLEMENTATION_GUIDE.md#-troubleshooting)
- Check: [SUPABASE_SETUP.md - Troubleshooting](SUPABASE_SETUP.md#troubleshooting)

### Max Security Approach Issues
- Check: [SECURE_SETUP.md - Troubleshooting](SECURE_SETUP.md#-troubleshooting)

### General Questions
- Read: [SECURITY_COMPARISON.md](SECURITY_COMPARISON.md)
- Check: [Supabase Discord](https://discord.supabase.com)

---

## 🎯 What You Get (Both Approaches)

✅ Full-screen registration gate
✅ 6-field lead capture form
✅ Supabase database storage
✅ Automatic HubSpot CRM sync
✅ Duplicate email handling
✅ Returning user detection
✅ Professional UI/UX
✅ Mobile responsive
✅ Production-ready code

---

## 🚀 After Setup

Once working, consider:

1. **Deploy to production** (Vercel/Netlify/etc.)
2. **Add custom domain**
3. **Set up monitoring** (Supabase logs)
4. **Add analytics** (Google Analytics/Plausible)
5. **Customize styling** (colors, fonts, etc.)
6. **Add CAPTCHA** (prevent spam)
7. **Email verification** (Supabase Auth)

---

## 📚 All Documentation

- **[README.md](README.md)** - Project overview
- **[QUICKSTART.md](QUICKSTART.md)** - This file (choose your path)
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Standard setup (30 min)
- **[SECURE_SETUP.md](SECURE_SETUP.md)** - Max security setup (35 min)
- **[SECURITY_COMPARISON.md](SECURITY_COMPARISON.md)** - Compare approaches
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Database details

---

**Ready?** Pick your path and let's build! 🎉

**Standard:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
**Max Security:** [SECURE_SETUP.md](SECURE_SETUP.md)
