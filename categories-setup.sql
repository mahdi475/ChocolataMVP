-- ============================================
-- Categories Setup for Chocolata MVP
-- ============================================
-- This script adds the slug column to categories table (if missing)
-- and inserts all the chocolate categories used in the "Explore by Taste" section
-- ============================================

-- First, check if slug column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'categories' 
    AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN slug TEXT;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug_unique ON public.categories(slug) WHERE slug IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
  END IF;
END $$;

-- Add icon field for category icons (optional, for future use)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'categories' 
    AND column_name = 'icon'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN icon TEXT;
  END IF;
END $$;

-- Add display_order field for sorting categories in UI
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'categories' 
    AND column_name = 'display_order'
  ) THEN
    ALTER TABLE public.categories ADD COLUMN display_order INTEGER DEFAULT 0;
    CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);
  END IF;
END $$;

-- Insert or update categories for "Explore by Taste" section
-- Using INSERT ... ON CONFLICT to handle existing categories gracefully
-- Handles conflicts by name (which has UNIQUE constraint)

-- Dark Chocolate
INSERT INTO public.categories (name, slug, description, display_order, icon)
VALUES (
  'Dark Chocolate',
  'dark',
  'Rich, intense dark chocolate bars and treats with high cocoa content',
  1,
  'coffee'
)
ON CONFLICT (name) DO UPDATE SET
  slug = COALESCE(categories.slug, EXCLUDED.slug),
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  icon = EXCLUDED.icon;

-- Milk Chocolate
INSERT INTO public.categories (name, slug, description, display_order, icon)
VALUES (
  'Milk Chocolate',
  'milk',
  'Creamy and smooth milk chocolate delights',
  2,
  'heart'
)
ON CONFLICT (name) DO UPDATE SET
  slug = COALESCE(categories.slug, EXCLUDED.slug),
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  icon = EXCLUDED.icon;

-- White Chocolate
INSERT INTO public.categories (name, slug, description, display_order, icon)
VALUES (
  'White Chocolate',
  'white',
  'Sweet and velvety white chocolate creations',
  3,
  'star'
)
ON CONFLICT (name) DO UPDATE SET
  slug = COALESCE(categories.slug, EXCLUDED.slug),
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  icon = EXCLUDED.icon;

-- Truffles
INSERT INTO public.categories (name, slug, description, display_order, icon)
VALUES (
  'Truffles',
  'truffles',
  'Handcrafted chocolate truffles with luxurious fillings',
  4,
  'truffle'
)
ON CONFLICT (name) DO UPDATE SET
  slug = COALESCE(categories.slug, EXCLUDED.slug),
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  icon = EXCLUDED.icon;

-- Vegan
INSERT INTO public.categories (name, slug, description, display_order, icon)
VALUES (
  'Vegan',
  'vegan',
  'Plant-based chocolate options without dairy or animal products',
  5,
  'leaf'
)
ON CONFLICT (name) DO UPDATE SET
  slug = COALESCE(categories.slug, EXCLUDED.slug),
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  icon = EXCLUDED.icon;

-- Gifts
INSERT INTO public.categories (name, slug, description, display_order, icon)
VALUES (
  'Gifts',
  'gifts',
  'Curated gift sets and special collections perfect for gifting',
  6,
  'gift'
)
ON CONFLICT (name) DO UPDATE SET
  slug = COALESCE(categories.slug, EXCLUDED.slug),
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  icon = EXCLUDED.icon;

-- Handle case where categories table uses name as unique constraint instead of slug
-- Update existing categories that might not have slugs
UPDATE public.categories
SET slug = LOWER(REPLACE(name, ' ', '-'))
WHERE slug IS NULL;

-- Ensure all categories have display_order set
UPDATE public.categories
SET display_order = 99
WHERE display_order IS NULL;

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify categories were inserted correctly:
-- SELECT id, name, slug, description, display_order FROM public.categories ORDER BY display_order;

