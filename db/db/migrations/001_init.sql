-- 001_init.sql
-- Initial schema for Projects MVP: projects, files, comments, invites, templates
-- Run this with a privileged DB role (Supabase service_role) or via the Supabase CLI.

-- Provide gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid NOT NULL,
  title text NOT NULL,
  description text,
  visibility text NOT NULL DEFAULT 'private', -- 'private'|'public'|'unlisted'
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
  location jsonb, -- optional {page: 1, x: 0.5, y:0.1}
  resolved boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Invitations to collaborate on a project
CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  email text,
  role text DEFAULT 'editor', -- 'viewer'|'editor'|'owner'
  token text,
  status text DEFAULT 'pending', -- 'pending'|'accepted'|'revoked'
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

-- Row Level Security: enable and provide basic owner-only policies.
-- IMPORTANT: adapt these policies to match your auth setup and invitation model.

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_owner_full_access" ON projects
  USING (owner = auth.uid())
  WITH CHECK (owner = auth.uid());

ALTER TABLE files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "files_project_owner_access" ON files
  USING (EXISTS (SELECT 1 FROM projects p WHERE p.id = files.project_id AND p.owner = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM projects p WHERE p.id = files.project_id AND p.owner = auth.uid()));

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comments_project_owner_access" ON comments
  USING (EXISTS (SELECT 1 FROM projects p WHERE p.id = comments.project_id AND p.owner = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM projects p WHERE p.id = comments.project_id AND p.owner = auth.uid()));

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invites_project_owner_access" ON invites
  USING (EXISTS (SELECT 1 FROM projects p WHERE p.id = invites.project_id AND p.owner = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM projects p WHERE p.id = invites.project_id AND p.owner = auth.uid()));

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "templates_owner_access" ON templates
  USING (owner = auth.uid())
  WITH CHECK (owner = auth.uid());

-- Note: The policies above limit access to project owners only. To support collaborators via
-- `invites` (email-based or accepted invites), add policies that grant `SELECT`/`INSERT`
-- to users that appear in an accepted `invites` row or when `invites.email = auth.email()`.

-- Example helper function to check invite membership (optional):
-- CREATE FUNCTION is_project_collaborator(project uuid, user_email text) RETURNS boolean LANGUAGE sql AS $$
--   SELECT EXISTS(SELECT 1 FROM invites i WHERE i.project_id = project AND i.email = user_email AND i.status = 'accepted');
-- $$;

-- After running migrations, create a storage bucket named `projects` in Supabase Storage
-- and set appropriate CORS/URL rules for your frontend.
