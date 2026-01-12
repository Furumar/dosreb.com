import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testCreate() {
  const body = {
    title: 'Single home family Myyryläinen Jari and Sari',
    description: 'Upper middle class single home, near downtown Hyvinkää',
    location: 'Palmunkatu 4b, 05600 Hyvinkää FINLAND',
    size: '160 m2',
    price: '1,000,000.00',
    status: 'sold'
  };

  console.log('Attempting to create with data:', body);

  const { data, error } = await db
    .from('real_estates')
    .insert([body])
    .select()
    .single();

  if (error) {
    console.error('\n❌ Error:', JSON.stringify(error, null, 2));
  } else {
    console.log('\n✅ Success!', data);
  }
}

testCreate();
