-- ============================================
-- Sample Products Setup for Chocolata MVP
-- ============================================
-- This script inserts sample chocolate products into each category
-- NOTE: You need at least one verified seller user before running this script
-- ============================================

-- First, get a seller user ID (or create a test seller if none exists)
-- This will use the first seller found, or create a test seller
DO $$
DECLARE
  v_seller_id UUID;
  v_auth_user_id UUID;
BEGIN
  -- Try to get an existing verified seller
  SELECT id INTO v_seller_id
  FROM public.users
  WHERE role = 'seller'
  LIMIT 1;

  -- If no seller exists, create a test seller
  -- NOTE: This creates a user in public.users but NOT in auth.users
  -- For a real seller, they should register through the app
  IF v_seller_id IS NULL THEN
    RAISE NOTICE '⚠️  No seller found. Creating a test seller user...';
    
    -- Generate a UUID for the test seller
    v_seller_id := gen_random_uuid();
    
    -- Insert test seller into public.users
    -- NOTE: In production, sellers should register through auth
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (v_seller_id, 'test-seller@chocolata.com', 'Test Chocolate Seller', 'seller')
    ON CONFLICT (id) DO NOTHING
    RETURNING id INTO v_seller_id;
    
    RAISE NOTICE '✅ Test seller created with ID: %', v_seller_id;
    RAISE NOTICE '⚠️  IMPORTANT: This seller is for testing only. Real sellers should register through the app.';
  ELSE
    RAISE NOTICE '✅ Using existing seller with ID: %', v_seller_id;
  END IF;

  -- Insert sample products for each category
  -- Dark Chocolate Products
  INSERT INTO public.products (seller_id, name, description, price, category, stock, image_url, is_active)
  VALUES
    (
      v_seller_id,
      'Midnight Truffle Collection',
      'A luxurious assortment of handcrafted dark chocolate truffles with rich cocoa flavors. Each truffle is made with 70% single-origin dark chocolate and filled with smooth ganache.',
      450.00,
      'Dark Chocolate',
      25,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'Single Origin Dark Bar - 85%',
      'Premium dark chocolate bar made from single-origin Venezuelan cacao. Intense, complex flavors with notes of red fruit and spice.',
      180.00,
      'Dark Chocolate',
      40,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'Dark Chocolate Hazelnut Bark',
      'Artisan dark chocolate bark loaded with roasted hazelnuts and sea salt. Perfect balance of bitter and sweet.',
      220.00,
      'Dark Chocolate',
      30,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    )
  ON CONFLICT DO NOTHING;

  -- Milk Chocolate Products
  INSERT INTO public.products (seller_id, name, description, price, category, stock, image_url, is_active)
  VALUES
    (
      v_seller_id,
      'Gold Dust Hazelnut Bar',
      'Creamy milk chocolate bar with roasted hazelnuts and edible gold dust. A luxurious treat for special occasions.',
      185.00,
      'Milk Chocolate',
      35,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'Classic Milk Chocolate Collection',
      'Traditional milk chocolate bars with smooth, creamy texture. Made with the finest Belgian chocolate.',
      150.00,
      'Milk Chocolate',
      50,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'Milk Chocolate Caramel Squares',
      'Decadent milk chocolate squares filled with rich caramel. Indulgent and satisfying.',
      195.00,
      'Milk Chocolate',
      28,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    )
  ON CONFLICT DO NOTHING;

  -- White Chocolate Products
  INSERT INTO public.products (seller_id, name, description, price, category, stock, image_url, is_active)
  VALUES
    (
      v_seller_id,
      'Ruby Berry Bark',
      'Delicate white chocolate bark with freeze-dried raspberries and white chocolate chips. Beautiful and delicious.',
      220.00,
      'White Chocolate',
      32,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'White Chocolate Macadamia Bars',
      'Premium white chocolate bars with roasted macadamia nuts. Rich, buttery, and perfectly sweet.',
      200.00,
      'White Chocolate',
      38,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'Vanilla Bean White Chocolate',
      'Artisan white chocolate made with real vanilla beans. Smooth, creamy, and aromatic.',
      175.00,
      'White Chocolate',
      45,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    )
  ON CONFLICT DO NOTHING;

  -- Truffles Products
  INSERT INTO public.products (seller_id, name, description, price, category, stock, image_url, is_active)
  VALUES
    (
      v_seller_id,
      'Artisan Truffle Box - 12 Pieces',
      'Hand-rolled chocolate truffles in an elegant gift box. Assorted flavors including dark, milk, and flavored varieties.',
      550.00,
      'Truffles',
      20,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'Espresso Truffles',
      'Rich dark chocolate truffles infused with espresso. Perfect for coffee lovers.',
      280.00,
      'Truffles',
      25,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'Raspberry Champagne Truffles',
      'Luxurious truffles with raspberry ganache and a hint of champagne. Elegant and sophisticated.',
      320.00,
      'Truffles',
      18,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    )
  ON CONFLICT DO NOTHING;

  -- Vegan Products
  INSERT INTO public.products (seller_id, name, description, price, category, stock, image_url, is_active)
  VALUES
    (
      v_seller_id,
      'Vegan Dark Chocolate Bar',
      '100% plant-based dark chocolate bar made with coconut milk. Rich, smooth, and completely dairy-free.',
      165.00,
      'Vegan',
      42,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'Vegan Chocolate Almond Clusters',
      'Crunchy almond clusters coated in vegan dark chocolate. Perfect for a healthy, plant-based treat.',
      195.00,
      'Vegan',
      35,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'Raw Cacao Energy Balls',
      'Organic raw cacao energy balls with dates, almonds, and coconut. No refined sugar, all natural.',
      145.00,
      'Vegan',
      50,
      'https://images.unsplash.com/photo-1606312619070-d48d4e5b3d32?auto=format&fit=crop&q=80&w=800',
      true
    )
  ON CONFLICT DO NOTHING;

  -- Gifts Products
  INSERT INTO public.products (seller_id, name, description, price, category, stock, image_url, is_active)
  VALUES
    (
      v_seller_id,
      'The Velvet Collection Gift Set',
      'An exclusive assortment of our darkest, richest single-origin bars paired with hand-rolled truffles. The perfect gift for the true chocolate aficionado.',
      850.00,
      'Gifts',
      15,
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'Luxury Chocolate Gift Box',
      'Curated selection of premium chocolates in an elegant gift box. Includes dark, milk, and white chocolate varieties.',
      650.00,
      'Gifts',
      22,
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800',
      true
    ),
    (
      v_seller_id,
      'Artisan Chocolate Sampler',
      'A beautiful collection of our finest artisan chocolates. Perfect for gifting or sharing.',
      480.00,
      'Gifts',
      30,
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800',
      true
    )
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Sample products inserted successfully!';
END $$;

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify products were inserted correctly:
-- SELECT p.name, p.category, p.price, p.stock, u.email as seller_email
-- FROM public.products p
-- JOIN public.users u ON p.seller_id = u.id
-- ORDER BY p.category, p.name;

-- Count products by category:
-- SELECT category, COUNT(*) as product_count
-- FROM public.products
-- WHERE is_active = true
-- GROUP BY category
-- ORDER BY category;

