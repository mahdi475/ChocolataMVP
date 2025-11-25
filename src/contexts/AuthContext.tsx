import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { setUser, setRole, setLoading, logout } from '../store/slices/authSlice';
import type { User } from '@supabase/supabase-js';
import type { RootState } from '../store';

import {
  AuthError,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  role: 'buyer' | 'seller' | 'admin' | null;
  loading: boolean;
  handleRegister: (credentials: SignUpWithPasswordCredentials) => Promise<{ error: AuthError | null }>;
  handleLogin: (credentials: SignInWithPasswordCredentials) => Promise<{ error: AuthError | null }>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.role);
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    console.log('--- DEBUG: AuthContext useEffect START ---');
    dispatch(setLoading(true));

    const fetchUserRole = async (user: User) => {
      console.log(`[Auth] Fetching role for user ${user.id}`);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          throw new Error(`Failed to fetch role: ${error.message}`);
        }
        
        const role = data?.role || 'buyer';
        console.log(`[Auth] Role fetched from DB: ${role}`);
        dispatch(setRole(role));
      } catch (error) {
        console.error('[Auth] Error fetching user role:', error);
        dispatch(setRole('buyer')); // Default to buyer on error
      }
    };

    const handleSession = async (session: { user: User } | null) => {
      if (session?.user) {
        console.log('[Auth] Session found. User is logged in.');
        dispatch(setUser(session.user));
        await fetchUserRole(session.user);
      } else {
        console.log('[Auth] No session found. User is logged out.');
        dispatch(logout());
      }
      dispatch(setLoading(false));
      console.log('--- DEBUG: AuthContext useEffect END (session handled) ---');
    };
    
    // Check for initial session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[Auth] Initial getSession() completed.');
      handleSession(session as any);
    });

    // Listen for auth state changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[Auth] onAuthStateChange event: ${event}`);
      handleSession(session as any);
    });

    return () => {
      console.log('[Auth] Unsubscribing from auth state changes.');
      subscription.unsubscribe();
    };
  }, [dispatch]);

  const handleRegister = async (credentials: SignUpWithPasswordCredentials) => {
    const { error } = await supabase.auth.signUp(credentials);
    return { error };
  };

  const handleLogin = async (credentials: SignInWithPasswordCredentials) => {
    const { error } = await supabase.auth.signInWithPassword(credentials);
    return { error };
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(logout());
      window.location.href = '/login'; // Use window.location instead of navigate
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

