// Database operations for files
import { createClient } from '@supabase/supabase-js';

// Use service role key for file operations (server-side only)
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

export interface FileRecord {
  id: string;
  project_id: string;
  uploaded_by?: string;
  filename: string;
  storage_path: string;
  mime_type: string;
  size: number;
  metadata: {
    folder?: string;
    width?: number;
    height?: number;
    thumbnail_path?: string;
  };
  created_at: string;
}

export interface CreateFileInput {
  project_id: string;
  uploaded_by?: string;
  filename: string;
  storage_path: string;
  mime_type: string;
  size: number;
  metadata?: Record<string, any>;
}

/**
 * Create a file record after upload
 */
export async function createFileRecord(input: CreateFileInput) {
  if (!supabase) throw new Error('Supabase not initialized');

  const insertData: any = {
    project_id: input.project_id,
    uploaded_by: input.uploaded_by || null,
    filename: input.filename,
    storage_path: input.storage_path,
    mime_type: input.mime_type,
    size: input.size,
  };

  // Only include metadata if provided
  if (input.metadata) {
    insertData.metadata = input.metadata;
  }

  const { data, error } = await supabase
    .from('files')
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;

  return data as FileRecord;
}

/**
 * Get files for a project
 */
export async function getProjectFiles(projectId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as FileRecord[];
}

/**
 * Get a single file by ID
 */
export async function getFile(fileId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', fileId)
    .single();

  if (error) throw error;

  return data as FileRecord;
}

/**
 * Delete a file record
 */
export async function deleteFileRecord(fileId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { error } = await supabase
    .from('files')
    .delete()
    .eq('id', fileId);

  if (error) throw error;
}

/**
 * Get files by folder type
 */
export async function getFilesByFolder(projectId: string, folder: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('project_id', projectId)
    .contains('metadata', { folder })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as FileRecord[];
}
