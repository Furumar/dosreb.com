// Database operations for projects
import { createClient } from '@supabase/supabase-js';

// Use service role key for project operations (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export interface Project {
  id: string;
  owner: string;
  title: string;
  description?: string;
  visibility: 'private' | 'public' | 'unlisted';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  visibility?: 'private' | 'public' | 'unlisted';
  metadata?: Record<string, any>;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  visibility?: 'private' | 'public' | 'unlisted';
  metadata?: Record<string, any>;
}

/**
 * Create a new project
 */
export async function createProject(input: CreateProjectInput, userId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const insertData: any = {
    owner: userId,
    title: input.title,
    description: input.description || null,
    visibility: input.visibility || 'private',
  };

  // Only include metadata if provided
  if (input.metadata) {
    insertData.metadata = input.metadata;
  }

  const { data, error } = await db
    .from('projects')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;

  return data as Project;
}

/**
 * Get projects for a user
 */
export async function getProjects(userId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('owner', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return data as Project[];
}

/**
 * Get a single project by ID
 */
export async function getProject(projectId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) throw error;

  return data as Project;
}

/**
 * Update a project
 */
export async function updateProject(projectId: string, input: UpdateProjectInput) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await db
    .from('projects')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;

  return data as Project;
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
}

/**
 * Search projects
 */
export async function searchProjects(query: string, userId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('owner', userId)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return data as Project[];
}
