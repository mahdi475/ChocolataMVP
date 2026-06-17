import type { Product } from '../components/cards/ProductCard';
import {
  DEFAULT_SELLER_PROFILE,
  DEMO_SELLER_PROFILE_SLUG,
  isPublicSellerProduct,
  isSellerProfileLive,
  loadSellerStoreProfile,
} from './sellerProfile';
import { isInlineImageData } from './browserImageStore';

const DEMO_PRODUCTS_KEY = 'chocolata:demo-products';

export const DEMO_SELLER_ID = '00000000-0000-4000-8000-000000000002';

export const getDemoSellerProfile = () => {
  try {
    return loadSellerStoreProfile();
  } catch {
    return DEFAULT_SELLER_PROFILE;
  }
};

export const normalizeSellerProduct = (product: Partial<Product> & { id?: string; seller_id?: string }): Product => {
  const profile = getDemoSellerProfile();
  const id = product.id || `demo-product-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const tags = Array.from(new Set([...(product.tags || []), ...(product.badges || [])].filter(Boolean)));

  return {
    id,
    name: product.name || 'Untitled chocolate',
    description: product.description || '',
    price: Number(product.price || 0),
    image_url: product.image_url || '',
    gallery_images: product.gallery_images || [],
    category: product.category || tags[0] || 'Chocolate Bars',
    country: product.country || profile.country,
    city: product.city || profile.city,
    stock: product.stock ?? 0,
    created_at: product.created_at || new Date().toISOString(),
    seller_id: product.seller_id || DEMO_SELLER_ID,
    maker_id: product.maker_id || DEMO_SELLER_PROFILE_SLUG,
    maker_name: product.maker_name || profile.storeName,
    maker_slug: product.maker_slug || DEMO_SELLER_PROFILE_SLUG,
    badges: tags,
    tags,
    is_active: product.is_active ?? true,
    status: product.status || 'published',
    is_gift_box: product.is_gift_box || tags.some((tag) => tag.toLowerCase().includes('gift')),
    is_organic: product.is_organic || tags.some((tag) => tag.toLowerCase() === 'organic'),
    is_vegan: product.is_vegan || tags.some((tag) => tag.toLowerCase() === 'vegan'),
  };
};

export const readDemoSellerProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
    return Array.isArray(raw) ? raw.map((product) => normalizeSellerProduct(product)) : [];
  } catch {
    return [];
  }
};

export const readPublicDemoSellerProducts = (): Product[] =>
  isSellerProfileLive() ? readDemoSellerProducts().filter(isPublicSellerProduct) : [];

const stripInlineProductImages = (product: Product): Product => ({
  ...product,
  image_url: isInlineImageData(product.image_url) ? '' : product.image_url,
  gallery_images: (product.gallery_images || []).filter((image) => !isInlineImageData(image)),
});

const isQuotaError = (error: unknown) =>
  error instanceof DOMException && (
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
  );

export const writeDemoSellerProducts = (products: Product[]) => {
  const normalizedProducts = products.map(normalizeSellerProduct);
  try {
    window.localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(normalizedProducts));
  } catch (error) {
    if (!isQuotaError(error)) throw error;
    window.localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(normalizedProducts.map(stripInlineProductImages)));
  }
};

export const upsertDemoSellerProduct = (product: Partial<Product> & { id?: string; seller_id?: string }) => {
  const normalized = normalizeSellerProduct(product);
  const products = readDemoSellerProducts();
  const next = products.some((item) => item.id === normalized.id)
    ? products.map((item) => (item.id === normalized.id ? normalized : item))
    : [normalized, ...products];
  writeDemoSellerProducts(next);
  return normalized;
};
