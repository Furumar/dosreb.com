# Superuser Setup Instructions

## What Was Done
✅ Created migration `002_add_user_profiles.sql` that:
- Adds `user_profiles` table with role management
- Configures `marco.furu@gmail.com` as superuser
- Grants superusers full access to all projects, files, and comments
- Auto-creates profiles for new users on signup

✅ Committed and pushed to GitHub (will auto-deploy to Vercel)

## Next Steps - Run the Migration

You need to run the migration on your Supabase database. Choose one option:

### Option 1: Using Supabase CLI (Recommended)
```bash
# Make sure you're logged in
supabase login

# Link to your project (if not already linked)
supabase link --project-ref <your-project-ref>

# Run both migrations in order
supabase db query < db/migrations/001_init.sql
supabase db query < db/migrations/002_add_user_profiles.sql
```

### Option 2: Using Supabase Dashboard
1. Go to https://app.supabase.com/project/YOUR_PROJECT/sql/new
2. Copy the entire content of `db/migrations/002_add_user_profiles.sql`
3. Paste and click "Run"

### Option 3: Using the migration script
```bash
# From the project root
cd /workspaces/dosreb.com
./db/run_migrations.sh
```

## Important Notes
- The migration will only set marco.furu@gmail.com as superuser if that user already exists in `auth.users`
- If the user doesn't exist yet, the profile will be created on first login (but won't be superuser by default)
- After first login, you can manually update the profile to superuser in Supabase dashboard:
  ```sql
  UPDATE user_profiles 
  SET role = 'superuser', is_superuser = true 
  WHERE email = 'marco.furu@gmail.com';
  ```

## Verification
After running the migration, verify in Supabase SQL Editor:
```sql
SELECT * FROM user_profiles WHERE email = 'marco.furu@gmail.com';
```

You should see `role = 'superuser'` and `is_superuser = true`.
