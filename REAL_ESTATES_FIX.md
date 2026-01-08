# Real Estates Table Setup Issue - COMPLETE FIX

## Problem
The `real_estates` table has a `created_by` column with a NOT NULL constraint that's causing inserts to fail.

## Complete Solution
Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor):

```sql
-- Fix 1: Make created_by and updated_by nullable
ALTER TABLE real_estates ALTER COLUMN created_by DROP NOT NULL;

-- Fix 2: Also fix updated_by if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='real_estates' AND column_name='updated_by') THEN
        ALTER TABLE real_estates ALTER COLUMN updated_by DROP NOT NULL;
    END IF;
END $$;

-- Fix 3: Add missing columns if needed
ALTER TABLE real_estates ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE real_estates ADD COLUMN IF NOT EXISTS size TEXT;
ALTER TABLE real_estates ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE real_estates ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';
```

After running this, try creating the real estate again in the admin panel.

## Alternative: Start Fresh
If you want to completely recreate the table with the correct schema:

```sql
DROP TABLE IF EXISTS real_estates CASCADE;

CREATE TABLE real_estates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
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
