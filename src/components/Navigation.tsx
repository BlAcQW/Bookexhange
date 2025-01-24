import { BookOpen, PlusCircle, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-red-600" />
              <span className="ml-2 font-bold text-xl">TextbookXchange</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/books" className="text-gray-700 hover:text-red-600">
              Browse Books
            </Link>
            <Link to="/add-book" className="text-gray-700 hover:text-red-600 flex items-center">
              <PlusCircle className="h-5 w-5 mr-1" />
              Add Book
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-red-600 flex items-center">
              <UserCircle className="h-5 w-5 mr-1" />
              Profile
            </Link>
            <Link
              to="/login"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Sign In
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link to="/books" className="block py-2 text-gray-700 hover:text-red-600">
              Browse Books
            </Link>
            <Link to="/add-book" className="block py-2 text-gray-700 hover:text-red-600">
              Add Book
            </Link>
            <Link to="/profile" className="block py-2 text-gray-700 hover:text-red-600">
              Profile
            </Link>
            <Link to="/login" className="block py-2 text-red-600 hover:text-red-700">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}