import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  condition: z.string().min(1, 'Condition is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  image_url: z.string().url('Please enter a valid image URL'),
});

type BookForm = z.infer<typeof bookSchema>;

const categories = [
  'Computer Science & IT',
  'Engineering',
  'Science',
  'Arts & Humanities',
  'Mathematics',
  'Health Sciences',
  'Business & Economics'
];

export function AddBook() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
  });

  const onSubmit = async (data: BookForm) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to add a book');
      }

      // Get user's profile to set as author if it's their own book
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      const { error: supabaseError } = await supabase
        .from('books')
        .insert([
          {
            ...data,
            // Use profile name as author if it's their own book
            author: profile?.name || data.author,
            owner_id: user.id,
            available: true
          }
        ]);

      if (supabaseError) throw supabaseError;

      navigate('/books', { 
        state: { message: 'Book added successfully!' }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add book');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register('title')}
          label="Title"
          error={errors.title?.message}
        />

        <Input
          {...register('author')}
          label="Author"
          error={errors.author?.message}
          defaultValue={user?.user_metadata?.name || ''}
        />

        <Input
          {...register('description')}
          label="Description"
          as="textarea"
          rows={3}
          error={errors.description?.message}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            {...register('category')}
            className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Condition
          </label>
          <select
            {...register('condition')}
            className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light"
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
          {errors.condition && (
            <p className="text-sm text-red-600">{errors.condition.message}</p>
          )}
        </div>

        <Input
          {...register('price', { valueAsNumber: true })}
          type="number"
          label="Price (GH₵)"
          min="0"
          step="0.01"
          error={errors.price?.message}
        />

        <Input
          {...register('image_url')}
          label="Image URL"
          placeholder="https://example.com/image.jpg"
          error={errors.image_url?.message}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
        >
          Add Book
        </Button>
      </form>
    </div>
  );
}