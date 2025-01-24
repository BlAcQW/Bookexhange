import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
  const [error, setError] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      await registerUser(data.email, data.password, data.name);
      reset(); // Clear form
      navigate('/login', { 
        state: { message: 'Registration successful! Please log in.' },
        replace: true
      });
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof Error) {
        // Handle specific Supabase errors
        if (err.message.includes('email')) {
          setError('This email is already registered');
        } else {
          setError(err.message);
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <Input
              {...register('name')}
              label="Full Name"
              autoComplete="name"
              error={errors.name?.message}
              disabled={isSubmitting}
            />

            <Input
              {...register('email')}
              type="email"
              label="Email address"
              autoComplete="email"
              error={errors.email?.message}
              disabled={isSubmitting}
            />

            <Input
              {...register('password')}
              type="password"
              label="Password"
              autoComplete="new-password"
              error={errors.password?.message}
              disabled={isSubmitting}
            />

            <Input
              {...register('confirmPassword')}
              type="password"
              label="Confirm Password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full"
              disabled={isSubmitting}
            >
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}