/*
  # Database Schema Update
  
  1. New Tables
    - `profiles` - Store user metadata
    - Updates to `books` table with proper foreign key relationships
  
  2. Security
    - Enable RLS on both tables
    - Add policies for profiles and books
    
  3. Performance
    - Add indexes for common queries
    
  4. Automation
    - Add trigger for automatic profile creation
*/

-- Create profiles table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    name text,
    avatar_url text,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Drop existing books table and recreate with proper foreign key
DROP TABLE IF EXISTS books CASCADE;
CREATE TABLE books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text,
  category text NOT NULL,
  condition text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text,
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
DO $$ BEGIN
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE books ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Drop existing policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Anyone can read books" ON books;
  DROP POLICY IF EXISTS "Authenticated users can create books" ON books;
  DROP POLICY IF EXISTS "Users can update their own books" ON books;
  DROP POLICY IF EXISTS "Users can delete their own books" ON books;
END $$;

-- Create new policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read books"
  ON books
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own books"
  ON books
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own books"
  ON books
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create indexes for better performance
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS books_owner_id_idx ON books(owner_id);
  CREATE INDEX IF NOT EXISTS books_category_idx ON books(category);
  CREATE INDEX IF NOT EXISTS books_title_idx ON books(title);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, new.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();