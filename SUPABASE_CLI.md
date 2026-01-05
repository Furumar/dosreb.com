# Supabase CLI Installation Status

## Current Status

❌ **Supabase CLI is NOT currently installed in this repository.**

## What is installed

✅ **Supabase JavaScript Client** (`@supabase/supabase-js`)
- This is installed as a dependency in `package.json`
- Used for client-side database operations
- Sufficient for frontend/client interactions with Supabase

## Do you need the Supabase CLI?

The **Supabase CLI** is needed for:
- Local development with Supabase (running Supabase locally)
- Database migrations
- Generating TypeScript types from your database schema
- Managing Supabase projects from the command line
- Running database functions locally

If you only need to connect to a hosted Supabase instance from your Next.js application, the JavaScript client (`@supabase/supabase-js`) is sufficient.

## How to Install Supabase CLI

If you need the Supabase CLI, you can install it using one of these methods:

### Option 1: Using npm (globally)
```bash
npm install -g supabase
```

### Option 2: Using npm (as dev dependency)
```bash
npm install --save-dev supabase
```

Then add to `package.json` scripts:
```json
{
  "scripts": {
    "supabase": "supabase"
  }
}
```

### Option 3: Using Homebrew (macOS/Linux)
```bash
brew install supabase/tap/supabase
```

### Option 4: Using Scoop (Windows)
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

## Verify Installation

After installing, verify with:
```bash
supabase --version
```

## Initialize Supabase in Project

Once installed, you can initialize Supabase in your project:
```bash
supabase init
```

This will create a `supabase/` directory with configuration files.

## Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase CLI GitHub](https://github.com/supabase/cli)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)
