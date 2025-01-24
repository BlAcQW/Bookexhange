/*
  # Add Academic Books

  1. New Books
    - Adds new academic textbooks across various disciplines:
      - Computer Science & IT
      - Engineering
      - Science
      - Arts & Humanities
      - Mathematics
      - Health Sciences
      - Business & Economics

  2. Changes
    - Updates existing book categories to include new academic fields
    - Adds sample books with proper owner references
*/

-- Function to add academic books safely
CREATE OR REPLACE FUNCTION add_academic_books() RETURNS void AS $$
DECLARE
  profile_id uuid;
BEGIN
  -- Get the first available profile
  SELECT id INTO profile_id FROM profiles LIMIT 1;
  
  -- Only proceed if we have a valid profile
  IF profile_id IS NOT NULL THEN
    -- Computer Science books
    PERFORM create_sample_book(
      profile_id,
      'Computer Networking: A Top-Down Approach',
      'Kurose and Ross',
      'Comprehensive guide to computer networking principles and practices.',
      'Computer Science',
      'Like New',
      350.00,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'
    );

    PERFORM create_sample_book(
      profile_id,
      'Artificial Intelligence: A Modern Approach',
      'Stuart Russell and Peter Norvig',
      'Definitive text on artificial intelligence and machine learning.',
      'Computer Science',
      'Good',
      420.00,
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400'
    );

    -- Engineering books
    PERFORM create_sample_book(
      profile_id,
      'Introduction to Engineering Design',
      'Andrew Samuel',
      'Fundamental principles of engineering design and methodology.',
      'Engineering',
      'New',
      380.00,
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'
    );

    PERFORM create_sample_book(
      profile_id,
      'Electrical Engineering: Principles and Applications',
      'Allan R. Hambley',
      'Comprehensive coverage of electrical engineering concepts.',
      'Engineering',
      'Good',
      290.00,
      'https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?w=400'
    );

    -- Science books
    PERFORM create_sample_book(
      profile_id,
      'Conceptual Physics',
      'Paul G. Hewitt',
      'Clear explanation of physics concepts with practical applications.',
      'Science',
      'Like New',
      310.00,
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400'
    );

    PERFORM create_sample_book(
      profile_id,
      'Principles of Biochemistry',
      'Lehninger',
      'Fundamental principles of biochemistry and molecular biology.',
      'Science',
      'Good',
      450.00,
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400'
    );

    -- Arts & Humanities books
    PERFORM create_sample_book(
      profile_id,
      'History of Modern Art',
      'H. H. Arnason',
      'Comprehensive survey of modern artistic movements and works.',
      'Arts & Humanities',
      'New',
      280.00,
      'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=400'
    );

    -- Mathematics books
    PERFORM create_sample_book(
      profile_id,
      'Linear Algebra and Its Applications',
      'Gilbert Strang',
      'Clear presentation of linear algebra concepts and applications.',
      'Mathematics',
      'Like New',
      320.00,
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'
    );

    -- Health Sciences books
    PERFORM create_sample_book(
      profile_id,
      'Human Anatomy & Physiology',
      'Elaine N. Marieb',
      'Detailed exploration of human anatomy and physiological systems.',
      'Health Sciences',
      'Good',
      520.00,
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400'
    );

    -- Business & Economics books
    PERFORM create_sample_book(
      profile_id,
      'Principles of Microeconomics',
      'N. Gregory Mankiw',
      'Fundamental concepts of microeconomics with real-world applications.',
      'Business & Economics',
      'New',
      290.00,
      'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=400'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to add the academic books
SELECT add_academic_books();