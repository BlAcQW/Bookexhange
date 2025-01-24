import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  BookOpen, 
  Users, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight 
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Stats {
  totalBooks: number;
  totalUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  recentTransactions: any[];
  userGrowth: any[];
}

export function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    recentTransactions: [],
    userGrowth: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: booksCount },
        { count: usersCount },
        { data: transactions }
      ] = await Promise.all([
        supabase.from('books').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      // Calculate total revenue from transactions
      const revenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      setStats({
        totalBooks: booksCount || 0,
        totalUsers: usersCount || 0,
        totalTransactions: transactions?.length || 0,
        totalRevenue: revenue,
        recentTransactions: transactions || [],
        userGrowth: [] // You would populate this with actual growth data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={BookOpen}
          trend={2.5}
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend={5.2}
          color="green"
        />
        <StatCard
          title="Transactions"
          value={stats.totalTransactions}
          icon={CreditCard}
          trend={-1.5}
          color="purple"
        />
        <StatCard
          title="Revenue"
          value={`GH₵${stats.totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          trend={3.8}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Growth
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {stats.recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.book_title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  GH₵{transaction.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: any;
  trend: number;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center space-x-1">
          {trend > 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(trend)}%
          </span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}