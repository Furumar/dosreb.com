/**
import { db } from '../lib/db'
 * Setup script for Supabase Storage
 * Creates the 'projects' bucket if it doesn't exist
 * Run with: npx tsx scripts/setup-storage.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  console.error('\n💡 Make sure to source your .env.local file first:');
  console.error('   export $(cat .env.local | xargs)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function setupStorage() {
  console.log('🔧 Setting up Supabase Storage...\n');

  try {
    // Check if bucket exists
    console.log('📦 Checking for "projects" bucket...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw listError;
    }

    const projectsBucket = buckets?.find(b => b.name === 'projects');

    if (projectsBucket) {
      console.log('✅ "projects" bucket already exists');
      console.log(`   Public: ${projectsBucket.public}`);
      console.log(`   Created: ${projectsBucket.created_at}`);
    } else {
      console.log('📦 Creating "projects" bucket...');
      
      const { data, error } = await db.storage.createBucket('projects', {
        public: true, // Public bucket for easier access to project images
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'application/pdf',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          'text/plain',
          'text/csv',
        ],
      });

      if (error) {
        throw error;
      }

      console.log('✅ Successfully created "projects" bucket');
    }

    // Test upload
    console.log('\n🧪 Testing file upload...');
    const testData = Buffer.from('test-file-content');
    const testPath = `test/test-${Date.now()}.txt`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('projects')
      .upload(testPath, testData, {
        contentType: 'text/plain',
        cacheControl: '3600',
      });

    if (uploadError) {
      throw uploadError;
    }

    console.log('✅ Test upload successful');

    // Clean up test file
    const { error: deleteError } = await supabase.storage
      .from('projects')
      .remove([testPath]);

    if (!deleteError) {
      console.log('✅ Test file cleaned up');
    }

    // List existing project folders
    console.log('\n📁 Current project folders:');
    const { data: folders, error: foldersError } = await supabase.storage
      .from('projects')
      .list('', {
        limit: 100,
      });

    if (!foldersError && folders) {
      if (folders.length === 0) {
        console.log('   (none)');
      } else {
        folders.forEach(folder => {
          console.log(`   - ${folder.name}`);
        });
      }
    }

    console.log('\n✅ Storage setup complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Upload project photos via /projects/admin');
    console.log('   2. Check that images appear on project pages');
    console.log('   3. Verify public access to images is working');

  } catch (error) {
    console.error('\n❌ Error setting up storage:', error);
    process.exit(1);
  }
}

setupStorage();
