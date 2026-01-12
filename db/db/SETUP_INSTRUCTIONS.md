# Database Setup Guide

## Quick Setup (Recommended)

The easiest way to set up your database is through the **Supabase Dashboard**:

### Step 1: Open SQL Editor

Go to your Supabase project's SQL Editor:
```
https://app.supabase.com/project/YOUR_PROJECT_REF/sql
```

### Step 2: Run Migrations in Order

Copy and paste each migration file into the SQL Editor and click "Run":

1. **001_init.sql** - Core tables (projects, files, comments)
2. **002_add_user_profiles.sql** - User profiles and superuser support  
3. **003_plan_library.sql** - Plan Library feature (NEW! ✨)

### Step 3: Create Storage Buckets

Go to **Storage** in your Supabase dashboard and create two buckets:

1. **projects** - For project files
2. **plan-library** - For shared plan assets

Set bucket policies to allow authenticated users to upload/read.

### Step 4: Verify Setup

Run this command to test your database:
```bash
curl -s "https://your-project.supabase.co/rest/v1/projects" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

Should return `[]` (empty array) - this means it's working!

---

## Alternative: Using psql

If you have PostgreSQL client installed:

```bash
cd /workspaces/dosreb.com
./db/setup-database.sh
```

---

## Alternative: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db query < db/migrations/001_init.sql
supabase db query < db/migrations/002_add_user_profiles.sql
supabase db query < db/migrations/003_plan_library.sql
```

---

## What Each Migration Does

### 001_init.sql
Creates core tables:
- **projects** - Store project information
- **files** - File uploads for projects
- **comments** - Comments and annotations
- **invites** - Collaboration invites
- **templates** - Reusable project templates

### 002_add_user_profiles.sql
Adds user management:
- **user_profiles** - User profiles with roles (user/admin/superuser)
- Sets up marco.furu@gmail.com as superuser
- Adds RLS policies for role-based access

### 003_plan_library.sql (NEW! ✨)
Implements Lumi's Plan Library feature:
- **plan_categories** - Organize plans (floor plans, sections, facades, etc.)
- **plan_library** - Store and share design assets
- **project_plans** - Link plans to projects
- **plan_favorites** - Bookmark favorite plans
- **plan_versions** - Track plan updates
- Full-text search on plan titles and descriptions
- Usage tracking to see popular plans

---

## Troubleshooting

### "Could not find the 'title' column"
→ Migrations haven't been run yet. Run migrations in the SQL Editor.

### "relation 'projects' does not exist"
→ Same as above - run 001_init.sql first.

### Storage upload fails
→ Create the storage buckets in Supabase Dashboard → Storage.

### Permission denied
→ Make sure you're using SUPABASE_SERVICE_ROLE_KEY for migrations, not the anon key.

---

## Next Steps After Setup

1. ✅ Verify all tables exist in Supabase Dashboard → Table Editor
2. ✅ Create storage buckets
3. ✅ Test creating a project on your site
4. ✅ Upload a plan to the Plan Library
5. ✅ Link plans to projects

---

## Plan Library Usage

Once set up, users can:

1. **Upload Plans** - Share floor plans, sections, facades
2. **Search & Browse** - Find plans by category, tags, or search
3. **Add to Projects** - Link existing plans to new projects
4. **Version Control** - Track updates to plans over time
5. **Favorites** - Bookmark frequently used plans
6. **Usage Analytics** - See which plans are most popular

This dramatically speeds up project setup by reusing existing design assets! 🚀
