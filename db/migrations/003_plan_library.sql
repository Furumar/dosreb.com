-- 003_plan_library.sql
-- Plan Library: A centralized repository for floor plans, sections, facades, and other design assets
-- Users can upload, share, search, and reuse plans across projects

-- Plan Library Categories
CREATE TABLE IF NOT EXISTS plan_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO plan_categories (name, description, icon) VALUES
  ('floor_plans', 'Floor plans and layouts', '📐'),
  ('sections', 'Section drawings', '📏'),
  ('facades', 'Facade elevations', '🏛️'),
  ('details', 'Construction details', '🔍'),
  ('site_plans', 'Site and landscape plans', '🗺️'),
  ('3d_models', '3D models and renderings', '🏗️')
ON CONFLICT (name) DO NOTHING;

-- Plan Library Assets
CREATE TABLE IF NOT EXISTS plan_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid NOT NULL,
  title text NOT NULL,
  description text,
  category_id uuid REFERENCES plan_categories(id),
  
  -- File information
  storage_path text NOT NULL,
  filename text NOT NULL,
  mime_type text,
  size bigint,
  
  -- Metadata
  tags text[] DEFAULT '{}',
  visibility text NOT NULL DEFAULT 'private', -- 'private'|'public'|'organization'
  
  -- Building/project metadata
  metadata jsonb DEFAULT '{}'::jsonb, -- {building_type, year, location, scale, etc}
  
  -- Usage tracking
  usage_count int DEFAULT 0,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Link plans to projects (many-to-many)
CREATE TABLE IF NOT EXISTS project_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES plan_library(id) ON DELETE CASCADE,
  added_by uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, plan_id)
);

-- Favorites/bookmarks
CREATE TABLE IF NOT EXISTS plan_favorites (
  user_id uuid NOT NULL,
  plan_id uuid NOT NULL REFERENCES plan_library(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, plan_id)
);

-- Plan versions (track updates to plans)
CREATE TABLE IF NOT EXISTS plan_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES plan_library(id) ON DELETE CASCADE,
  version_number int NOT NULL,
  storage_path text NOT NULL,
  uploaded_by uuid,
  change_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(plan_id, version_number)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_plan_library_owner ON plan_library(owner);
CREATE INDEX IF NOT EXISTS idx_plan_library_category ON plan_library(category_id);
CREATE INDEX IF NOT EXISTS idx_plan_library_visibility ON plan_library(visibility);
CREATE INDEX IF NOT EXISTS idx_plan_library_tags ON plan_library USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_project_plans_project ON project_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_project_plans_plan ON project_plans(plan_id);

-- Full text search on titles and descriptions
CREATE INDEX IF NOT EXISTS idx_plan_library_search ON plan_library 
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- Row Level Security
ALTER TABLE plan_library ENABLE ROW LEVEL SECURITY;

-- Owner can do everything with their own plans
CREATE POLICY "plan_library_owner_full_access" ON plan_library
  FOR ALL
  USING (owner = auth.uid())
  WITH CHECK (owner = auth.uid());

-- Anyone can view public plans
CREATE POLICY "plan_library_public_read" ON plan_library
  FOR SELECT
  USING (visibility = 'public');

-- Superusers can access all plans
CREATE POLICY "plan_library_superuser_access" ON plan_library
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'superuser'
    )
  );

-- RLS for project_plans
ALTER TABLE project_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_plans_owner_access" ON project_plans
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.id = project_plans.project_id 
      AND p.owner = auth.uid()
    )
  );

CREATE POLICY "project_plans_superuser_access" ON project_plans
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'superuser'
    )
  );

-- RLS for plan_favorites
ALTER TABLE plan_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plan_favorites_own_access" ON plan_favorites
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS for plan_versions
ALTER TABLE plan_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plan_versions_plan_owner_access" ON plan_versions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM plan_library pl 
      WHERE pl.id = plan_versions.plan_id 
      AND pl.owner = auth.uid()
    )
  );

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_plan_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE plan_library 
  SET usage_count = usage_count + 1,
      updated_at = now()
  WHERE id = NEW.plan_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment usage when plan is added to project
CREATE TRIGGER trigger_increment_plan_usage
  AFTER INSERT ON project_plans
  FOR EACH ROW
  EXECUTE FUNCTION increment_plan_usage();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_plan_library_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_plan_library_timestamp
  BEFORE UPDATE ON plan_library
  FOR EACH ROW
  EXECUTE FUNCTION update_plan_library_timestamp();
