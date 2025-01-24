/*
  # Update specific user to admin role

  1. Changes
    - Update user metadata and profile for narh@gmail.com
    - Ensure admin role is set in both auth.users and profiles table
  
  2. Security
    - Maintains existing RLS policies
    - Updates both auth and profile tables for consistency
*/

-- Update user metadata in auth.users
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || 
  jsonb_build_object(
    'role', 'admin'
  )
WHERE email = 'narh@gmail.com';

-- Update profile role
UPDATE profiles
SET role = 'admin'
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'narh@gmail.com'
);