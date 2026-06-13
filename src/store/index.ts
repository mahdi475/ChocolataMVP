import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer, { persistCartState } from './slices/cartSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    notifications: notificationReducer,
  },
});

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    const state = store.getState();
    persistCartState(state.cart);
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

