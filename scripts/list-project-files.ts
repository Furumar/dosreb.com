import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listFiles() {
  const projects = ['stockmann', 'dbschenker', 'jatkasaari'];
  
  for (const project of projects) {
    console.log(`\n📁 ${project}/photos:`);
    
    const { data: files, error } = await supabase.storage
      .from('projects')
      .list(`${project}/photos`, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
      continue;
    }

    if (!files || files.length === 0) {
      console.log('   (no files)');
    } else {
      files.forEach(file => {
        console.log(`   - ${file.name} (${(file.metadata.size / 1024).toFixed(2)} KB)`);
      });
    }
  }
}

listFiles();
