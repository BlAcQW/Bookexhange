/*
  # Add Chat and Book Details Features

  1. New Tables
    - `chats`
      - `id` (uuid, primary key)
      - `book_id` (uuid, references books)
      - `sender_id` (uuid, references auth.users)
      - `receiver_id` (uuid, references auth.users)
      - `message` (text)
      - `created_at` (timestamp)
    
    - `similar_books`
      - `book_id` (uuid, references books)
      - `similar_book_id` (uuid, references books)
      - `similarity_score` (float)

  2. Security
    - Enable RLS on both tables
    - Add policies for chat access
    - Add policies for similar books viewing
*/

-- Create chat table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id),
  receiver_id uuid REFERENCES auth.users(id),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create similar books table
CREATE TABLE IF NOT EXISTS similar_books (
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  similar_book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  similarity_score float NOT NULL,
  PRIMARY KEY (book_id, similar_book_id)
);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE similar_books ENABLE ROW LEVEL SECURITY;

-- Chat policies
CREATE POLICY "Users can read their own chats"
  ON chats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON chats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Similar books policies
CREATE POLICY "Anyone can view similar books"
  ON similar_books
  FOR SELECT
  USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS chats_book_id_idx ON chats(book_id);
CREATE INDEX IF NOT EXISTS chats_sender_receiver_idx ON chats(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS similar_books_score_idx ON similar_books(similarity_score DESC);