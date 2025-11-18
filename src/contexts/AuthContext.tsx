import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { setUser, setRole, setLoading, logout } from '../store/slices/authSlice';
import type { User } from '@supabase/supabase-js';
import type { RootState } from '../store';

interface AuthContextType {
  user: User | null;
  role: 'buyer' | 'seller' | 'admin' | null;
  loading: boolean;
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
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.role);
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    const fetchUserRole = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();

        if (error) throw error;
        dispatch(setRole(data?.role || 'buyer'));
      } catch (error) {
        console.error('Error fetching user role:', error);
        dispatch(setRole('buyer'));
      }
    };

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        dispatch(setUser(session.user));
        await fetchUserRole(session.user.id);
      } else {
        dispatch(setLoading(false));
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        dispatch(setUser(session.user));
        await fetchUserRole(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        dispatch(logout());
        // Navigate only if we're in a router context
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

