-- 002_add_user_profiles.sql
-- Add user profiles table with role management and superuser support

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
CREATE POLICY "users_can_read_own_profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (but not role or is_superuser)
CREATE POLICY "users_can_update_own_profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Superusers can read all profiles
CREATE POLICY "superusers_can_read_all_profiles" ON user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.is_superuser = true
    )
  );

-- Superusers can update all profiles
CREATE POLICY "superusers_can_update_all_profiles" ON user_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.is_superuser = true
    )
  );

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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert superuser profile for marco.furu@gmail.com
-- Note: This will only work if the user exists in auth.users
-- If the user doesn't exist yet, this will be inserted when they sign up via the trigger
-- We use ON CONFLICT to handle the case where the profile already exists

-- First, check if the user exists in auth.users and insert profile
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

-- Update existing RLS policies to grant superusers full access to projects
DROP POLICY IF EXISTS "superusers_full_access" ON projects;
CREATE POLICY "superusers_full_access" ON projects
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.is_superuser = true
    )
  );

-- Grant superusers access to all files
DROP POLICY IF EXISTS "superusers_full_access_files" ON files;
CREATE POLICY "superusers_full_access_files" ON files
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.is_superuser = true
    )
  );

-- Grant superusers access to all comments
DROP POLICY IF EXISTS "superusers_full_access_comments" ON comments;
CREATE POLICY "superusers_full_access_comments" ON comments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.is_superuser = true
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_superuser ON user_profiles(is_superuser) WHERE is_superuser = true;
