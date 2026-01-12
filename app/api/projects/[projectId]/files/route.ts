import { NextRequest, NextResponse } from 'next/server';
import { getProjectFiles } from '../../../../lib/supabase/files';

// GET /api/projects/[projectId]/files
export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const { projectId } = params;
    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }
    const files = await getProjectFiles(projectId);
    return NextResponse.json(files);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
