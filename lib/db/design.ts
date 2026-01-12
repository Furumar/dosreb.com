import { createClient } from '@supabase/supabase-js'

export const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
import {
  DesignGroup,
  DesignSubgroup,
  DesignItem,
  ProjectDesignGroup
} from '../supabase/types'

export async function getDesignGroups(): Promise<DesignGroup[]> {
  const { data, error } = await db
    .from('design_groups')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

export async function getSubgroupsByGroup(groupId: string): Promise<DesignSubgroup[]> {
  const { data, error } = await db
    .from('design_subgroups')
    .select('*')
    .eq('group_id', groupId)
    .order('name')

  if (error) throw error
  return data
}

export async function getItemsBySubgroup(subgroupId: string): Promise<DesignItem[]> {
  const { data, error } = await db
    .from('design_items')
    .select('*')
    .eq('subgroup_id', subgroupId)
    .order('name')

  if (error) throw error
  return data
}

export async function addDesignGroupToProject(
  projectId: string,
  groupId: string
): Promise<ProjectDesignGroup> {
  const { data, error } = await db
    .from('project_design_groups')
    .insert({
      project_id: projectId,
      design_group_id: groupId
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeDesignGroupFromProject(
  projectId: string,
  groupId: string
): Promise<void> {
  const { error } = await db
    .from('project_design_groups')
    .delete()
    .eq('project_id', projectId)
    .eq('design_group_id', groupId)

  if (error) throw error
}

export {}