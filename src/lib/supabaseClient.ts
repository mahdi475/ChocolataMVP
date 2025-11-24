import { createClient } from '@supabase/supabase-js';

console.log('--- DEBUG: supabaseClient.ts START ---');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('VITE_SUPABASE_URL:', supabaseUrl ? `Loaded (${supabaseUrl.length} chars)` : 'NOT FOUND');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `Loaded (${supabaseAnonKey.length} chars)` : 'NOT FOUND');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL ERROR: Supabase environment variables are missing.');
  console.error('Please ensure you have a .env.local file in the root directory with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  throw new Error('Missing Supabase URL or Anon Key.');
}

console.log('Creating Supabase client...');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('Supabase client created.');

console.log('--- DEBUG: supabaseClient.ts END ---');

