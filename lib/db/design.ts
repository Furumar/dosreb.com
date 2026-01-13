import { db } from './index';
import {
  DesignGroup,
  ProjectDesignGroup
} from '../supabase/types';

// ✅ Fetch all design groups
export async function getDesignGroup(): Promise<DesignGroup[]> {
  const { data, error } = await db
    .from('design_groups')
    .select('*')
    .order('name');

  if (error) throw error;
  return data ?? [];
}

// ✅ Link a design group to a project
export async function addDesignGroupToProject(
  projectId: string,
  groupId: string
): Promise<ProjectDesignGroup[]> {
  const { data, error } = await db
    .from('project_design_groups')
    .insert([{ project_id: projectId, design_group_id: groupId }])
    .select();

  if (error) throw error;
  return data ?? [];
}

// ✅ Remove a design group from a project
export async function removeDesignGroupFromProject(
  projectId: string,
  groupId: string
): Promise<ProjectDesignGroup[]> {
  const { data, error } = await db
    .from('project_design_groups')
    .delete()
    .match({ project_id: projectId, design_group_id: groupId })
    .select();

  if (error) throw error;
  return data ?? [];
}