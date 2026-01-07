import { NextRequest, NextResponse } from 'next/server';
import { createProject, getProjects, getProject, updateProject, deleteProject } from '@/lib/supabase/projects';

// Mock user ID - replace with actual auth when implemented
// Using your actual Supabase user ID: marco.furu@gmail.com
const MOCK_USER_ID = '7464a392-d86e-4708-87cb-6e9780bb8ef6';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (projectId) {
      const project = await getProject(projectId);
      return NextResponse.json(project);
    }

    const projects = await getProjects(MOCK_USER_ID);
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = await createProject(body, MOCK_USER_ID);
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project', details: error?.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const project = await updateProject(projectId, body);
    return NextResponse.json(project);
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project', details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      );
    }

    await deleteProject(projectId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project', details: error?.message },
      { status: 500 }
    );
  }
}
