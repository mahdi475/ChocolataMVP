import type { CartItem } from '../store/slices/cartSlice';

const GUEST_ORDERS_KEY = 'chocolata:guest-orders';

export interface GuestOrderRecord {
  id: string;
  user_id: string | null;
  total_amount: number;
  status: string;
  shipping_name: string;
  shipping_address: string;
  shipping_email: string;
  shipping_phone?: string;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
  items: CartItem[];
}

const readGuestOrders = (): GuestOrderRecord[] => {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(GUEST_ORDERS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGuestOrders = (orders: GuestOrderRecord[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(orders));
};

export const createGuestOrder = (order: Omit<GuestOrderRecord, 'id' | 'created_at' | 'status'>) => {
  const nextOrder: GuestOrderRecord = {
    ...order,
    id: `guest-${crypto.randomUUID()}`,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  writeGuestOrders([nextOrder, ...readGuestOrders()]);
  return nextOrder;
};

export const findGuestOrder = (id?: string | null) =>
  readGuestOrders().find((order) => order.id === id) || null;
