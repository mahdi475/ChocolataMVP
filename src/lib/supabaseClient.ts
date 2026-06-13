import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, User } from '@supabase/supabase-js';

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

const demoCustomerUser = (): User => ({
  id: DEMO_CUSTOMER_ID,
  aud: 'authenticated',
  role: 'authenticated',
  email: DEMO_CUSTOMER_EMAIL,
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: { full_name: 'Test Customer', role: 'buyer' },
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_anonymous: false,
});

const demoSession = () => {
  const raw = window.localStorage.getItem('chocolata:demo-session');
  if (!raw) return null;
  const user = demoCustomerUser();
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
  const query: any = {
    select: () => query,
    eq: () => query,
    neq: () => query,
    order: () => query,
    limit: () => query,
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    single: async () => {
      if (table === 'users') {
        return {
          data: {
            id: DEMO_CUSTOMER_ID,
            email: DEMO_CUSTOMER_EMAIL,
            full_name: 'Test Customer',
            role: 'buyer',
            created_at: new Date().toISOString(),
          },
          error: null,
        };
      }
      return { data: null, error: { message: 'Demo backend has no live record.' } };
    },
    then: (resolve: any) => {
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
      if (email.toLowerCase() !== DEMO_CUSTOMER_EMAIL || password !== DEMO_CUSTOMER_PASSWORD) {
        return { data: { user: null, session: null }, error: { message: 'Invalid demo customer credentials' } };
      }
      window.localStorage.setItem('chocolata:demo-session', 'customer');
      notifyDemoAuthListeners('SIGNED_IN');
      return { data: { user: demoCustomerUser(), session: demoSession() }, error: null };
    },
    signUp: async ({ email, password }: any) => {
      if (email.toLowerCase() !== DEMO_CUSTOMER_EMAIL || password !== DEMO_CUSTOMER_PASSWORD) {
        return { data: { user: null, session: null }, error: { message: 'Demo mode only supports customer@test.com' } };
      }
      window.localStorage.setItem('chocolata:demo-session', 'customer');
      notifyDemoAuthListeners('SIGNED_IN');
      return { data: { user: demoCustomerUser(), session: demoSession() }, error: null };
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

