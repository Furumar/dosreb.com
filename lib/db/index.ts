import { createClient } from '@supabase/supabase-js'
import {
  DesignGroup,
  DesignSubgroup,
  DesignItem,
  ProjectDesignGroup
} from '../supabase/types'

// Supabase client
export const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Query: Get all design groups
export async function getDesignGroups(): Promise<DesignGroup[]> {
  const { data, error } = await db
    .from('design_groups')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}

// Query: Get subgroups by group ID
export async function getSubgroupsByGroup(groupId: string): Promise<DesignSubgroup[]> {
  const { data, error } = await db
    .from('design_subgroups')
    .select('*')
    .eq('group_id', groupId)
    .order('name')

  if (error) throw error
  return data
}

// Query: Get items by subgroup ID
export async function getItemsBySubgroup(subgroupId: string): Promise<DesignItem[]> {
  const { data, error } = await db
    .from('design_items')
    .select('*')
    .eq('subgroup_id', subgroupId)
    .order('name')

  if (error) throw error
  return data
}
