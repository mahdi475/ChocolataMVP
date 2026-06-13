-- Allow public/anonymous users to read basic seller information
-- This is needed for displaying "Sold by: [seller name]" on product pages
-- Note: This policy allows reading seller profiles (id, email, full_name) for public display

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read seller profiles" ON public.users;
DROP POLICY IF EXISTS "Authenticated can read seller profiles" ON public.users;

-- Create policies to allow reading seller profiles
CREATE POLICY "Public can read seller profiles" ON public.users
  FOR SELECT
  TO public
  USING (role = 'seller');

-- Also allow authenticated users to read seller profiles
CREATE POLICY "Authenticated can read seller profiles" ON public.users
  FOR SELECT
  TO authenticated
  USING (role = 'seller');

