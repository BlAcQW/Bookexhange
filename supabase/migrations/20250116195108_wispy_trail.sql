/*
  # Update specific user to admin role

  1. Changes
    - Updates the role of user with email 'narh@gmail.com' to 'admin'
    - Ensures the profiles table has a role column
  
  2. Security
    - Only updates the specific user
    - Maintains existing RLS policies
*/

-- First ensure the role column exists
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Update the specific user's role to admin
UPDATE profiles
SET role = 'admin'
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'narh@gmail.com'
);