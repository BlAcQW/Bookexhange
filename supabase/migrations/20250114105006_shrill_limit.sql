/*
  # Initial database setup for TextbookXchange

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text)
      - `author` (text)
      - `description` (text)
      - `category` (text)
      - `condition` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `owner_id` (uuid, references auth.users)
      - `available` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `books` table
    - Add policies for:
      - Anyone can read books
      - Authenticated users can create books
      - Users can only update/delete their own books
*/

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text,
  category text NOT NULL,
  condition text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text,
  owner_id uuid REFERENCES auth.users NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Policies
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
CREATE INDEX IF NOT EXISTS books_owner_id_idx ON books(owner_id);
CREATE INDEX IF NOT EXISTS books_category_idx ON books(category);
CREATE INDEX IF NOT EXISTS books_title_idx ON books(title);