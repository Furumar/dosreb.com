import { createClient } from '@supabase/supabase-js'
import {
  DesignGroup,
  DesignSubgroup,
  DesignItem,
  ProjectDesignGroup
} from '../supabase/types'

// 1. Supabase client
export const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 2. Query: Get all design groups
export async function getDesignGroups(): Promise<DesignGroup[]> {
  const { data, error } = await db
    .from('design_groups')
    .select('*')
    .order('name')

  if (error) throw error
  return data ?? []
}

// 3. Query: Get subgroups by group ID
export async function getSubgroupsByGroup(groupId: string): Promise<DesignSubgroup[]> {
  const { data, error } = await db
    .from('design_subgroups')
    .select('*')
    .eq('group_id', groupId)
    .order('name')

  if (error) throw error
  return data ?? []
}

// 4. Query: Get items by subgroup ID
export async function getItemsBySubgroup(subgroupId: string): Promise<DesignItem[]> {
  const { data, error } = await db
    .from('design_items')
    .select('*')
    .eq('subgroup_id', subgroupId)
    .order('name')

  if (error) throw error
  return data ?? []
}

// 5. Link a design group to a project
export async function addDesignGroupToProject(projectId: string, groupId: string): Promise<ProjectDesignGroup[]> {
  const { data, error } = await db
    .from('project_design_groups')
    .insert([{ project_id: projectId, design_group_id: groupId }])
    .select()

  if (error) throw error
  return data ?? []
}

// 6. Remove a design group from a project
export async function removeDesignGroupFromProject(projectId: string, groupId: string): Promise<ProjectDesignGroup[]> {
  const { data, error } = await db
    .from('project_design_groups')
    .delete()
    .match({ project_id: projectId, design_group_id: groupId })
    .select()

  if (error) throw error
  return data ?? []
}