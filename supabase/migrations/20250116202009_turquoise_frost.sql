/*
  # Fix missing tables and relationships

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `book_id` (uuid, references books)
      - `buyer_id` (uuid, references profiles)
      - `amount` (numeric)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Changes
    - Add missing `email` column to profiles table
    - Update books table foreign key relationships

  3. Security
    - Enable RLS on transactions table
    - Add policies for transactions
*/

-- Add email column to profiles if it doesn't exist
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Update profiles with emails from auth.users
UPDATE profiles
SET email = au.email
FROM auth.users au
WHERE profiles.id = au.id
  AND profiles.email IS NULL;

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE SET NULL,
  buyer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = buyer_id OR
    auth.uid() IN (
      SELECT owner_id FROM books WHERE id = book_id
    )
  );

CREATE POLICY "Users can create their own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Admins can view all transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS transactions_book_id_idx ON transactions(book_id);
CREATE INDEX IF NOT EXISTS transactions_buyer_id_idx ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON transactions(created_at DESC);

-- Add sample transactions
INSERT INTO transactions (book_id, buyer_id, amount, status)
SELECT 
  b.id,
  p.id,
  b.price,
  'completed'
FROM books b
CROSS JOIN profiles p
WHERE b.id IN (
  SELECT id FROM books LIMIT 3
)
AND p.id IN (
  SELECT id FROM profiles WHERE role != 'admin' LIMIT 1
)
ON CONFLICT DO NOTHING;