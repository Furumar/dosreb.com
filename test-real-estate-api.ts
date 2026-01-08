import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testCreate() {
  console.log('Testing real estate creation...\n');

  const testData = {
    title: 'Test Property',
    description: 'Test description',
    location: 'Test Location',
    size: '100',
    price: '100000',
    status: 'available'
  };

  console.log('Data to insert:', testData);

  const { data, error } = await supabase
    .from('real_estates')
    .insert([testData])
    .select()
    .single();

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Success!', data);
  }
}

testCreate();
