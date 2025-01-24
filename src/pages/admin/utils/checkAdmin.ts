import { supabase } from '../../../lib/supabase';

export async function checkAdminStatus(email: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    const isAdmin = profile?.role === 'admin';

    return {
      isAdmin,
      profileRole: profile?.role,
      metadataRole: user.user_metadata?.role
    };
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw error;
  }
}