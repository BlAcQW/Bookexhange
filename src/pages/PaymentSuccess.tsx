import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reference = searchParams.get('reference');
  const bookId = searchParams.get('book');

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!reference || !bookId) {
        setError('Invalid payment session');
        setLoading(false);
        return;
      }

      try {
        // Get transaction status
        const { data: transaction, error: txError } = await supabase
          .from('transactions')
          .select('status')
          .eq('reference', reference)
          .single();

        if (txError) throw txError;

        if (transaction?.status !== 'completed') {
          throw new Error('Transaction not completed');
        }
      } catch (err) {
        console.error('Error verifying transaction:', err);
        setError('Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyTransaction();
  }, [reference, bookId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
      >
        {error ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-full h-full rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Error
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-green-500">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-full h-full rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>
          </>
        )}

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/books')}
            className="w-full"
          >
            Browse More Books
          </Button>
        </div>
      </motion.div>
    </div>
  );
}