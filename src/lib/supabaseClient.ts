import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import {
  readDemoSellerProducts,
  readPublicDemoSellerProducts,
  upsertDemoSellerProduct,
  writeDemoSellerProducts,
} from './marketplaceData';

console.log('--- DEBUG: supabaseClient.ts START ---');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isDemoSupabaseConfig =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes('example.supabase.co') ||
  supabaseAnonKey.includes('your_supabase');

console.log('VITE_SUPABASE_URL:', supabaseUrl ? `Loaded (${supabaseUrl.length} chars)` : 'NOT FOUND');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `Loaded (${supabaseAnonKey.length} chars)` : 'NOT FOUND');

const DEMO_CUSTOMER_EMAIL = 'customer@test.com';
const DEMO_CUSTOMER_PASSWORD = 'Test1234!';
const DEMO_CUSTOMER_ID = '00000000-0000-4000-8000-000000000001';
const DEMO_SELLER_EMAIL = 'seller@test.com';
const DEMO_SELLER_PASSWORD = 'Test1234!';
const DEMO_SELLER_ID = '00000000-0000-4000-8000-000000000002';

type DemoAccount = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: 'buyer' | 'seller';
  sessionKey: 'customer' | 'seller';
};

const demoAccounts: DemoAccount[] = [
  {
    id: DEMO_CUSTOMER_ID,
    email: DEMO_CUSTOMER_EMAIL,
    password: DEMO_CUSTOMER_PASSWORD,
    fullName: 'Test Customer',
    role: 'buyer',
    sessionKey: 'customer',
  },
  {
    id: DEMO_SELLER_ID,
    email: DEMO_SELLER_EMAIL,
    password: DEMO_SELLER_PASSWORD,
    fullName: 'Test Chocolatier',
    role: 'seller',
    sessionKey: 'seller',
  },
];

const getDemoAccountBySession = () => {
  const raw = window.localStorage.getItem('chocolata:demo-session');
  return demoAccounts.find((account) => account.sessionKey === raw) || null;
};

const getDemoAccountByCredentials = (email: string, password: string) =>
  demoAccounts.find((account) => account.email === email.toLowerCase() && account.password === password) || null;

const demoUser = (account: DemoAccount): User => ({
  id: account.id,
  aud: 'authenticated',
  role: 'authenticated',
  email: account.email,
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { full_name: account.fullName, role: account.role },
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_anonymous: false,
});

const demoSession = () => {
  const account = getDemoAccountBySession();
  if (!account) return null;
  const user = demoUser(account);
  return {
    access_token: 'demo-access-token',
    refresh_token: 'demo-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user,
  };
};

const demoAuthListeners = new Set<(event: string, session: ReturnType<typeof demoSession>) => void>();

const notifyDemoAuthListeners = (event: string) => {
  const session = demoSession();
  demoAuthListeners.forEach((callback) => callback(event, session));
};

const createDemoQuery = (table: string) => {
  let filters: Array<{ column: string; value: any }> = [];
  const query: any = {
    select: () => query,
    eq: (column: string, value: any) => {
      filters.push({ column, value });
      return query;
    },
    neq: () => query,
    order: () => query,
    limit: () => query,
    insert: async (payload: any) => {
      if (table === 'products') {
        const rows = Array.isArray(payload) ? payload : [payload];
        const inserted = rows.map((row) => upsertDemoSellerProduct(row));
        return { data: Array.isArray(payload) ? inserted : inserted[0], error: null };
      }
      return { data: null, error: null };
    },
    update: (payload: any) => ({
      eq: async (column: string, value: any) => {
        if (table === 'products') {
          const current = readDemoSellerProducts().find((product: any) => product[column] === value);
          const updated = current ? upsertDemoSellerProduct({ ...current, ...payload }) : null;
          return { data: updated, error: null };
        }
        return { data: null, error: null };
      },
    }),
    delete: () => ({
      eq: async (column: string, value: any) => {
        if (table === 'products') {
          writeDemoSellerProducts(readDemoSellerProducts().filter((product: any) => product[column] !== value));
        }
        return { data: null, error: null };
      },
    }),
    single: async () => {
      if (table === 'products') {
        const products = readDemoSellerProducts();
        const product = products.find((item: any) => filters.every((filter) => item[filter.column] === filter.value));
        return product
          ? { data: product, error: null }
          : { data: null, error: { message: 'Demo product not found.' } };
      }
      if (table === 'users') {
        const account = getDemoAccountBySession() || demoAccounts[0];
        return {
          data: {
            id: account.id,
            email: account.email,
            full_name: account.fullName,
            role: account.role,
            created_at: new Date().toISOString(),
          },
          error: null,
        };
      }
      if (table === 'seller_verifications') {
        const account = getDemoAccountBySession();
        if (account?.role === 'seller') {
          return {
            data: {
              id: 'demo-seller-verification',
              user_id: account.id,
              status: 'approved',
              document_url: null,
              admin_notes: null,
              created_at: new Date().toISOString(),
              reviewed_at: new Date().toISOString(),
            },
            error: null,
          };
        }
      }
      return { data: null, error: { message: 'Demo backend has no live record.' } };
    },
    then: (resolve: any) => {
      if (table === 'products') {
        const publicOnly = filters.some((filter) => filter.column === 'is_active' && filter.value === true);
        let products = publicOnly ? readPublicDemoSellerProducts() : readDemoSellerProducts();
        products = products.filter((item: any) => filters.every((filter) => {
          if (filter.column === 'is_active') return item.is_active === filter.value;
          if (filter.column === 'status') return item.status === filter.value;
          return item[filter.column] === filter.value;
        }));
        return Promise.resolve({ data: products, error: null, count: products.length }).then(resolve);
      }
      const empty = { data: [], error: null, count: 0 };
      return Promise.resolve(empty).then(resolve);
    },
  };
  return query;
};

const createDemoSupabaseClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: demoSession() }, error: null }),
    getUser: async () => ({ data: { user: demoSession()?.user || null }, error: null }),
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const account = getDemoAccountByCredentials(email, password);
      if (!account) {
        return { data: { user: null, session: null }, error: { message: 'Invalid demo account credentials' } };
      }
      window.localStorage.setItem('chocolata:demo-session', account.sessionKey);
      notifyDemoAuthListeners('SIGNED_IN');
      return { data: { user: demoUser(account), session: demoSession() }, error: null };
    },
    signUp: async ({ email, password }: any) => {
      const account = getDemoAccountByCredentials(email, password);
      if (!account) {
        return { data: { user: null, session: null }, error: { message: 'Demo mode only supports the configured test accounts' } };
      }
      window.localStorage.setItem('chocolata:demo-session', account.sessionKey);
      notifyDemoAuthListeners('SIGNED_IN');
      return { data: { user: demoUser(account), session: demoSession() }, error: null };
    },
    signOut: async () => {
      window.localStorage.removeItem('chocolata:demo-session');
      notifyDemoAuthListeners('SIGNED_OUT');
      return { error: null };
    },
    onAuthStateChange: (callback: any) => {
      demoAuthListeners.add(callback);
      setTimeout(() => callback(demoSession() ? 'SIGNED_IN' : 'SIGNED_OUT', demoSession()), 0);
      return { data: { subscription: { unsubscribe: () => demoAuthListeners.delete(callback) } } };
    },
  },
  from: (table: string) => createDemoQuery(table),
  rpc: async () => ({ data: null, error: { message: 'Demo backend does not create live orders.' } }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: { message: 'Demo storage unavailable.' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
  functions: {
    invoke: async () => ({ data: null, error: null }),
  },
});

console.log('Creating Supabase client...');
export const supabase = isDemoSupabaseConfig
  ? (createDemoSupabaseClient() as unknown as SupabaseClient)
  : createClient(supabaseUrl, supabaseAnonKey);
console.log('Supabase client created.');

console.log('--- DEBUG: supabaseClient.ts END ---');

