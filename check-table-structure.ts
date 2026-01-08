import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTable() {
  console.log('Checking real_estates table structure...\n');

  const { data, error } = await supabase
    .from('real_estates')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sample data (if any):', data);
    if (data && data.length > 0) {
      console.log('\nColumns:', Object.keys(data[0]));
    } else {
      console.log('Table exists but is empty. Trying to get columns via insert test...');
    }
  }
}

checkTable();
