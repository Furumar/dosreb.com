DB migrations and setup
=======================

This folder contains SQL migrations and helper scripts to create the initial schema
used by the Projects MVP (tables: `projects`, `files`, `comments`, `invites`, `templates`).

Quick notes
- The migrations use `gen_random_uuid()`; the `pgcrypto` extension is enabled in the migration.
- Row Level Security (RLS) is enabled and basic owner-only policies are created. You should
  adapt policies to support collaborators (accepted invites) and your auth claims (email vs sub).
- Create a Supabase Storage bucket named `projects` after migrations are applied.

How to run

1) Using the Supabase CLI (recommended when working with Supabase projects):

   - Install: https://supabase.com/docs/guides/cli
   - Login: `supabase login`
   - Link to your project: `supabase link --project-ref <project-ref>`
   - Run SQL directly: `supabase db query < db/migrations/001_init.sql`

2) Using psql (requires a DB connection string with a privileged role):

   - Export connection vars (example):

     PGHOST=your-db-host
     PGPORT=5432
     PGUSER=postgres
     PGPASSWORD=super_secret_service_role_key
     PGDATABASE=postgres

   - Run:

     psql "$PGDATABASE" -f db/migrations/001_init.sql

Important: use a service role / privileged key for schema changes. Do NOT run migrations from
the browser or with an anon/public key.

Migrations
----------
1. `001_init.sql` - Initial schema (projects, files, comments, invites, templates)
2. `002_add_user_profiles.sql` - User profiles with role management and superuser support
   - Adds `user_profiles` table with role management (user/admin/superuser)
   - Creates marco.furu@gmail.com as superuser
   - Grants superusers full access to all projects, files, and comments
   - Auto-creates profiles for new users via trigger

Next steps
- Create the `projects` storage bucket in Supabase Storage.
- Run both migrations in order: `001_init.sql` then `002_add_user_profiles.sql`
- Create additional migration files for indexes, materialized views, or schema changes.
- Add CI steps to run migrations on deploy using a secure service key if desired.
