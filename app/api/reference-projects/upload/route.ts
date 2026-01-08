import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const project = formData.get('project') as string;
    const folder = formData.get('folder') as string || 'photos';

    if (!file || !project) {
      return NextResponse.json(
        { error: 'File and project name required' },
        { status: 400 }
      );
    }

    // Validate project name
    const validProjects = ['stockmann', 'dbschenker', 'jatkasaari'];
    if (!validProjects.includes(project)) {
      return NextResponse.json(
        { error: 'Invalid project name' },
        { status: 400 }
      );
    }

    // Create storage path
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${project}/${folder}/${timestamp}_${sanitizedName}`;

    // Convert File to ArrayBuffer then to Buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('projects')
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      
      // Check if error is due to bucket not existing
      if (error.message.includes('not found') || error.message.includes('Bucket')) {
        return NextResponse.json(
          { 
            error: 'Storage bucket not configured', 
            details: 'The "projects" storage bucket does not exist. Please create it in Supabase Dashboard.',
            setupInstructions: 'Go to Supabase Dashboard > Storage > Create a new bucket named "projects" with public access enabled.'
          },
          { status: 500 }
        );
      }
      
      throw error;
    }

    return NextResponse.json({
      success: true,
      path: data.path,
      message: `Uploaded ${file.name} to ${project}`
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to upload file', details: errorMessage },
      { status: 500 }
    );
  }
}
