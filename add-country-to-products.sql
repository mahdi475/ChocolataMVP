-- Add country column to products table
-- This allows products to have a country of origin attribute

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS country TEXT;

-- Add a comment to explain the column
COMMENT ON COLUMN public.products.country IS 'Country of origin for the product (e.g., "Sweden", "Belgium", "Switzerland")';

-- Create an index for better query performance when filtering by country
CREATE INDEX IF NOT EXISTS idx_products_country ON public.products(country) WHERE country IS NOT NULL;

-- Optional: Add a check constraint to ensure country values are valid (if you want to restrict to specific countries)
-- Uncomment and modify the list as needed:
-- ALTER TABLE public.products 
-- ADD CONSTRAINT check_valid_country 
-- CHECK (country IS NULL OR country IN ('Sweden', 'Belgium', 'Switzerland', 'France', 'Italy', 'Germany', 'UK', 'USA', 'Ecuador', 'Ghana', 'Madagascar', 'Venezuela', 'Peru', 'Dominican Republic', 'Other'));


