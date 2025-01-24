import { PlusCircle, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NavLinks() {
  return (
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
  );
}