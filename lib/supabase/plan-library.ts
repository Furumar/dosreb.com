import { createClient } from '@supabase/supabase-js';

import { db } from '../../lib/db'

import { createClient } from '@supabase/supabase-js';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables for plan library');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export interface PlanLibraryItem {
  id: string;
  owner: string;
  title: string;
  description?: string;
  category_id?: string;
  storage_path: string;
  filename: string;
  mime_type?: string;
  size?: number;
  tags?: string[];
  visibility: 'private' | 'public' | 'organization';
  metadata?: any;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface PlanCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

// Get all categories
export async function getCategories(): Promise<PlanCategory[]> {
  const { data, error } = await db
    .from('plan_categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

// Get plans from library (with filters)
export async function getPlans(filters?: {
  categoryId?: string;
  visibility?: string;
  search?: string;
  tags?: string[];
  userId?: string;
}): Promise<PlanLibraryItem[]> {
  let query = supabase
    .from('plan_library')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters?.visibility) {
    query = query.eq('visibility', filters.visibility);
  } else {
    // Default: show public plans and user's own plans
    if (filters?.userId) {
      query = query.or(`visibility.eq.public,owner.eq.${filters.userId}`);
    } else {
      query = query.eq('visibility', 'public');
    }
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

// Get a single plan
export async function getPlan(planId: string): Promise<PlanLibraryItem> {
  const { data, error } = await db
    .from('plan_library')
    .select('*')
    .eq('id', planId)
    .single();

  if (error) throw error;
  return data;
}

// Create a new plan in library
export async function createPlan(
  planData: Partial<PlanLibraryItem>,
  userId: string
): Promise<PlanLibraryItem> {
  const { data, error } = await db
    .from('plan_library')
    .insert({
      ...planData,
      owner: userId,
      usage_count: 0
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update a plan
export async function updatePlan(
  planId: string,
  planData: Partial<PlanLibraryItem>
): Promise<PlanLibraryItem> {
  const { data, error } = await db
    .from('plan_library')
    .update(planData)
    .eq('id', planId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a plan
export async function deletePlan(planId: string): Promise<void> {
  const { error } = await supabase
    .from('plan_library')
    .delete()
    .eq('id', planId);

  if (error) throw error;
}

// Link a plan to a project
export async function linkPlanToProject(
  projectId: string,
  planId: string,
  userId: string,
  notes?: string
): Promise<void> {
  const { error } = await supabase
    .from('project_plans')
    .insert({
      project_id: projectId,
      plan_id: planId,
      added_by: userId,
      notes
    });

  if (error) throw error;
}

// Get plans linked to a project
export async function getProjectPlans(projectId: string): Promise<any[]> {
  const { data, error } = await db
    .from('project_plans')
    .select(`
      *,
      plan:plan_library (*)
    `)
    .eq('project_id', projectId);

  if (error) throw error;
  return data || [];
}

// Remove plan link from project
export async function unlinkPlanFromProject(
  projectId: string,
  planId: string
): Promise<void> {
  const { error } = await supabase
    .from('project_plans')
    .delete()
    .eq('project_id', projectId)
    .eq('plan_id', planId);

  if (error) throw error;
}

// Get user's favorites
export async function getFavorites(userId: string): Promise<PlanLibraryItem[]> {
  const { data, error } = await db
    .from('plan_favorites')
    .select(`
      *,
      plan:plan_library (*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data?.map((item: any) => item.plan) || [];
}

// Add to favorites
export async function addToFavorites(userId: string, planId: string): Promise<void> {
  const { error } = await supabase
    .from('plan_favorites')
    .insert({
      user_id: userId,
      plan_id: planId
    });

  if (error) throw error;
}

// Remove from favorites
export async function removeFromFavorites(userId: string, planId: string): Promise<void> {
  const { error } = await supabase
    .from('plan_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('plan_id', planId);

  if (error) throw error;
}

// Get most used plans
export async function getMostUsedPlans(limit: number = 10): Promise<PlanLibraryItem[]> {
  const { data, error } = await db
    .from('plan_library')
    .select('*')
    .eq('visibility', 'public')
    .order('usage_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Search plans with full-text search
export async function searchPlans(searchTerm: string): Promise<PlanLibraryItem[]> {
  const { data, error } = await db
    .from('plan_library')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .limit(50);

  if (error) throw error;
  return data || [];
}
