import { supabase } from '../../../lib/supabase';

export async function queryAdminStatus() {
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('role', 'admin');

    if (profilesError) throw profilesError;

    // Get user metadata for each admin
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    // Combine profile and user metadata information
    return profiles.map(profile => {
      const user = users.users.find(u => u.id === profile.id);
      return {
        id: profile.id,
        email: profile.email,
        profileRole: profile.role,
        metadataRole: user?.user_metadata?.role
      };
    });
  } catch (error) {
    console.error('Error querying admin status:', error);
    throw error;
  }
}