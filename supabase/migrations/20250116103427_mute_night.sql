/*
  # Admin User Setup

  1. Creates admin user if not exists
  2. Sets up proper role and metadata
*/

-- Create admin user if not exists
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
  'admin@textbookxchange.com',
  crypt('Admin@123', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'name', 'Admin User',
    'role', 'admin'
  ),
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@textbookxchange.com'
);

-- Ensure admin user has proper metadata
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || 
  jsonb_build_object(
    'name', COALESCE(raw_user_meta_data->>'name', 'Admin User'),
    'role', 'admin'
  )
WHERE email = 'admin@textbookxchange.com';

-- Create profile for admin if not exists
INSERT INTO public.profiles (id, name)
SELECT 
  id,
  raw_user_meta_data->>'name'
FROM auth.users 
WHERE email = 'admin@textbookxchange.com'
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name;