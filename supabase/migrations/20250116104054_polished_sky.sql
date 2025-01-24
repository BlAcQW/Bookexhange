/*
  # Fix Authentication Setup

  1. Ensures proper auth schema and tables exist
  2. Creates necessary indexes
  3. Sets up proper RLS policies
  4. Fixes user authentication issues
*/

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS users_instance_id_idx ON auth.users(instance_id);
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users(email);

-- Ensure proper RLS policies
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create or update admin user with proper structure
DO $$ 
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@textbookxchange.com';

  IF admin_user_id IS NULL THEN
    -- Create admin user
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
      updated_at,
      last_sign_in_at
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
      now(),
      now()
    )
    RETURNING id INTO admin_user_id;
  ELSE
    -- Update existing admin
    UPDATE auth.users
    SET 
      encrypted_password = crypt('Admin@123', gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      raw_user_meta_data = jsonb_build_object(
        'name', 'Admin User',
        'role', 'admin'
      ),
      updated_at = now()
    WHERE id = admin_user_id;
  END IF;

  -- Ensure admin profile exists
  INSERT INTO public.profiles (id, name)
  VALUES (admin_user_id, 'Admin User')
  ON CONFLICT (id) DO UPDATE
  SET name = 'Admin User';
END $$;