import { supabase } from './supabaseClient';

export async function ensureTablesExist() {
  try {
    // Test if users table exists
    const { error: testError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (testError && testError.message.includes('relation "public.users" does not exist')) {
      console.log('🔧 Creating database tables...');
      
      // Create the essential tables through RPC call
      const setupSQL = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          full_name TEXT,
          role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'admin')) DEFAULT 'buyer',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can read own data" ON public.users
          FOR SELECT USING (auth.uid() = id);

        CREATE POLICY "Users can insert own data" ON public.users
          FOR INSERT WITH CHECK (auth.uid() = id);

        CREATE POLICY "Users can update own data" ON public.users
          FOR UPDATE USING (auth.uid() = id);
      `;

      // Try to execute setup SQL
      const { error: sqlError } = await supabase.rpc('exec_sql', { sql: setupSQL });
      
      if (sqlError) {
        console.error('❌ Failed to create tables:', sqlError);
        throw new Error('Could not create database tables. Please run the SQL setup manually in Supabase.');
      }

      console.log('✅ Database tables created successfully');
      return true;
    }

    console.log('✅ Database tables already exist');
    return true;
  } catch (error) {
    console.error('❌ Database setup error:', error);
    return false;
  }
}