import { supabase } from './supabaseClient';
import { demoCategories, demoProducts } from '../data/demoCatalog';
import type { Product } from '../components/cards/ProductCard';
import { readPublicDemoSellerProducts } from './marketplaceData';
import { findSellerStoreProfileBySlug, isPublicSellerProduct } from './sellerProfile';

interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface HomepageData {
  products: Product[];
  categories: Category[];
}

let homepageDataCache: HomepageData | null = null;
let homepageDataPromise: Promise<HomepageData> | null = null;

export const invalidateHomepageDataCache = () => {
  homepageDataCache = null;
  homepageDataPromise = null;
};

const isPublicHomepageProduct = (product: Product) => {
  const sellerProfile = findSellerStoreProfileBySlug(product.maker_slug);
  if (sellerProfile) return isPublicSellerProduct(product, sellerProfile);
  return product.is_active !== false && product.status !== 'draft' && product.status !== 'archived';
};

export const getCachedHomepageData = () => homepageDataCache;

export const loadHomepageData = async () => {
  if (homepageDataCache) return homepageDataCache;
  if (homepageDataPromise) return homepageDataPromise;

  homepageDataPromise = Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('categories').select('*').order('display_order', { ascending: true }).order('name', { ascending: true }),
  ])
    .then(([productsResult, categoriesResult]) => {
      if (productsResult.error) {
        throw productsResult.error;
      }

      const sellerProducts = readPublicDemoSellerProducts();
      const loadedProducts = productsResult.data?.length
        ? (productsResult.data as Product[]).filter(isPublicHomepageProduct)
        : demoProducts;
      const mergedProducts = [...sellerProducts, ...loadedProducts.filter((product) => !sellerProducts.some((sellerProduct) => sellerProduct.id === product.id))];
      homepageDataCache = {
        products: mergedProducts.slice(0, 6),
        categories: categoriesResult.data?.length ? categoriesResult.data : demoCategories,
      };
      return homepageDataCache;
    })
    .catch((error) => {
      console.error('Failed to load homepage data:', error);
      const sellerProducts = readPublicDemoSellerProducts();
      homepageDataCache = {
        products: [...sellerProducts, ...demoProducts].slice(0, 6),
        categories: demoCategories,
      };
      return homepageDataCache;
    })
    .finally(() => {
      homepageDataPromise = null;
    });

  return homepageDataPromise;
};

export const prefetchHomepageData = () => {
  void loadHomepageData();
};
