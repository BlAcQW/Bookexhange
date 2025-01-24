import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar';
import { CategoryGrid } from '../components/CategoryGrid';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen } from 'lucide-react';
import { CountUp } from '../components/ui/CountUp';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-light dark:from-primary-dark dark:to-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Welcome to TextbookXchange
            </h1>
            <p className="text-xl mb-8 text-white/90">
              The smart way to buy, sell, and exchange university textbooks
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery}
                placeholder="Search by title, author, or ISBN..."
                onSubmit={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <CountUp end={1200} suffix="+" />
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available Books</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <CountUp end={500} suffix="+" />
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <CountUp end={800} suffix="+" />
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Successful Exchanges</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Categories Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
            <Link 
              to="/books" 
              className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors flex items-center gap-1"
            >
              View All
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <CategoryGrid />
        </section>

        {/* Call to Action */}
        {!user && (
          <div className="mt-16 text-center bg-gradient-to-r from-primary to-primary-light dark:from-primary-dark dark:to-primary text-white rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 text-white/90">
              Join our community of students and start exchanging textbooks today!
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-white text-primary dark:bg-gray-800 dark:text-primary-light px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Sign Up Now
              </Link>
              <Link 
                to="/login" 
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}