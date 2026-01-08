import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { error: 'File path required' },
        { status: 400 }
      );
    }

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from('projects')
      .remove([path]);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${path}`
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to delete file', details: errorMessage },
      { status: 500 }
    );
  }
}
