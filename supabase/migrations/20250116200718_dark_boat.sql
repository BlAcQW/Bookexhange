/*
  # Update Admin User

  1. Changes
    - Remove admin role from admin@textbookxchange.com
    - Ensure narh@gmail.com has admin privileges
    - Update user metadata and profile role
*/

-- Remove admin role from previous admin
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'role'
WHERE email = 'admin@textbookxchange.com';

UPDATE profiles
SET role = 'user'
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'admin@textbookxchange.com'
);

-- Ensure narh@gmail.com has admin privileges
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'name', COALESCE(raw_user_meta_data->>'name', 'Admin User'),
  'role', 'admin'
)
WHERE email = 'narh@gmail.com';

UPDATE profiles
SET role = 'admin'
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'narh@gmail.com'
);

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

-- Ensure profile exists
INSERT INTO public.profiles (id, name, role)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', 'Admin User'),
  'admin'
FROM auth.users 
WHERE email = 'narh@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';