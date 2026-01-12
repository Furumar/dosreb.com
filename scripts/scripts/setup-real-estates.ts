import { createClient } from '@supabase/supabase-js';
setupRealEstates();
import { db } from '../../lib/db'
import { createClient } from '@supabase/supabase-js';
setupRealEstates();
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupRealEstates() {
  console.log('🔧 Setting up real_estates table...\n');

  try {
    // Test if table exists by trying to select from it
    const { data, error } = await db
      .from('real_estates')
      .select('id')
      .limit(1);

    if (!error) {
      console.log('✅ real_estates table already exists!');
      console.log('   Table is ready to use');
      return;
    }

    console.log('❌ real_estates table does not exist');
    console.log('\n📝 Please create the table manually in Supabase Dashboard:');
    console.log('\n1. Go to: https://supabase.com/dashboard');
    console.log('2. Navigate to: SQL Editor');
    console.log('3. Run this SQL:\n');
    console.log(`
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

-- Enable RLS
ALTER TABLE real_estates ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read" ON real_estates FOR SELECT USING (true);

-- Allow all operations (for now - restrict later in production)
CREATE POLICY "Allow all operations" ON real_estates FOR ALL USING (true);
    `);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setupRealEstates();
