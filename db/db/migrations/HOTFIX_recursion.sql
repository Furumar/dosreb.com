-- HOTFIX: Fix infinite recursion in user_profiles RLS policies
-- Run this if you already ran 002_add_user_profiles.sql and got recursion errors

-- Drop the problematic recursive policies
DROP POLICY IF EXISTS "superusers_can_read_all_profiles" ON user_profiles;
DROP POLICY IF EXISTS "superusers_can_update_all_profiles" ON user_profiles;

-- Add INSERT policy for new users
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON user_profiles;
CREATE POLICY "users_can_insert_own_profile" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create a helper function that doesn't cause recursion
CREATE OR REPLACE FUNCTION is_superuser()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_superuser FROM user_profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Update projects policies to use the helper function
DROP POLICY IF EXISTS "superusers_full_access" ON projects;
CREATE POLICY "superusers_full_access" ON projects
  FOR ALL
  USING (is_superuser());

-- Update files policies
DROP POLICY IF EXISTS "superusers_full_access_files" ON files;
CREATE POLICY "superusers_full_access_files" ON files
  FOR ALL
  USING (is_superuser());

-- Update comments policies
DROP POLICY IF EXISTS "superusers_full_access_comments" ON comments;
CREATE POLICY "superusers_full_access_comments" ON comments
  FOR ALL
  USING (is_superuser());
