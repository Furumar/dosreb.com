# Supabase CLI Installation Guide

## Current Status

❌ **Supabase CLI is NOT currently installed on this system.**

✅ **You NEED Supabase CLI** for this project to:
- Run database migrations (see `db/migrations/`)
- Manage your dosreb.com database as an admin
- Execute administrative tasks on your Supabase project

## What is installed

✅ **Supabase JavaScript Client** (`@supabase/supabase-js`)
- Installed as a dependency in `package.json`
- Used for client-side database operations
- Handles frontend interactions with Supabase

## Why You Need Supabase CLI

Based on your project structure (`db/` directory with migrations), you need the Supabase CLI to:
- **Run database migrations** from `db/migrations/001_init.sql`
- **Manage your Supabase project** from the command line
- **Execute SQL commands** against your production database
- **Make administrative changes** to dosreb.com online

The JavaScript client library alone is not sufficient for these admin tasks.

## How to Install Supabase CLI

### Recommended: Install as Project Dependency

For consistent team usage and to work with your database migrations:

```bash
npm install --save-dev supabase
```

Then add to your `package.json` scripts:
```json
{
  "scripts": {
    "supabase": "supabase",
    "db:migrate": "supabase db push"
  }
}
```

After installation, you can use:
```bash
npm run supabase -- login
npm run supabase -- link --project-ref <your-project-ref>
npm run db:migrate
```

### Alternative: Global Installation

#### Option 1: Using npm (globally)
```bash
npm install -g supabase
```

#### Option 2: Using Homebrew (macOS/Linux)
```bash
brew install supabase/tap/supabase
```

#### Option 3: Using Scoop (Windows)
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

## Getting Started with Your Project

After installing, follow these steps to work with your dosreb.com database:

### 1. Verify Installation
```bash
supabase --version
# or if installed as dev dependency:
npm run supabase -- --version
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link to Your Project
```bash
supabase link --project-ref <your-project-ref>
```

You can find your project ref in your Supabase dashboard URL:
`https://app.supabase.com/project/<your-project-ref>`

### 4. Run Database Migrations

To apply the migrations in `db/migrations/` to your online database:

```bash
supabase db push
```

Or to run a specific migration file:
```bash
supabase db query < db/migrations/001_init.sql
```

**Important**: As noted in `db/README.md`, use a service role/privileged key for schema changes. Do NOT run migrations from the browser or with an anon/public key.

### 5. Other Admin Tasks

Execute SQL queries:
```bash
supabase db query "SELECT * FROM projects LIMIT 10"
```

Generate TypeScript types from your database:
```bash
supabase gen types typescript --linked > lib/database.types.ts
```

## Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase CLI GitHub](https://github.com/supabase/cli)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)
