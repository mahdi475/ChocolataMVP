import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, updateQuantity, clearCart } from '../store/slices/cartSlice';
import type { RootState } from '../store';
import type { CartItem } from '../store/slices/cartSlice';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const addToCart = (product: Omit<CartItem, 'id' | 'quantity'>) => {
    dispatch(addItem({ ...product, id: `${product.productId}-${Date.now()}`, quantity: 1 }));
  };
  const removeFromCart = (productId: string) => dispatch(removeItem(productId));
  const setQuantity = (productId: string, quantity: number) => dispatch(updateQuantity({ productId, quantity }));
  const clear = () => dispatch(clearCart());

  const { total, count } = useMemo(() => {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    return { total, count };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, setQuantity, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
};
