import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getFileUrl(storagePath: string) {
  // Get public URL (since bucket is now public)
  const { data: publicData } = supabase.storage
    .from('projects')
    .getPublicUrl(storagePath);

  if (publicData?.publicUrl) {
    return publicData.publicUrl;
  }

  return null;
}

async function testFileRetrieval() {
  console.log('🧪 Testing file retrieval for Stockmann project...\n');

  const { data: files, error } = await supabase.storage
    .from('projects')
    .list('stockmann/photos', {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    });

  if (error) {
    console.error('❌ Error listing files:', error);
    return;
  }

  console.log(`✅ Found ${files?.length || 0} files\n`);

  if (files && files.length > 0) {
    for (const file of files) {
      const path = `stockmann/photos/${file.name}`;
      const url = await getFileUrl(path);
      console.log(`📸 ${file.name}`);
      console.log(`   URL: ${url}\n`);
    }
  }

  console.log('\n✅ File retrieval test complete');
  console.log('   URLs should be publicly accessible');
}

testFileRetrieval();
