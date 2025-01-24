/*
  # Add Sample Chat Data

  1. New Function
    - Creates sample chat messages between users and book owners
  
  2. Sample Data
    - Adds realistic chat messages for book inquiries
    - Links messages to existing books and users
*/

-- Function to create sample chat messages
CREATE OR REPLACE FUNCTION create_sample_chats() RETURNS void AS $$
DECLARE
  book_record RECORD;
  sender_id uuid;
  receiver_id uuid;
BEGIN
  -- Get a non-admin user for sending messages
  SELECT id INTO sender_id 
  FROM profiles 
  WHERE role != 'admin' 
  LIMIT 1;

  -- Add sample messages for some books
  FOR book_record IN 
    SELECT b.id, b.owner_id, b.title 
    FROM books b 
    LIMIT 5
  LOOP
    -- Insert inquiry message
    INSERT INTO messages (
      book_id,
      sender_id,
      receiver_id,
      message,
      created_at
    ) VALUES (
      book_record.id,
      sender_id,
      book_record.owner_id,
      'Hi! Is this book still available? I''m interested in buying it.',
      now() - interval '2 days'
    );

    -- Insert owner response
    INSERT INTO messages (
      book_id,
      sender_id,
      receiver_id,
      message,
      created_at
    ) VALUES (
      book_record.id,
      book_record.owner_id,
      sender_id,
      'Yes, it''s still available! The condition is exactly as described.',
      now() - interval '1 day'
    );

    -- Insert follow-up question
    INSERT INTO messages (
      book_id,
      sender_id,
      receiver_id,
      message,
      created_at
    ) VALUES (
      book_record.id,
      sender_id,
      book_record.owner_id,
      'Great! Could we meet on campus for the exchange?',
      now() - interval '12 hours'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to create sample chats
SELECT create_sample_chats();