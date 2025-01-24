import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminBooks } from './sections/AdminBooks';
import { AdminUsers } from './sections/AdminUsers';
import { AdminTransactions } from './sections/AdminTransactions';
import { AdminOverview } from './sections/AdminOverview';
import { AdminSettings } from './sections/AdminSettings';
import { AdminTest } from './components/AdminTest';
import { useAuth } from '../../contexts/AuthContext';

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: { role } = {} } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (role !== 'admin') {
        navigate('/');
        return;
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-light"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/books/*" element={<AdminBooks />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/transactions" element={<AdminTransactions />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="/test" element={<AdminTest />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}