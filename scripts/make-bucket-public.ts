import { createClient } from '@supabase/supabase-js';
makeBucketPublic();
import { db } from '../lib/db'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function makeBucketPublic() {
  console.log('🔧 Making "projects" bucket public...\n');

  try {
    const { data, error } = await db.storage.updateBucket('projects', {
      public: true,
    });

    if (error) {
      throw error;
    }

    console.log('✅ Successfully made "projects" bucket public');
    console.log('   Images will now be accessible via public URLs');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

makeBucketPublic();
