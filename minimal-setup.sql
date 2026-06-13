-- MINIMAL SQL SETUP FOR REGISTRATION TO WORK
-- Copy and paste this into Supabase SQL Editor and click "Run"

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'admin')) DEFAULT 'buyer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role = 'admin'
  );
$$;

-- Drop existing policies if they exist, then create them
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage users" ON public.users
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);