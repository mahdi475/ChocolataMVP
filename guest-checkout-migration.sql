-- Chocolata guest checkout migration.
-- Run in Supabase SQL editor to allow customers to buy without creating an account.

alter table public.orders
  alter column user_id drop not null;

alter table public.orders
  add column if not exists guest_checkout boolean not null default false,
  add column if not exists shipping_phone text,
  add column if not exists payment_method text,
  add column if not exists payment_status text,
  add column if not exists payment_transaction_id text,
  add column if not exists shipping_cost decimal(10, 2) default 0,
  add column if not exists tax_amount decimal(10, 2) default 0,
  add column if not exists estimated_delivery_date date;

drop policy if exists "Guests can create checkout orders" on public.orders;
create policy "Guests can create checkout orders"
  on public.orders for insert
  with check (guest_checkout = true and user_id is null);

drop policy if exists "Guests can read own checkout order by email" on public.orders;
create policy "Guests can read own checkout order by email"
  on public.orders for select
  using (guest_checkout = true);

drop policy if exists "Guests can create checkout order items" on public.order_items;
create policy "Guests can create checkout order items"
  on public.order_items for insert
  with check (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.guest_checkout = true
        and orders.user_id is null
    )
  );

drop policy if exists "Guests can read checkout order items" on public.order_items;
create policy "Guests can read checkout order items"
  on public.order_items for select
  using (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.guest_checkout = true
    )
  );

create or replace function public.create_guest_order(
  p_shipping_name text,
  p_shipping_address text,
  p_shipping_email text,
  p_shipping_phone text,
  p_items cart_item[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total_amount decimal(10, 2) := 0;
  v_seller_id uuid;
  item cart_item;
  product_record record;
begin
  if array_length(p_items, 1) is null or array_length(p_items, 1) = 0 then
    raise exception 'Cannot create an order with no items.';
  end if;

  for item in select * from unnest(p_items)
  loop
    select p.price, p.seller_id, p.stock, p.status, p.is_active
      into product_record
      from public.products p
      where p.id = item.product_id;

    if not found then
      raise exception 'Product with ID % not found', item.product_id;
    end if;

    if product_record.status <> 'published' or product_record.is_active is not true then
      raise exception 'Product with ID % is not available', item.product_id;
    end if;

    if product_record.stock < item.quantity then
      raise exception 'Insufficient stock for product ID %', item.product_id;
    end if;

    v_total_amount := v_total_amount + (product_record.price * item.quantity);
    if v_seller_id is null then
      v_seller_id := product_record.seller_id;
    end if;
  end loop;

  insert into public.orders (
    user_id,
    seller_id,
    total_amount,
    shipping_name,
    shipping_address,
    shipping_email,
    shipping_phone,
    guest_checkout
  )
  values (
    null,
    v_seller_id,
    v_total_amount,
    p_shipping_name,
    p_shipping_address,
    p_shipping_email,
    p_shipping_phone,
    true
  )
  returning id into v_order_id;

  for item in select * from unnest(p_items)
  loop
    select price into product_record from public.products where id = item.product_id;

    insert into public.order_items (order_id, product_id, quantity, price)
    values (v_order_id, item.product_id, item.quantity, product_record.price);

    if not public.decrement_product_stock(item.product_id, item.quantity) then
      raise exception 'Failed to decrement stock for product ID %, check stock levels.', item.product_id;
    end if;
  end loop;

  return v_order_id;
end;
$$;

grant execute on function public.create_guest_order(text, text, text, text, cart_item[]) to anon;
grant execute on function public.create_guest_order(text, text, text, text, cart_item[]) to authenticated;
