import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const returnTo = location.state?.returnTo || '/dashboard';
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email.toLowerCase().trim(), data.password, data.rememberMe);
      navigate(returnTo, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      // Handle specific error cases
      if (err.__isAuthError) {
        switch (err.code) {
          case 'invalid_credentials':
            setError('Invalid email or password. Please check your credentials and try again.');
            break;
          case 'email_not_confirmed':
            setError('Please verify your email address before logging in.');
            break;
          case 'rate_limit_exceeded':
            setError('Too many login attempts. Please try again later.');
            break;
          default:
            setError('An error occurred during login. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link 
            to="/register" 
            className="font-medium text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('email')}
              type="email"
              label="Email address"
              error={errors.email?.message}
              autoComplete="email"
              disabled={isSubmitting}
              placeholder="Enter your email"
            />

            <Input
              {...register('password')}
              type="password"
              label="Password"
              error={errors.password?.message}
              autoComplete="current-password"
              disabled={isSubmitting}
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary dark:text-primary-light focus:ring-primary dark:focus:ring-primary-light border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}