import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  role: 'buyer' | 'seller' | 'admin' | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    setRole: (state, action: PayloadAction<'buyer' | 'seller' | 'admin' | null>) => {
      state.role = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
    },
  },
});

export const { setUser, setRole, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;

