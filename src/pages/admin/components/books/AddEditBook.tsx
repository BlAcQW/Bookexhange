import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../../lib/supabase';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Save, ArrowLeft } from 'lucide-react';

const categories = [
  'Computer Science & IT',
  'Engineering',
  'Science',
  'Arts & Humanities',
  'Mathematics',
  'Health Sciences', 'Business & Economics'
];

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export function AddEditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    image_url: ''
  });

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (data) {
        setBook(data);
      }
    } catch (err) {
      console.error('Error fetching book:', err);
      setError('Failed to load book details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const bookData = {
        ...book,
        price: parseFloat(book.price as string)
      };

      if (id) {
        const { error: updateError } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('books')
          .insert([bookData]);

        if (insertError) throw insertError;
      }

      navigate('/admin/books');
    } catch (err) {
      console.error('Error saving book:', err);
      setError('Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/books')}
          className="inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {id ? 'Edit Book' : 'Add New Book'}
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
          <Input
            label="Title"
            value={book.title}
            onChange={(e) => setBook({ ...book, title: e.target.value })}
            required
          />

          <Input
            label="Author"
            value={book.author}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
            required
          />

          <Input
            label="Description"
            value={book.description}
            onChange={(e) => setBook({ ...book, description: e.target.value })}
            as="textarea"
            rows={4}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={book.category}
                onChange={(e) => setBook({ ...book, category: e.target.value })}
                className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Condition
              </label>
              <select
                value={book.condition}
                onChange={(e) => setBook({ ...book, condition: e.target.value })}
                className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light"
                required
              >
                <option value="">Select condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Price (GH₵)"
            type="number"
            min="0"
            step="0.01"
            value={book.price}
            onChange={(e) => setBook({ ...book, price: e.target.value })}
            required
          />

          <Input
            label="Image URL"
            type="url"
            value={book.image_url}
            onChange={(e) => setBook({ ...book, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={loading}
            className="inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {id ? 'Update Book' : 'Add Book'}
          </Button>
        </div>
      </form>
    </div>
  );
}