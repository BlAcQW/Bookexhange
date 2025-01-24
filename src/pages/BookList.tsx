import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar';
import { BookCard } from '../components/books/BookCard';
import { supabase } from '../lib/supabase';

const categories = [
  'Computer Science & IT',
  'Engineering',
  'Science',
  'Arts & Humanities',
  'Mathematics',
  'Health Sciences',
  'Business & Economics'
];

export function BookList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    fetchBooks();
  }, [categoryParam]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let query = supabase
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
        .order('created_at', { ascending: false });

      if (categoryParam) {
        query = query.eq('category', categoryParam);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;
      setBooks(data || []);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBooks();
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const handleCategoryClick = (category: string) => {
    setSearchParams({ category });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Browse Books</h1>
        
        {/* Categories */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Categories:</h2>
            {categoryParam && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoryParam === category
                    ? 'bg-primary dark:bg-primary-light text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery}
          onSubmit={handleSearch}
          placeholder={`Search ${categoryParam || 'all'} books...`}
        />
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-[400px]" />
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No books found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {categoryParam 
              ? `No books found in the ${categoryParam} category. Try another category or clear filters.`
              : 'Try adjusting your search or browse all available books'}
          </p>
        </div>
      )}
    </div>
  );
}