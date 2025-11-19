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
    console.log('🔄 AuthContext useEffect starting...');
    
    const applyRoleFromMetadata = (user: User | null) => {
      const metaRole = user?.user_metadata?.role as 'buyer' | 'seller' | 'admin' | undefined;
      if (metaRole) {
        console.log('📝 Setting role from metadata:', metaRole);
        dispatch(setRole(metaRole));
      }
    };

    const fetchUserRole = async (userId: string) => {
      try {
        console.log('🔍 Fetching user role for:', userId);
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();

        if (error) throw error;
        if (data?.role) {
          console.log('✅ Role fetched from DB:', data.role);
          dispatch(setRole(data.role));
        }
      } catch (error) {
        console.error('❌ Error fetching user role:', error);
      }
    };

    const hydrateSession = (session: { user: User } | null) => {
      console.log('💧 Hydrating session:', session ? 'user exists' : 'no user');
      
      if (session?.user) {
        console.log('👤 Setting user and role');
        dispatch(setUser(session.user));
        applyRoleFromMetadata(session.user);
        // Always set loading to false so UI can proceed
        dispatch(setLoading(false));
        // Fetch the canonical role in the background so UI doesn't hang
        fetchUserRole(session.user.id);
      } else {
        console.log('👻 No user, clearing state and setting loading false');
        dispatch(logout());
        dispatch(setLoading(false));
      }
    };

    const getSession = async () => {
      console.log('🔍 Getting initial session...');
      try {
        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
        );
        
        const {
          data: { session },
        } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        console.log('📊 Initial session result:', session ? 'found' : 'none');
        hydrateSession(session);
      } catch (error) {
        console.error('❌ Error getting session:', error);
        console.log('🔄 Falling back to no session');
        dispatch(setLoading(false));
        hydrateSession(null);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state change:', event);
      if (event === 'SIGNED_IN') {
        hydrateSession(session);
      } else if (event === 'SIGNED_OUT') {
        dispatch(logout());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

