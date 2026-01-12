// Run database migration using Supabase service role
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  const migrationPath = path.join(__dirname, '../db/migrations/001_init.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log('Running migration: 001_init.sql');
  
  const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });
  
  if (error) {
    console.error('Migration failed:', error);
    
    // Try alternative approach - split into statements
    console.log('\nTrying statement-by-statement execution...');
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 50) + '...');
      const { error: err } = await supabase.rpc('exec_sql', { sql_string: statement });
      if (err) {
        console.error('Statement failed:', err.message);
      }
    }
    
    process.exit(1);
  }

  console.log('Migration completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Go to your Supabase dashboard > Storage');
  console.log('2. Create a new bucket named "projects"');
  console.log('3. Set appropriate access policies for the bucket');
}

runMigration();
