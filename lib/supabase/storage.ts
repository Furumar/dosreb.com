// Supabase Storage helpers for file uploads and management
import { createClient } from '@supabase/supabase-js';

// Use service role key for storage operations (server-side only)
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

export const STORAGE_BUCKET = 'projects';

export interface UploadOptions {
  projectId: string;
  file: File;
  folder?: 'documents' | 'designs' | 'photos';
}

export interface FileMetadata {
  id: string;
  project_id: string;
  filename: string;
  storage_path: string;
  mime_type: string;
  size: number;
  metadata: {
    folder?: string;
    width?: number;
    height?: number;
  };
  created_at: string;
}

/**
 * Initialize storage bucket (run once during setup)
 * You need to create this bucket in Supabase Dashboard with proper policies:
 * - bucket name: 'projects'
 * - public: false
 * - allowed mime types: image/*, application/pdf, application/vnd.*, etc.
 */
export async function initializeStorageBucket() {
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data, error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
    public: false,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: [
      'image/*',
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.*',
      'application/msword',
      'text/*',
    ],
  });
  
  if (error && !error.message.includes('already exists')) {
    throw error;
  }
  
  return data;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile({ projectId, file, folder = 'documents' }: UploadOptions) {
  if (!supabase) throw new Error('Supabase not initialized');

  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${projectId}/${folder}/${timestamp}_${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  return {
    path: data.path,
    fullPath: data.fullPath,
  };
}

/**
 * Get a signed URL for downloading a file
 */
export async function getFileUrl(storagePath: string, expiresIn = 3600) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, expiresIn);

  if (error) throw error;

  return data.signedUrl;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(storagePath: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([storagePath]);

  if (error) throw error;
}

/**
 * List files in a project folder
 */
export async function listProjectFiles(projectId: string, folder?: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const path = folder ? `${projectId}/${folder}` : projectId;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(path, {
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) throw error;

  return data;
}
