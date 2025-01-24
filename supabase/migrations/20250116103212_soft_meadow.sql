/*
  # Set Admin Role

  1. Updates
    - Sets admin role for the first user in the system
    - Adds admin role to user metadata
*/

UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', 'admin')
WHERE email = 'admin@textbookxchange.com';