/*
  # Set up admin user

  1. Changes
    - Creates user if not exists
    - Updates user's role to admin
    - Ensures proper profile setup
  
  2. Security
    - Uses secure password hashing
    - Maintains existing RLS policies
*/

-- Create the user if they don't exist
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'narh@gmail.com',
  crypt('password', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'name', 'Admin User',
    'role', 'admin'
  ),
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'narh@gmail.com'
);

-- Ensure user has admin role in metadata
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || 
  jsonb_build_object(
    'role', 'admin'
  )
WHERE email = 'narh@gmail.com';

-- Create or update profile with admin role
INSERT INTO public.profiles (id, name, role)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', 'Admin User'),
  'admin'
FROM auth.users 
WHERE email = 'narh@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';