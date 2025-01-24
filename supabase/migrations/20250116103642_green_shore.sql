/*
  # Create Admin User and Profile

  1. Creates admin user safely
  2. Sets up admin profile
  3. Ensures proper role assignment
*/

-- Create profiles table if not exists (idempotent)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create admin user if not exists
DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- First try to find existing admin
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'admin@textbookxchange.com';

  -- If admin doesn't exist, create new admin user
  IF admin_id IS NULL THEN
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
    ) VALUES (
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
    )
    RETURNING id INTO admin_id;
  END IF;

  -- Ensure admin has proper metadata
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_build_object(
    'name', COALESCE(raw_user_meta_data->>'name', 'Admin User'),
    'role', 'admin'
  )
  WHERE id = admin_id;

  -- Create or update admin profile
  INSERT INTO public.profiles (id, name)
  VALUES (
    admin_id,
    'Admin User'
  )
  ON CONFLICT (id) 
  DO UPDATE SET name = 'Admin User';

END $$;