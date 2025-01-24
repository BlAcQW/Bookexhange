-- Ensure Paa Addo has admin privileges
DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- First try to find existing user
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'narh@gmail.com';

  -- If user doesn't exist, create new admin user
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
      'narh@gmail.com',
      crypt('password', gen_salt('bf')),
      now(),
      jsonb_build_object(
        'name', 'Paa Addo',
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
    'name', 'Paa Addo',
    'role', 'admin'
  )
  WHERE id = admin_id;

  -- Create or update admin profile
  INSERT INTO public.profiles (id, name, role, email)
  VALUES (
    admin_id,
    'Paa Addo',
    'admin',
    'narh@gmail.com'
  )
  ON CONFLICT (id) 
  DO UPDATE SET 
    name = 'Paa Addo',
    role = 'admin',
    email = 'narh@gmail.com';

END $$;