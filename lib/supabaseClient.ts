import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;
if (url && anon) {
  supabase = createClient(url, anon, {
    auth: {
      persistSession: false,
    },
  });
}

export default supabase;
