import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
}

export function MobileMenu({ isOpen }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
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
  );
}