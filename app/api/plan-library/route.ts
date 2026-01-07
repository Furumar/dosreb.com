import { NextRequest, NextResponse } from 'next/server';
import {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  getCategories,
  linkPlanToProject,
  getProjectPlans,
  unlinkPlanFromProject,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getMostUsedPlans,
  searchPlans
} from '@/lib/supabase/plan-library';

// Mock user ID - replace with actual auth when implemented
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const planId = searchParams.get('id');
    const projectId = searchParams.get('projectId');
    const categoryId = searchParams.get('categoryId');
    const visibility = searchParams.get('visibility');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    // Get categories
    if (action === 'categories') {
      const categories = await getCategories();
      return NextResponse.json(categories);
    }

    // Get project plans
    if (action === 'project-plans' && projectId) {
      const plans = await getProjectPlans(projectId);
      return NextResponse.json(plans);
    }

    // Get favorites
    if (action === 'favorites') {
      const favorites = await getFavorites(MOCK_USER_ID);
      return NextResponse.json(favorites);
    }

    // Get most used plans
    if (action === 'most-used') {
      const limit = parseInt(searchParams.get('limit') || '10');
      const plans = await getMostUsedPlans(limit);
      return NextResponse.json(plans);
    }

    // Search plans
    if (search) {
      const plans = await searchPlans(search);
      return NextResponse.json(plans);
    }

    // Get single plan
    if (planId) {
      const plan = await getPlan(planId);
      return NextResponse.json(plan);
    }

    // Get all plans with filters
    const plans = await getPlans({
      categoryId: categoryId || undefined,
      visibility: visibility || undefined,
      tags,
      userId: MOCK_USER_ID
    });

    return NextResponse.json(plans);
  } catch (error: any) {
    console.error('Error fetching plan library:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan library', details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();

    // Link plan to project
    if (action === 'link-to-project') {
      const { projectId, planId, notes } = body;
      await linkPlanToProject(projectId, planId, MOCK_USER_ID, notes);
      return NextResponse.json({ success: true });
    }

    // Add to favorites
    if (action === 'add-favorite') {
      const { planId } = body;
      await addToFavorites(MOCK_USER_ID, planId);
      return NextResponse.json({ success: true });
    }

    // Create new plan
    const plan = await createPlan(body, MOCK_USER_ID);
    return NextResponse.json(plan, { status: 201 });
  } catch (error: any) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan', details: error?.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('id');

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const plan = await updatePlan(planId, body);
    return NextResponse.json(plan);
  } catch (error: any) {
    console.error('Error updating plan:', error);
    return NextResponse.json(
      { error: 'Failed to update plan', details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const planId = searchParams.get('id');
    const projectId = searchParams.get('projectId');

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID required' },
        { status: 400 }
      );
    }

    // Unlink from project
    if (action === 'unlink' && projectId) {
      await unlinkPlanFromProject(projectId, planId);
      return NextResponse.json({ success: true });
    }

    // Remove from favorites
    if (action === 'remove-favorite') {
      await removeFromFavorites(MOCK_USER_ID, planId);
      return NextResponse.json({ success: true });
    }

    // Delete plan
    await deletePlan(planId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete plan', details: error?.message },
      { status: 500 }
    );
  }
}
