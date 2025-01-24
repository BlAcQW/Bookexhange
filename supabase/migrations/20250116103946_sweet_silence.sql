/*
  # Fix Profile Policies and Admin Setup

  1. Creates profiles table if not exists
  2. Sets up RLS and policies safely
  3. Creates admin user with proper authentication
  4. Sets up user creation trigger
*/

-- Create profiles table if not exists (idempotent)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create RLS policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', 'Anonymous'))
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ language plpgsql security definer;

-- Recreate trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create or update admin user
DO $$ 
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@textbookxchange.com';

  IF admin_user_id IS NULL THEN
    -- Create admin user with proper auth setup
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
    RETURNING id INTO admin_user_id;

    -- Create admin profile
    INSERT INTO public.profiles (id, name)
    VALUES (admin_user_id, 'Admin User')
    ON CONFLICT (id) DO UPDATE
    SET name = 'Admin User';
  ELSE
    -- Update existing admin user
    UPDATE auth.users
    SET 
      raw_user_meta_data = jsonb_build_object(
        'name', 'Admin User',
        'role', 'admin'
      ),
      encrypted_password = crypt('Admin@123', gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now()
    WHERE id = admin_user_id;

    -- Update admin profile
    UPDATE public.profiles
    SET name = 'Admin User'
    WHERE id = admin_user_id;
  END IF;
END $$;