import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, getFileUrl, deleteFile } from '@/lib/supabase/storage';
import { createFileRecord, getProjectFiles, deleteFileRecord } from '@/lib/supabase/files';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const folder = (formData.get('folder') as 'documents' | 'designs' | 'photos') || 'documents';

    if (!file || !projectId) {
      return NextResponse.json(
        { error: 'File and projectId required' },
        { status: 400 }
      );
    }

    // Upload file to storage
    const { path } = await uploadFile({ projectId, file, folder });

    // Get image dimensions if it's an image
    let width: number | undefined;
    let height: number | undefined;
    if (file.type.startsWith('image/')) {
      // Note: In production, you'd process this server-side or get from client
      width = 0;
      height = 0;
    }

    // Create file record in database
    const fileRecord = await createFileRecord({
      project_id: projectId,
      filename: file.name,
      storage_path: path,
      mime_type: file.type,
      size: file.size,
      metadata: {
        folder,
        width,
        height,
      },
    });

    return NextResponse.json(fileRecord, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to upload file', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const projectName = searchParams.get('project');
    const folder = searchParams.get('folder');
    const filePath = searchParams.get('filePath');

    if (filePath) {
      // Get signed URL for file
      const url = await getFileUrl(filePath);
      return NextResponse.json({ url });
    }

    if (projectName && folder) {
      // Get files from Supabase storage by project name
      // This is for static reference projects like stockmann, dbschenker, jatkasaari
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data: files, error } = await supabase.storage
        .from('projects')
        .list(`${projectName}/${folder}`);

      if (error) {
        console.error('Error listing files:', error);
        return NextResponse.json({ files: [] });
      }

      // Get signed URLs for all files
      const filesWithUrls = await Promise.all(
        (files || []).map(async (file) => {
          const path = `${projectName}/${folder}/${file.name}`;
          const url = await getFileUrl(path, 3600);
          return {
            name: file.name,
            url,
            path,
          };
        })
      );

      return NextResponse.json({ files: filesWithUrls });
    }

    if (projectId) {
      // Get all files for project
      const files = await getProjectFiles(projectId);
      return NextResponse.json(files);
    }

    return NextResponse.json(
      { error: 'projectId or filePath required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');
    const storagePath = searchParams.get('storagePath');

    if (!fileId || !storagePath) {
      return NextResponse.json(
        { error: 'id and storagePath required' },
        { status: 400 }
      );
    }

    // Delete from storage
    await deleteFile(storagePath);

    // Delete record from database
    await deleteFileRecord(fileId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
