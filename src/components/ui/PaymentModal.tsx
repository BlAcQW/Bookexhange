import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Lock } from 'lucide-react';
import { Button } from './Button';
import { paystack } from '../../lib/paystack';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
  price: number;
  onSuccess: () => void;
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  bookId, 
  bookTitle, 
  price,
  onSuccess 
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');
      await paystack.initializePayment(bookId);
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Secure Payment
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Order Summary
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {bookTitle}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                GH₵{price.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Payments are secure and encrypted</span>
            </div>

            <Button
              onClick={handlePayment}
              isLoading={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Pay with Paystack
            </Button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By proceeding with the payment, you agree to our terms and conditions
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}