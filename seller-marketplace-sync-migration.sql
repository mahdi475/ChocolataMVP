-- Chocolata seller-to-public marketplace sync migration.
-- Run in Supabase SQL editor before relying on the new verification/product statuses in production.

alter table public.seller_verifications
  drop constraint if exists seller_verifications_status_check;

alter table public.seller_verifications
  add constraint seller_verifications_status_check
  check (status in ('pending', 'approved', 'pending_verification', 'verified', 'rejected', 'suspended'));

alter table public.products
  add column if not exists status text default 'published',
  add column if not exists gallery_images text[] default '{}',
  add column if not exists tags text[] default '{}',
  add column if not exists badges text[] default '{}',
  add column if not exists ingredients text[] default '{}',
  add column if not exists allergens text[] default '{}',
  add column if not exists maker_id text,
  add column if not exists maker_slug text,
  add column if not exists maker_name text,
  add column if not exists city text,
  add column if not exists country text;

alter table public.products
  drop constraint if exists products_status_check;

alter table public.products
  add constraint products_status_check
  check (status in ('draft', 'published', 'archived', 'out_of_stock'));

create table if not exists public.seller_profiles (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.users(id) on delete cascade unique not null,
  slug text unique not null,
  status text default 'offline' check (status in ('live', 'offline')),
  verification_status text default 'pending_verification'
    check (verification_status in ('pending_verification', 'verified', 'rejected', 'suspended')),
  store_name text not null,
  tagline text,
  short_intro text,
  story text,
  country text,
  city text,
  specialties text[] default '{}',
  signature_products text[] default '{}',
  sustainability text,
  shipping_info text,
  delivery_estimate text,
  shipping_estimate text,
  packaging_options text[] default '{}',
  heat_protection boolean default false,
  gift_packaging boolean default false,
  summer_shipping boolean default false,
  eco_packaging boolean default false,
  logo_image text,
  cover_image text,
  gallery_images text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.seller_profiles enable row level security;

drop policy if exists "Public can view live verified seller profiles" on public.seller_profiles;
create policy "Public can view live verified seller profiles"
  on public.seller_profiles for select
  using (status = 'live' and verification_status = 'verified');

drop policy if exists "Sellers can manage own seller profile" on public.seller_profiles;
create policy "Sellers can manage own seller profile"
  on public.seller_profiles for all
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

drop policy if exists "Public can view published products from live verified sellers" on public.products;
create policy "Public can view published products from live verified sellers"
  on public.products for select
  using (
    status = 'published'
    and is_active = true
    and exists (
      select 1
      from public.seller_profiles sp
      where sp.seller_id = products.seller_id
        and sp.status = 'live'
        and sp.verification_status = 'verified'
    )
  );

drop policy if exists "Sellers can manage own products" on public.products;
create policy "Sellers can manage own products"
  on public.products for all
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);
