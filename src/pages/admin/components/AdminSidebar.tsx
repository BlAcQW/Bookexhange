import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  CreditCard, 
  Settings,
  LogOut,
  TestTube
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../../components/ui/Button';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { path: '/admin/books', icon: BookOpen, label: 'Books' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/transactions', icon: CreditCard, label: 'Transactions' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
  { path: '/admin/test', icon: TestTube, label: 'Admin Test' }
];

export function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 min-h-screen shadow-sm">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h2>
      </div>
      
      <nav className="mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-primary dark:hover:text-primary-light transition-colors ${
                isActive ? 'bg-primary/5 dark:bg-primary-light/5 text-primary dark:text-primary-light' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}

        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center w-full mt-4 px-4"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </nav>
    </div>
  );
}