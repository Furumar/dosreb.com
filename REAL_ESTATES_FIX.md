# Real Estates Table Setup Issue - SOLVED

## Problem
The `real_estates` table exists but is missing required columns (location, size, price, status).

## Solution
Run this SQL in your Supabase SQL Editor:

```sql
-- Add missing columns to real_estates table
ALTER TABLE real_estates ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT '';
ALTER TABLE real_estates ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE real_estates ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE real_estates ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';

-- Update RLS policies
DROP POLICY IF EXISTS "Allow public read" ON real_estates;
DROP POLICY IF EXISTS "Allow all operations" ON real_estates;

CREATE POLICY "Allow public read" ON real_estates FOR SELECT USING (true);
CREATE POLICY "Allow all operations" ON real_estates FOR ALL USING (true);
```

## How to run:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Paste the SQL above
5. Click "Run"

## Alternative: Drop and recreate table
If the above doesn't work, you can drop and recreate:

```sql
DROP TABLE IF EXISTS real_estates CASCADE;

CREATE TABLE real_estates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  size TEXT,
  price TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE real_estates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON real_estates FOR SELECT USING (true);
CREATE POLICY "Allow all operations" ON real_estates FOR ALL USING (true);
```
