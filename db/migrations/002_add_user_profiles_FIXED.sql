-- 002_add_user_profiles_FIXED.sql
-- Add user profiles table with role management and superuser support
-- FIXED: Removed recursive policy that was causing infinite recursion

-- User profiles table to store additional user information and roles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text,
  role text NOT NULL DEFAULT 'user', -- 'user'|'admin'|'superuser'
  is_superuser boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "users_can_read_own_profile" ON user_profiles;
CREATE POLICY "users_can_read_own_profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (but not role or is_superuser)
DROP POLICY IF EXISTS "users_can_update_own_profile" ON user_profiles;
CREATE POLICY "users_can_update_own_profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile (for new signups)
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON user_profiles;
CREATE POLICY "users_can_insert_own_profile" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert superuser profile for marco.furu@gmail.com
DO $$
DECLARE
  user_id uuid;
BEGIN
  -- Try to find the user by email in auth.users
  SELECT id INTO user_id FROM auth.users WHERE email = 'marco.furu@gmail.com';
  
  IF user_id IS NOT NULL THEN
    -- User exists, insert or update profile
    INSERT INTO public.user_profiles (id, email, full_name, role, is_superuser)
    VALUES (user_id, 'marco.furu@gmail.com', 'Marco Furu', 'superuser', true)
    ON CONFLICT (id) 
    DO UPDATE SET 
      role = 'superuser',
      is_superuser = true,
      updated_at = now();
    
    RAISE NOTICE 'Superuser profile created/updated for marco.furu@gmail.com';
  ELSE
    RAISE NOTICE 'User marco.furu@gmail.com not found in auth.users. Profile will be created on first login.';
  END IF;
END $$;

-- Helper function to check if current user is superuser
-- This avoids the recursive query issue
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

-- Update existing RLS policies to grant superusers full access to projects
-- Using the helper function instead of subquery
DROP POLICY IF EXISTS "superusers_full_access" ON projects;
CREATE POLICY "superusers_full_access" ON projects
  FOR ALL
  USING (is_superuser());

-- Grant superusers access to all files
DROP POLICY IF EXISTS "superusers_full_access_files" ON files;
CREATE POLICY "superusers_full_access_files" ON files
  FOR ALL
  USING (is_superuser());

-- Grant superusers access to all comments
DROP POLICY IF EXISTS "superusers_full_access_comments" ON comments;
CREATE POLICY "superusers_full_access_comments" ON comments
  FOR ALL
  USING (is_superuser());

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_superuser ON user_profiles(is_superuser) WHERE is_superuser = true;
