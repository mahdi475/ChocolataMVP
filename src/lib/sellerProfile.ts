import type { Chocolatier } from '../data/chocolatiers';
import { demoProducts } from '../data/demoCatalog';
import { isInlineImageData } from './browserImageStore';
import type { ShippingPackagingInfo } from './shippingPackaging';

export const DEMO_SELLER_PROFILE_SLUG = 'test-chocolatier';
const STORAGE_KEY = 'chocolata:demo-seller-profile';
const DEMO_PRODUCTS_KEY = 'chocolata:demo-products';

export interface SellerStoreProfile {
  slug: string;
  status: 'live' | 'offline';
  storeName: string;
  tagline: string;
  story: string;
  country: string;
  city: string;
  specialties: string[];
  signatureProducts: string[];
  sustainability: string;
  shippingInfo: string;
  deliveryEstimate: string;
  packagingOptions: string[];
  heatProtection: boolean;
  giftPackaging: boolean;
  summerShipping: boolean;
  ecoPackaging: boolean;
  logoImage: string;
  coverImage: string;
  galleryImages: string[];
}

export const DEFAULT_SELLER_PROFILE: SellerStoreProfile = {
  slug: DEMO_SELLER_PROFILE_SLUG,
  status: 'live',
  storeName: 'Test Chocolatier',
  tagline: 'Small-batch European chocolates prepared for premium gifting.',
  story:
    'Test Chocolatier is a demo seller profile for shaping the Chocolata seller experience. It shows how a maker can present their story, shipping standards, sustainability values, and signature products to customers.',
  country: 'Sweden',
  city: 'Stockholm',
  specialties: ['Chocolate Bars', 'Gift Boxes', 'Truffles'],
  signatureProducts: ['Velvet Noir Bar', 'Nordic Gift Box'],
  sustainability: 'Recyclable packaging, careful sourcing, and small-batch production.',
  shippingInfo: 'Ships from Stockholm with insulated packaging when needed.',
  deliveryEstimate: '2-5',
  packagingOptions: ['Gift ready', 'Eco packaging', 'Heat protection'],
  heatProtection: true,
  giftPackaging: true,
  summerShipping: true,
  ecoPackaging: true,
  logoImage: '',
  coverImage: '',
  galleryImages: [],
};

export const loadSellerStoreProfile = (): SellerStoreProfile => {
  if (typeof window === 'undefined') return DEFAULT_SELLER_PROFILE;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SELLER_PROFILE;
    return { ...DEFAULT_SELLER_PROFILE, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SELLER_PROFILE;
  }
};

const isQuotaError = (error: unknown) =>
  error instanceof DOMException && (
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
  );

const stripInlineProfileImages = (profile: SellerStoreProfile): SellerStoreProfile => ({
  ...profile,
  logoImage: isInlineImageData(profile.logoImage) ? '' : profile.logoImage,
  coverImage: isInlineImageData(profile.coverImage) ? '' : profile.coverImage,
  galleryImages: profile.galleryImages.filter((image) => !isInlineImageData(image)),
});

export const saveSellerStoreProfile = (profile: SellerStoreProfile) => {
  const nextProfile = { ...profile, slug: DEMO_SELLER_PROFILE_SLUG };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
  } catch (error) {
    if (!isQuotaError(error)) throw error;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stripInlineProfileImages(nextProfile)));
  }
};

export const isSellerProfileLive = (profile: SellerStoreProfile = loadSellerStoreProfile()) =>
  profile.status !== 'offline';

export const isPublicSellerProduct = (product: { is_active?: boolean; status?: string }) =>
  product.is_active !== false && product.status !== 'draft';

export const sellerProfileToChocolatier = (profile: SellerStoreProfile = loadSellerStoreProfile()): Chocolatier => {
  const sellerProducts = (() => {
    if (typeof window === 'undefined') return [];
    try {
      const parsed = JSON.parse(window.localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(isPublicSellerProduct) : [];
    } catch {
      return [];
    }
  })();
  const shippingPackaging: ShippingPackagingInfo = {
    shipsFromCountry: profile.country,
    shipsFromCity: profile.city,
    deliveryEstimate: profile.deliveryEstimate,
    domesticShipping: true,
    euShipping: true,
    heatProtection: profile.heatProtection,
    giftPackaging: profile.giftPackaging,
    summerShipping: profile.summerShipping,
    ecoPackaging: profile.ecoPackaging,
  };

  return {
    slug: DEMO_SELLER_PROFILE_SLUG,
    name: profile.storeName,
    city: profile.city,
    country: profile.country,
    flag: '',
    tagline: profile.tagline,
    story: profile.story,
    portrait: profile.coverImage || profile.logoImage || demoProducts[0]?.image_url || '',
    logoImage: profile.logoImage,
    coverImage: profile.coverImage,
    galleryImages: profile.galleryImages,
    tags: profile.specialties,
    values: [
      { title: 'Sustainability', description: profile.sustainability },
      { title: 'Shipping', description: profile.shippingInfo },
      { title: 'Packaging', description: profile.packagingOptions.join(', ') },
      { title: 'Craft', description: profile.signatureProducts.join(', ') },
    ],
    shippingPackaging,
    products: (sellerProducts.length ? sellerProducts : demoProducts.slice(0, 4)).map((product, index) => ({
      id: sellerProducts.length ? product.id : `test-chocolatier-${index + 1}`,
      name: sellerProducts.length ? product.name : profile.signatureProducts[index] || product.name,
      description: product.description || '',
      price: product.price,
      image: product.image_url || profile.galleryImages[index] || profile.coverImage || '',
      tags: ['dark'],
    })),
  };
};
