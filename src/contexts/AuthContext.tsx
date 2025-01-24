import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; bio?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for persisted session
        const persistedSession = localStorage.getItem('supabase.auth.token');
        if (persistedSession) {
          const { data: { session }, error } = await retryOperation(
            () => supabase.auth.getSession()
          );
          
          if (error) throw error;
          if (session) {
            setUser(session.user);
          } else {
            // Clear invalid persisted session
            localStorage.removeItem('supabase.auth.token');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear potentially corrupted session data
        localStorage.removeItem('supabase.auth.token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Retry operation with exponential backoff
  const retryOperation = async <T,>(
    operation: () => Promise<T>,
    retries = MAX_RETRIES
  ): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && error?.name === 'AuthRetryableFetchError') {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
        return retryOperation(operation, retries - 1);
      }
      throw error;
    }
  };

  const login = async (email: string, password: string, remember: boolean = false) => {
    try {
      const { data, error } = await retryOperation(() =>
        supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
          options: {
            expiresIn: remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60
          }
        })
      );
      
      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      // Handle remember me
      if (remember) {
        localStorage.setItem('supabase.auth.token', data.session?.access_token || '');
      } else {
        localStorage.removeItem('supabase.auth.token');
      }

      // Verify user has a profile
      const { data: profile, error: profileError } = await retryOperation(() =>
        supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
      );

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      if (!profile) {
        const { error: insertError } = await retryOperation(() =>
          supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: data.user.user_metadata?.name || email.split('@')[0],
              email: email
            })
        );

        if (insertError) {
          console.error('Profile creation error:', insertError);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof AuthError) {
        switch (error.status) {
          case 400:
            throw new Error('Invalid email or password');
          case 429:
            throw new Error('Too many login attempts. Please try again later');
          default:
            throw new Error('Login failed. Please try again');
        }
      }
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await retryOperation(() =>
        supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { name }
          }
        })
      );
      
      if (error) throw error;
      if (!data.user) throw new Error('Registration failed');

      // Create initial profile
      const { error: profileError } = await retryOperation(() =>
        supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email: email.trim().toLowerCase()
          })
      );

      if (profileError) throw profileError;
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.message?.includes('email')) {
          throw new Error('This email is already registered');
        }
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await retryOperation(() => supabase.auth.signOut());
      if (error) throw error;
      localStorage.removeItem('supabase.auth.token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: { name?: string; bio?: string }) => {
    if (!user) throw new Error('No authenticated user');

    try {
      const { error: updateError } = await retryOperation(() =>
        supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            ...data
          }
        })
      );

      if (updateError) throw updateError;

      if (data.name) {
        const { error: profileError } = await retryOperation(() =>
          supabase
            .from('profiles')
            .update({ name: data.name })
            .eq('id', user.id)
        );

        if (profileError) throw profileError;
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}