import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const stripe = {
  // Create a payment intent for a book purchase
  createPaymentIntent: async (bookId: string) => {
    try {
      const { data: book } = await supabase
        .from('books')
        .select('price, title')
        .eq('id', bookId)
        .single();

      if (!book) throw new Error('Book not found');

      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { 
          amount: book.price * 100, // Convert to cents
          bookId,
          description: `Purchase of ${book.title}`
        }
      });

      if (error) throw error;
      return data.clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Process a successful payment
  handlePaymentSuccess: async (bookId: string, paymentIntentId: string) => {
    try {
      const { error } = await supabase.functions.invoke('handle-payment-success', {
        body: { bookId, paymentIntentId }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }
};