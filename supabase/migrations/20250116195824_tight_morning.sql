/*
  # Add admin role field

  1. Changes
    - Add role column to profiles table
    - Set default role as 'user'
    - Add role check constraint
    - Update existing profiles
  
  2. Security
    - Maintains existing RLS policies
    - Adds role validation
*/

-- Add role column if it doesn't exist
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Add check constraint for valid roles
DO $$ BEGIN
  ALTER TABLE profiles 
    ADD CONSTRAINT valid_role 
    CHECK (role IN ('user', 'admin'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create index on role column
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Update RLS policies to consider role
CREATE POLICY "Admins can update any profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;