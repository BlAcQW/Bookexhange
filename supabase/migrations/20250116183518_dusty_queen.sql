/*
  # Add Academic Books

  1. New Books
    - Adds new academic textbooks across various disciplines
    - Includes Computer Science, Engineering, Science, Arts & Humanities,
      Mathematics, Health Sciences, and Business & Economics
  2. Categories
    - Updates existing categories to include new academic disciplines
*/

-- Function to add academic books safely
CREATE OR REPLACE FUNCTION add_new_academic_books() RETURNS void AS $$
DECLARE
  profile_id uuid;
BEGIN
  -- Get the first available profile
  SELECT id INTO profile_id FROM profiles LIMIT 1;
  
  -- Only proceed if we have a valid profile
  IF profile_id IS NOT NULL THEN
    -- Computer Science & IT books
    PERFORM create_sample_book(
      profile_id,
      'Database Systems: The Complete Book',
      'Hector Garcia-Molina',
      'Comprehensive coverage of database concepts and implementation.',
      'Computer Science & IT',
      'Like New',
      380.00,
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'
    );

    PERFORM create_sample_book(
      profile_id,
      'Clean Code: A Handbook of Agile Software Craftsmanship',
      'Robert C. Martin',
      'Guide to writing clean, maintainable code.',
      'Computer Science & IT',
      'Good',
      290.00,
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'
    );

    -- Engineering books
    PERFORM create_sample_book(
      profile_id,
      'Fundamentals of Electric Circuits',
      'Charles K. Alexander',
      'Essential concepts of electric circuit analysis.',
      'Engineering',
      'New',
      420.00,
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'
    );

    PERFORM create_sample_book(
      profile_id,
      'Mechanics of Materials',
      'Russell C. Hibbeler',
      'Comprehensive coverage of stress, strain, and mechanical properties.',
      'Engineering',
      'Good',
      350.00,
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400'
    );

    -- Science books
    PERFORM create_sample_book(
      profile_id,
      'Organic Chemistry',
      'Paula Bruice',
      'In-depth coverage of organic chemistry principles.',
      'Science',
      'Like New',
      390.00,
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400'
    );

    PERFORM create_sample_book(
      profile_id,
      'University Physics',
      'Young & Freedman',
      'Comprehensive physics text with calculus applications.',
      'Science',
      'Good',
      410.00,
      'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400'
    );

    -- Arts & Humanities books
    PERFORM create_sample_book(
      profile_id,
      'Art History: A Critical Introduction',
      'Michael Hatt',
      'Survey of art history from ancient to contemporary.',
      'Arts & Humanities',
      'New',
      280.00,
      'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=400'
    );

    PERFORM create_sample_book(
      profile_id,
      'Introduction to Philosophy',
      'John Perry',
      'Exploration of major philosophical concepts and thinkers.',
      'Arts & Humanities',
      'Like New',
      260.00,
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400'
    );

    -- Mathematics books
    PERFORM create_sample_book(
      profile_id,
      'Calculus: Early Transcendentals',
      'James Stewart',
      'Comprehensive calculus text with applications.',
      'Mathematics',
      'Good',
      370.00,
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'
    );

    PERFORM create_sample_book(
      profile_id,
      'Linear Algebra and Its Applications',
      'Gilbert Strang',
      'Clear presentation of linear algebra concepts.',
      'Mathematics',
      'Like New',
      340.00,
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400'
    );

    -- Health Sciences books
    PERFORM create_sample_book(
      profile_id,
      'Guyton and Hall Textbook of Medical Physiology',
      'John E. Hall',
      'Comprehensive medical physiology text.',
      'Health Sciences',
      'New',
      490.00,
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400'
    );

    PERFORM create_sample_book(
      profile_id,
      'Clinical Pharmacology',
      'Morris Brown',
      'Essential pharmacology concepts for healthcare.',
      'Health Sciences',
      'Good',
      420.00,
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400'
    );

    -- Business & Economics books
    PERFORM create_sample_book(
      profile_id,
      'Principles of Economics',
      'N. Gregory Mankiw',
      'Comprehensive introduction to economic principles.',
      'Business & Economics',
      'Like New',
      360.00,
      'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=400'
    );

    PERFORM create_sample_book(
      profile_id,
      'Financial Management: Theory and Practice',
      'Eugene F. Brigham',
      'Advanced concepts in financial management.',
      'Business & Economics',
      'Good',
      380.00,
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to add the new academic books
SELECT add_new_academic_books();