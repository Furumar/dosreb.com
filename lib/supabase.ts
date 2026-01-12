import { db } from '../../../lib/db'
import { createClient } from '@supabase/supabase-js'
export async function getProjects(userId: string) {
  const { data, error } = await db
    .from('projects')
    .select(`
      id,
      name,
      description,
      created_at,
      design_groups:project_design_groups (
        id,
        project_id,
        design_group_id,
        created_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading projects:', error)
    throw error
  }

  return data
}
