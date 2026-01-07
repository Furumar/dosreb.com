-- 001_init_CLEAN.sql
-- Safe version that won't error if tables/policies already exist
-- Run this if you got "already exists" errors

-- Provide gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid NOT NULL,
  title text NOT NULL,
  description text,
  visibility text NOT NULL DEFAULT 'private',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Files uploaded for projects
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  uploaded_by uuid,
  filename text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size bigint,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Comments / annotations on files or projects
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  file_id uuid REFERENCES files(id) ON DELETE CASCADE,
  author uuid,
  body text NOT NULL,
  parent_id uuid,
  location jsonb,
  resolved boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Invitations to collaborate on a project
CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  email text,
  role text DEFAULT 'editor',
  token text,
  status text DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Reusable templates for project metadata/presets
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid,
  name text NOT NULL,
  schema jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Basic indexes
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner);
CREATE INDEX IF NOT EXISTS idx_files_project ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_project ON comments(project_id);

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "projects_owner_full_access" ON projects;
CREATE POLICY "projects_owner_full_access" ON projects
  USING (owner = auth.uid())
  WITH CHECK (owner = auth.uid());

ALTER TABLE files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "files_project_owner_access" ON files;
CREATE POLICY "files_project_owner_access" ON files
  USING (EXISTS (SELECT 1 FROM projects p WHERE p.id = files.project_id AND p.owner = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM projects p WHERE p.id = files.project_id AND p.owner = auth.uid()));

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "comments_project_owner_access" ON comments;
CREATE POLICY "comments_project_owner_access" ON comments
  USING (EXISTS (SELECT 1 FROM projects p WHERE p.id = comments.project_id AND p.owner = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM projects p WHERE p.id = comments.project_id AND p.owner = auth.uid()));

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "invites_project_owner_access" ON invites;
CREATE POLICY "invites_project_owner_access" ON invites
  USING (EXISTS (SELECT 1 FROM projects p WHERE p.id = invites.project_id AND p.owner = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM projects p WHERE p.id = invites.project_id AND p.owner = auth.uid()));

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "templates_owner_access" ON templates;
CREATE POLICY "templates_owner_access" ON templates
  USING (owner = auth.uid())
  WITH CHECK (owner = auth.uid());
