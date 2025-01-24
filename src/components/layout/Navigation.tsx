import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, ChevronDown, Sun, Moon, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AnimatedLogo } from '../ui/AnimatedLogo';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <AnimatedLogo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/books" 
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              Browse Books
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors ${
                    location.pathname === '/dashboard' ? 'text-primary dark:text-primary-light' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/add-book" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                >
                  Add Book
                </Link>
                <Link 
                  to="/messages" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Messages
                </Link>
              </>
            )}
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                Admin
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-gray-300 hover:text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
              )}
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors focus:outline-none"
                >
                  <img
                    src={user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=50&h=50&fit=crop'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user.user_metadata?.name || 'Profile'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="inline-block w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="inline-block w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <LogOut className="inline-block w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link
              to="/books"
              className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Browse Books
            </Link>
            
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/add-book"
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Add Book
                </Link>
                <Link
                  to="/messages"
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}
            
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-primary hover:text-primary-dark transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-primary hover:text-primary-dark transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}