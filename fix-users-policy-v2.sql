-- Drop ALL existing policies on users table (including any from previous runs)
-- Using a DO block to drop all policies dynamically in case names don't match exactly
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all existing policies on the users table using pg_policy system catalog
    FOR r IN (
        SELECT pol.polname as policyname
        FROM pg_policy pol
        JOIN pg_class pc ON pol.polrelid = pc.oid
        JOIN pg_namespace pn ON pc.relnamespace = pn.oid
        WHERE pc.relname = 'users' AND pn.nspname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', r.policyname);
    END LOOP;
END $$;

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

-- Create a more permissive policy for insertion during registration
-- This allows insertion when the user is being created
CREATE POLICY "Enable insert during registration" ON public.users
  FOR INSERT WITH CHECK (true);

-- Recreate the read policy
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Recreate the update policy  
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage users" ON public.users
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Create a database function to handle user profile creation
-- This function will be called by a database trigger after auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user profile, ignoring if it already exists (idempotent)
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;