import { createClient } from '@supabase/supabase-js';
import { db } from './lib/db'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixTable() {
  console.log('🔧 Fixing real_estates table schema...\n');
  
  console.log('Please run this SQL in your Supabase SQL Editor:');
  console.log('='.repeat(60));
  console.log(`
-- Make created_by nullable or add a default value
ALTER TABLE real_estates ALTER COLUMN created_by DROP NOT NULL;

-- Or if you want to keep NOT NULL but add a default
-- ALTER TABLE real_estates ALTER COLUMN created_by SET DEFAULT 'system';

-- Also make sure updated_by is nullable if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='real_estates' AND column_name='updated_by') THEN
        ALTER TABLE real_estates ALTER COLUMN updated_by DROP NOT NULL;
    END IF;
END $$;
  `);
  console.log('='.repeat(60));
}

fixTable();
