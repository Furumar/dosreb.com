import { db } from './index'
import {
  DesignGroup,
  DesignSubgroup,
  DesignItem,
  ProjectDesignGroup
} from '../supabase/types'

// Query: Get all design groups
export async function getDesignGroups(): Promise<DesignGroup[]> {
  const { data, error } = await db
    .from('design_groups')
    .select('*')
    .order('name')

  if (error) throw error
  return data ?? []
}