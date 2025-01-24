/*
  # Add reference column to transactions table

  1. Changes
    - Add reference column to transactions table
    - Make reference column unique
    - Add index for faster lookups
*/

-- Add reference column if it doesn't exist
DO $$ BEGIN
  ALTER TABLE transactions 
    ADD COLUMN reference text;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Make reference column unique
ALTER TABLE transactions
  ADD CONSTRAINT transactions_reference_key UNIQUE (reference);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS transactions_reference_idx ON transactions(reference);

-- Update existing transactions with a default reference if needed
UPDATE transactions 
SET reference = 'TXB-' || id 
WHERE reference IS NULL;

-- Make reference column required for future entries
ALTER TABLE transactions
  ALTER COLUMN reference SET NOT NULL;