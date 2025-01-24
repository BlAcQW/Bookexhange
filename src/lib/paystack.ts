import { supabase } from './supabase';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export const paystack = {
  // Initialize payment
  initializePayment: async (bookId: string) => {
    try {
      const { data: book } = await supabase
        .from('books')
        .select('price, title')
        .eq('id', bookId)
        .single();

      if (!book) throw new Error('Book not found');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's profile for email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      // Generate a unique reference
      const reference = `TXB-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

      // Save transaction record
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          book_id: bookId,
          buyer_id: user.id,
          amount: book.price,
          status: 'pending',
          reference
        });

      if (txError) throw txError;

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: profile.email,
        amount: book.price * 100, // Convert to kobo
        currency: 'GHS',
        ref: reference,
        metadata: {
          bookId,
          bookTitle: book.title,
          custom_fields: [
            {
              display_name: "Book Title",
              variable_name: "book_title",
              value: book.title
            }
          ]
        },
        callback: async (response: any) => {
          if (response.status === 'success') {
            await paystack.verifyPayment(reference, bookId);
          }
        },
        onClose: () => {
          // Handle modal close
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  },

  // Verify payment
  verifyPayment: async (reference: string, bookId: string) => {
    try {
      const { error } = await supabase.functions.invoke('verify-paystack-payment', {
        body: { reference, bookId }
      });

      if (error) throw error;

      // Redirect to success page
      window.location.href = `/payment/success?reference=${reference}&book=${bookId}`;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }
};