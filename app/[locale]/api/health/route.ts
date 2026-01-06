import { NextResponse } from 'next/server';

export async function GET() {
  const groqKey = process.env.GROQ_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    groqKey: groqKey ? `SET (${groqKey.substring(0, 10)}...)` : 'MISSING ✗',
    groqKeyLength: groqKey?.length || 0,
    supabaseUrl: supabaseUrl ? 'SET ✓' : 'MISSING ✗',
    supabaseKey: supabaseKey ? `SET (${supabaseKey.substring(0, 20)}...)` : 'MISSING ✗',
    supabaseKeyLength: supabaseKey?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
}
import { NextResponse } from 'next/server';

export async function GET() {
  const groqKey = process.env.GROQ_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return NextResponse.json({
    groqKey: groqKey ? `SET (${groqKey.substring(0, 10)}...)` : 'MISSING ✗',
    groqKeyLength: groqKey?.length || 0,
    supabaseUrl: supabaseUrl ? 'SET ✓' : 'MISSING ✗',
    supabaseKey: supabaseKey ? `SET (${supabaseKey.substring(0, 20)}...)` : 'MISSING ✗',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
}
