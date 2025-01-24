/*
  # Add transaction reference column

  1. Changes
    - Add reference column to transactions table if not exists
    - Make reference column unique (safely)
    - Add index for faster lookups (safely)
    - Update existing transactions with default references
    - Make reference column required
*/

-- Add reference column if it doesn't exist
DO $$ BEGIN
  ALTER TABLE transactions 
    ADD COLUMN reference text;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Drop existing constraint if it exists
DO $$ BEGIN
  ALTER TABLE transactions
    DROP CONSTRAINT IF EXISTS transactions_reference_key;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add unique constraint
ALTER TABLE transactions
  ADD CONSTRAINT transactions_reference_key UNIQUE (reference);

-- Drop existing index if it exists
DO $$ BEGIN
  DROP INDEX IF EXISTS transactions_reference_idx;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create index for faster lookups
CREATE INDEX transactions_reference_idx ON transactions(reference);

-- Update existing transactions with a default reference if needed
UPDATE transactions 
SET reference = 'TXB-' || id::text
WHERE reference IS NULL;

-- Make reference column required for future entries
ALTER TABLE transactions
  ALTER COLUMN reference SET NOT NULL;