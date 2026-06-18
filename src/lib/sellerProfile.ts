import type { Chocolatier, ProductTag } from '../data/chocolatiers';
import { demoProducts } from '../data/demoCatalog';
import { isInlineImageData } from './browserImageStore';
import type { ShippingPackagingInfo } from './shippingPackaging';
import {
  type SellerVerificationStatus,
  isProductPublic,
  isSellerPublic,
  normalizeSellerVerificationStatus,
} from './sellerVisibility';

export const DEMO_SELLER_PROFILE_SLUG = 'test-chocolatier';
const STORAGE_KEY = 'chocolata:demo-seller-profile';
const PROFILE_INDEX_KEY = 'chocolata:seller-profile-index';
const DEMO_PRODUCTS_KEY = 'chocolata:demo-products';
const DEMO_SELLER_VERIFICATION_KEY = 'chocolata:demo-seller-verification-status';

export interface SellerStoreProfile {
  slug: string;
  status: 'live' | 'offline';
  verificationStatus: SellerVerificationStatus;
  storeName: string;
  tagline: string;
  shortIntro: string;
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
  verificationStatus: 'verified',
  storeName: 'Test Chocolatier',
  tagline: 'Small-batch European chocolates prepared for premium gifting.',
  shortIntro: 'Premium handmade chocolate from Stockholm.',
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

const getProfileStorageKey = (sellerId?: string | null) =>
  sellerId ? `chocolata:seller-profile:${sellerId}` : STORAGE_KEY;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);

export const createSellerProfileSlug = (sellerId?: string | null, storeName?: string) => {
  if (!sellerId || sellerId === '00000000-0000-4000-8000-000000000002') return DEMO_SELLER_PROFILE_SLUG;
  const readable = slugify(storeName || 'seller');
  return `${readable || 'seller'}-${sellerId.slice(0, 8)}`;
};

const normalizeProfile = (profile: Partial<SellerStoreProfile>, sellerId?: string | null): SellerStoreProfile => {
  const storedVerificationStatus = typeof window !== 'undefined' && (!sellerId || sellerId === '00000000-0000-4000-8000-000000000002')
    ? window.localStorage.getItem(DEMO_SELLER_VERIFICATION_KEY)
    : null;
  const next = {
    ...DEFAULT_SELLER_PROFILE,
    ...profile,
    verificationStatus: normalizeSellerVerificationStatus(storedVerificationStatus || profile.verificationStatus),
  };
  const shouldKeepSlug = Boolean(
    profile.slug &&
    (!sellerId || sellerId === '00000000-0000-4000-8000-000000000002' || profile.slug !== DEMO_SELLER_PROFILE_SLUG),
  );
  return {
    ...next,
    slug: shouldKeepSlug ? profile.slug as string : createSellerProfileSlug(sellerId, next.storeName),
    shortIntro: profile.shortIntro || next.tagline,
    specialties: Array.isArray(next.specialties) ? next.specialties : [],
    signatureProducts: Array.isArray(next.signatureProducts) ? next.signatureProducts : [],
    packagingOptions: Array.isArray(next.packagingOptions) ? next.packagingOptions : [],
    galleryImages: Array.isArray(next.galleryImages) ? next.galleryImages : [],
  };
};

export const loadSellerStoreProfile = (sellerId?: string | null): SellerStoreProfile => {
  if (typeof window === 'undefined') return DEFAULT_SELLER_PROFILE;

  try {
    const stored = window.localStorage.getItem(getProfileStorageKey(sellerId));
    if (!stored) return normalizeProfile(DEFAULT_SELLER_PROFILE, sellerId);
    return normalizeProfile(JSON.parse(stored), sellerId);
  } catch {
    return normalizeProfile(DEFAULT_SELLER_PROFILE, sellerId);
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

export const saveSellerStoreProfile = (profile: SellerStoreProfile, sellerId?: string | null) => {
  const nextProfile = normalizeProfile(
    { ...profile, slug: profile.slug || createSellerProfileSlug(sellerId, profile.storeName) },
    sellerId,
  );
  try {
    window.localStorage.setItem(getProfileStorageKey(sellerId), JSON.stringify(nextProfile));
  } catch (error) {
    if (!isQuotaError(error)) throw error;
    window.localStorage.setItem(getProfileStorageKey(sellerId), JSON.stringify(stripInlineProfileImages(nextProfile)));
  }

  try {
    const rawIndex = JSON.parse(window.localStorage.getItem(PROFILE_INDEX_KEY) || '[]');
    const index = Array.isArray(rawIndex) ? rawIndex : [];
    const key = sellerId || nextProfile.slug;
    const nextIndex = [
      { key, sellerId: sellerId || null, slug: nextProfile.slug },
      ...index.filter((item) => item?.key !== key && item?.slug !== nextProfile.slug),
    ];
    window.localStorage.setItem(PROFILE_INDEX_KEY, JSON.stringify(nextIndex));
  } catch {
    // Profile save should not fail if the lightweight lookup index cannot be updated.
  }
};

export const isSellerProfileLive = (profile: SellerStoreProfile = loadSellerStoreProfile()) =>
  profile.status !== 'offline';

export const isSellerStorePublic = (profile: SellerStoreProfile = loadSellerStoreProfile()) =>
  isSellerPublic(profile);

export const isPublicSellerProduct = (
  product: { is_active?: boolean; status?: string },
  profile: SellerStoreProfile = loadSellerStoreProfile(),
) => isProductPublic(product, profile);

export const listSellerStoreProfiles = (): SellerStoreProfile[] => {
  if (typeof window === 'undefined') return [];
  const profiles = new Map<string, SellerStoreProfile>();
  profiles.set(DEMO_SELLER_PROFILE_SLUG, loadSellerStoreProfile());
  try {
    const rawIndex = JSON.parse(window.localStorage.getItem(PROFILE_INDEX_KEY) || '[]');
    if (Array.isArray(rawIndex)) {
      rawIndex.forEach((item) => {
        const profile = loadSellerStoreProfile(item?.sellerId || undefined);
        profiles.set(profile.slug, profile);
      });
    }
  } catch {
    return Array.from(profiles.values());
  }
  return Array.from(profiles.values());
};

export const findSellerStoreProfileBySlug = (slug?: string | null) =>
  listSellerStoreProfiles().find((profile) => profile.slug === slug);

export const sellerProfileFromRow = (row: any): SellerStoreProfile => normalizeProfile({
  slug: row.slug,
  status: row.status,
  verificationStatus: row.verification_status,
  storeName: row.store_name,
  tagline: row.tagline,
  shortIntro: row.short_intro,
  story: row.story,
  country: row.country,
  city: row.city,
  specialties: row.specialties,
  signatureProducts: row.signature_products,
  sustainability: row.sustainability,
  shippingInfo: row.shipping_info,
  deliveryEstimate: row.delivery_estimate,
  packagingOptions: row.packaging_options,
  heatProtection: row.heat_protection,
  giftPackaging: row.gift_packaging,
  summerShipping: row.summer_shipping,
  ecoPackaging: row.eco_packaging,
  logoImage: row.logo_image,
  coverImage: row.cover_image,
  galleryImages: row.gallery_images,
});

export const sellerProfileToRow = (profile: SellerStoreProfile, sellerId: string) => ({
  seller_id: sellerId,
  slug: profile.slug,
  status: profile.status,
  verification_status: profile.verificationStatus,
  store_name: profile.storeName,
  tagline: profile.tagline,
  short_intro: profile.shortIntro,
  story: profile.story,
  country: profile.country,
  city: profile.city,
  specialties: profile.specialties,
  signature_products: profile.signatureProducts,
  sustainability: profile.sustainability,
  shipping_info: profile.shippingInfo,
  delivery_estimate: profile.deliveryEstimate,
  packaging_options: profile.packagingOptions,
  heat_protection: profile.heatProtection,
  gift_packaging: profile.giftPackaging,
  summer_shipping: profile.summerShipping,
  eco_packaging: profile.ecoPackaging,
  logo_image: profile.logoImage,
  cover_image: profile.coverImage,
  gallery_images: profile.galleryImages,
  updated_at: new Date().toISOString(),
});

export const sellerProfileToChocolatier = (
  profile: SellerStoreProfile = loadSellerStoreProfile(),
  options: { includePrivateProducts?: boolean } = {},
): Chocolatier => {
  const sellerProducts = (() => {
    if (typeof window === 'undefined') return [];
    try {
      const parsed = JSON.parse(window.localStorage.getItem(DEMO_PRODUCTS_KEY) || '[]');
      return Array.isArray(parsed)
        ? parsed.filter((product) => {
            const belongsToProfile = !product.maker_slug || product.maker_slug === profile.slug || product.maker_id === profile.slug;
            return belongsToProfile && (options.includePrivateProducts || isPublicSellerProduct(product, profile));
          })
        : [];
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
    slug: profile.slug,
    name: profile.storeName,
    city: profile.city,
    country: profile.country,
    flag: '',
    tagline: profile.shortIntro || profile.tagline,
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
    products: sellerProducts.map((product, index) => ({
      id: product.id || `seller-product-${index + 1}`,
      name: product.name || profile.signatureProducts[index] || 'Chocolate',
      description: product.description || '',
      price: product.price,
      image: product.image_url || profile.galleryImages[index] || profile.coverImage || '',
      tags: (product.tags || product.badges || ['dark']) as ProductTag[],
    })),
  };
};
