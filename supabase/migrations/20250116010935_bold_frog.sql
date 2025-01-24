/*
  # Add Sample Books and Functions
  
  1. Sample Data Functions
    - Create helper function for adding sample books
    - Add function to safely populate initial books
  
  Note: Chat system setup was moved to a separate migration
*/

-- Function to create sample data
CREATE OR REPLACE FUNCTION create_sample_book(
  owner_profile_id uuid,
  title text,
  author text,
  description text,
  category text,
  condition text,
  price numeric,
  image_url text
) RETURNS uuid AS $$
DECLARE
  book_id uuid;
BEGIN
  INSERT INTO books (
    title, author, description, category, condition, 
    price, image_url, owner_id, available
  )
  VALUES (
    title, author, description, category, condition,
    price, image_url, owner_profile_id, true
  )
  RETURNING id INTO book_id;
  
  RETURN book_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely add books for existing profiles
CREATE OR REPLACE FUNCTION add_sample_books() RETURNS void AS $$
DECLARE
  profile_id uuid;
BEGIN
  -- Only add books if we have profiles
  FOR profile_id IN SELECT id FROM profiles LIMIT 1 LOOP
    -- Add sample books only if the books table is empty
    IF NOT EXISTS (SELECT 1 FROM books LIMIT 1) THEN
      PERFORM create_sample_book(
        profile_id,
        'Advanced Corporate Law in Ghana',
        'Prof. Kwesi Adu-Mensah',
        'Comprehensive guide to corporate law practice in Ghana, covering recent legislative changes and case studies.',
        'Law',
        'Like New',
        450.00,
        'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400'
      );

      PERFORM create_sample_book(
        profile_id,
        'Clinical Nursing Practice: A Ghanaian Perspective',
        'Dr. Sarah Kofie',
        'Essential nursing textbook tailored for Ghanaian healthcare settings with local case studies.',
        'Nursing',
        'Good',
        320.00,
        'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400'
      );

      PERFORM create_sample_book(
        profile_id,
        'Modern Midwifery in West Africa',
        'Dr. Efua Nyarko',
        'Contemporary approach to midwifery practice in West African context.',
        'Midwifery',
        'New',
        380.00,
        'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400'
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to add sample books
SELECT add_sample_books();