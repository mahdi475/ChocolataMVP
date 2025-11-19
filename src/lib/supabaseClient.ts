import { createClient } from '@supabase/supabase-js';

// 🔍 FULL DEBUG MODE
console.log('='.repeat(80));
console.log('🔍 SUPABASE CLIENT DEBUG - START');
console.log('='.repeat(80));

// Check all environment variables
console.log('📦 All import.meta.env keys:', Object.keys(import.meta.env));
console.log('📦 Full import.meta.env:', JSON.stringify(import.meta.env, null, 2));

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🎯 TARGET VARIABLES:');
console.log('├─ VITE_SUPABASE_URL:', supabaseUrl);
console.log('├─ VITE_SUPABASE_URL type:', typeof supabaseUrl);
console.log('├─ VITE_SUPABASE_URL length:', supabaseUrl?.length || 0);
console.log('├─ VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `EXISTS (${supabaseAnonKey.length} chars)` : 'MISSING');
console.log('└─ VITE_SUPABASE_ANON_KEY type:', typeof supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ CRITICAL ERROR: Missing Supabase environment variables!');
  console.error('📝 Check .env file exists in project root');
  console.error('📝 Check .env file has correct format (no spaces after =)');
  console.error('📝 Restart dev server after creating .env file');
  console.log('='.repeat(80));
  throw new Error('Missing Supabase environment variables. Check .env file and restart server.');
}

console.log('\n✅ Environment variables loaded successfully!');
console.log('🚀 Creating Supabase client...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase client created successfully!');
console.log('='.repeat(80));
console.log('🔍 SUPABASE CLIENT DEBUG - END');
console.log('='.repeat(80));

// Temporary: expose supabase client for manual debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
  console.log('🐞 Debug: window.supabase is available for manual queries');
}

