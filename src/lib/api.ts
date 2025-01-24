import { supabase } from './supabase';
import { Book } from '../types';

export const booksApi = {
  create: async (bookData: Omit<Book, 'id' | 'created_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('books')
      .insert({
        ...bookData,
        owner_id: user.id
      })
      .select(`
        *,
        profiles:owner_id (
          id,
          name,
          avatar_url,
          role
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  getAll: async ({ category, search }: { category?: string; search?: string } = {}) => {
    let query = supabase
      .from('books')
      .select(`
        *,
        profiles:owner_id (
          id,
          name,
          avatar_url,
          role
        )
      `);

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        profiles:owner_id (
          id,
          name,
          avatar_url,
          role
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, bookData: Partial<Book>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('books')
      .update(bookData)
      .eq('id', id)
      .eq('owner_id', user.id) // Ensure user owns the book
      .select(`
        *,
        profiles:owner_id (
          id,
          name,
          avatar_url,
          role
        )
      `)
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id); // Ensure user owns the book
    if (error) throw error;
  },

  // Add sample books for testing
  addSampleBooks: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const sampleBooks = [
      {
        title: "Advanced Software Engineering",
        author: "Narh Benjamin",
        description: "Comprehensive guide to modern software engineering practices and principles.",
        category: "Computer Science & IT",
        condition: "Like New",
        price: 350.00,
        image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
        owner_id: user.id,
        available: true
      },
      {
        title: "Web Development Fundamentals",
        author: "Narh Benjamin",
        description: "Essential concepts and practices in modern web development.",
        category: "Computer Science & IT",
        condition: "New",
        price: 280.00,
        image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
        owner_id: user.id,
        available: true
      },
      {
        title: "Data Structures and Algorithms",
        author: "Narh Benjamin",
        description: "A practical approach to understanding data structures and algorithms.",
        category: "Computer Science & IT",
        condition: "Good",
        price: 320.00,
        image_url: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
        owner_id: user.id,
        available: true
      }
    ];

    const { error } = await supabase
      .from('books')
      .insert(sampleBooks);

    if (error) throw error;
  }
};