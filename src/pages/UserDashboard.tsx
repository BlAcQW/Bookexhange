import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { BookCard } from '../components/books/BookCard';
import { BookOpen, DollarSign, Eye, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalBooks: number;
  totalValue: number;
  activeListings: number;
  totalViews: number;
}

export function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalValue: 0,
    activeListings: 0,
    totalViews: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserBooks();
    }
  }, [user]);

  const fetchUserBooks = async () => {
    try {
      setLoading(true);
      const { data: userBooks, error: booksError } = await supabase
        .from('books')
        .select(`
          *,
          profiles:owner_id (
            id,
            name,
            avatar_url,
            role
          )
        `)
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;

      setBooks(userBooks || []);

      // Calculate dashboard stats
      const activeBooks = userBooks?.filter(book => book.available) || [];
      setStats({
        totalBooks: userBooks?.length || 0,
        totalValue: userBooks?.reduce((sum, book) => sum + book.price, 0) || 0,
        activeListings: activeBooks.length,
        totalViews: userBooks?.length * 12 // Simulated view count
      });
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load your books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId)
        .eq('owner_id', user?.id);

      if (deleteError) throw deleteError;
      
      // Refresh books list
      fetchUserBooks();
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-light"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Dashboard
        </h1>
        <Button
          onClick={() => navigate('/add-book')}
          className="flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Add New Book
        </Button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Books</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                GH₵{stats.totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <ListChecks className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeListings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
              <Eye className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Books Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Books</h2>
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard 
                key={book.id} 
                book={book}
                onDelete={() => handleDeleteBook(book.id)}
                onEdit={() => navigate(`/books/edit/${book.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No books</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding your first book
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/add-book')}>
                Add New Book
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}