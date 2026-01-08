-- Add missing columns to real_estates table if they don't exist

-- Add location column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='real_estates' AND column_name='location') THEN
        ALTER TABLE real_estates ADD COLUMN location TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- Add size column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='real_estates' AND column_name='size') THEN
        ALTER TABLE real_estates ADD COLUMN size TEXT;
    END IF;
END $$;

-- Add price column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='real_estates' AND column_name='price') THEN
        ALTER TABLE real_estates ADD COLUMN price TEXT;
    END IF;
END $$;

-- Add status column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='real_estates' AND column_name='status') THEN
        ALTER TABLE real_estates ADD COLUMN status TEXT DEFAULT 'available';
    END IF;
END $$;

-- Update RLS policies if needed
DROP POLICY IF EXISTS "Allow public read" ON real_estates;
DROP POLICY IF EXISTS "Allow all operations" ON real_estates;

CREATE POLICY "Allow public read" ON real_estates FOR SELECT USING (true);
CREATE POLICY "Allow all operations" ON real_estates FOR ALL USING (true);
