import artisanDarkBars from '../assets/products/artisan-dark-bars.png';
import luxuryPralineBox from '../assets/products/luxury-praline-box.png';
import handmadeTruffles from '../assets/products/handmade-truffles.png';
import chocolatierHands from '../assets/products/chocolatier-hands.png';
import heroTruffles from '../assets/collections/hero-truffles.png';
import tastingFlight from '../assets/collections/tasting-flight.png';
import celebrationBonbons from '../assets/collections/celebration-bonbons.png';
import romancePralines from '../assets/collections/romance-pralines.png';
import ecoPackaging from '../assets/sustainability/eco-packaging.png';
import type { Product } from '../components/cards/ProductCard';
import type { ShippingPackagingInfo } from '../lib/shippingPackaging';

export interface DemoCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MakerProfile {
  id: string;
  slug: string;
  name: string;
  email: string;
  city: string;
  country: string;
  specialty: string;
  story: string;
  created_at: string;
  image_url: string;
}

export interface PremiumProduct extends Product {
  maker_id: string;
  maker_name: string;
  maker_slug: string;
  city: string;
  rating: number;
  reviews: number;
  badges: string[];
  cacao_percentage?: number;
  is_vegan?: boolean;
  is_organic?: boolean;
  is_gift_box?: boolean;
  is_popular?: boolean;
  ingredients: string[];
  allergens: string[];
  weight: string;
  shipping_info: string;
  shippingPackaging?: ShippingPackagingInfo;
  story: string;
  gallery: string[];
}

export const demoCategories: DemoCategory[] = [
  { id: 'demo-cat-dark', name: 'Dark Chocolate', slug: 'dark' },
  { id: 'demo-cat-milk', name: 'Milk Chocolate', slug: 'milk' },
  { id: 'demo-cat-truffles', name: 'Truffles', slug: 'truffles' },
  { id: 'demo-cat-vegan', name: 'Vegan', slug: 'vegan' },
  { id: 'demo-cat-gifts', name: 'Gifts', slug: 'gifts' },
];

export const demoMakers: MakerProfile[] = [
  {
    id: 'maison-deluxe',
    slug: 'maison-deluxe',
    name: 'Maison DeLuxe',
    email: 'studio@maison-deluxe.demo',
    city: 'Brussels',
    country: 'Belgium',
    specialty: 'Pralines and sculptural bonbons',
    story: 'A Brussels atelier known for fine shells, polished ganaches, and quiet luxury gifting.',
    created_at: '2022-03-01T10:00:00.000Z',
    image_url: luxuryPralineBox,
  },
  {
    id: 'edelkakao',
    slug: 'edelkakao',
    name: 'EdelKakao',
    email: 'hello@edelkakao.demo',
    city: 'Vienna',
    country: 'Austria',
    specialty: 'Single-origin dark chocolate',
    story: 'Bean-to-bar makers focused on origin character, clean roasts, and cacao-forward tasting flights.',
    created_at: '2021-11-14T10:00:00.000Z',
    image_url: artisanDarkBars,
  },
  {
    id: 'atelier-du-cacao',
    slug: 'atelier-du-cacao',
    name: 'Atelier du Cacao',
    email: 'bonjour@atelier-cacao.demo',
    city: 'Lyon',
    country: 'France',
    specialty: 'Truffles and French ganache',
    story: 'A Lyon workshop balancing classic technique with floral, tea, and patisserie-inspired fillings.',
    created_at: '2020-06-21T10:00:00.000Z',
    image_url: chocolatierHands,
  },
  {
    id: 'alpenschoggi',
    slug: 'alpenschoggi',
    name: 'AlpenSchoggi',
    email: 'servus@alpenschoggi.demo',
    city: 'Zurich',
    country: 'Switzerland',
    specialty: 'Creamy alpine milk chocolate',
    story: 'Swiss makers crafting silky milk chocolate, hazelnut pralines, and generous family gift boxes.',
    created_at: '2019-09-09T10:00:00.000Z',
    image_url: romancePralines,
  },
];

export const demoProducts: PremiumProduct[] = [
  {
    id: 'demo-origin-noir-72',
    name: 'Origin Noir 72% Bar',
    description: 'A deep, balanced dark bar with red fruit, roasted nut, and long cocoa finish.',
    price: 149,
    image_url: artisanDarkBars,
    category: 'Dark Chocolate',
    country: 'Austria',
    city: 'Vienna',
    stock: 18,
    created_at: '2026-01-10T10:00:00.000Z',
    seller_id: 'edelkakao',
    maker_id: 'edelkakao',
    maker_name: 'EdelKakao',
    maker_slug: 'edelkakao',
    rating: 4.9,
    reviews: 128,
    badges: ['Organic', 'Vegan', 'Bean-to-bar'],
    cacao_percentage: 72,
    is_vegan: true,
    is_organic: true,
    is_popular: true,
    ingredients: ['Organic cacao mass', 'Organic cane sugar', 'Cocoa butter'],
    allergens: ['May contain traces of milk and nuts'],
    weight: '80 g',
    shipping_info: 'Ships chilled from Vienna in 2-4 business days.',
    shippingPackaging: {
      shipsFromCountry: 'Austria',
      shipsFromCity: 'Vienna',
      deliveryEstimate: '2-4',
      heatProtection: true,
      giftPackaging: false,
      summerShipping: true,
      ecoPackaging: true,
    },
    story: 'Made from carefully roasted Peruvian cacao and conched slowly for a clean, elegant snap.',
    gallery: [artisanDarkBars, tastingFlight, chocolatierHands],
  },
  {
    id: 'demo-maison-praline-box',
    name: 'Signature Praline Box',
    description: 'Twelve hand-finished pralines with hazelnut, caramel, and dark ganache centers.',
    price: 329,
    image_url: luxuryPralineBox,
    category: 'Gifts',
    country: 'Belgium',
    city: 'Brussels',
    stock: 16,
    created_at: '2026-01-09T10:00:00.000Z',
    seller_id: 'maison-deluxe',
    maker_id: 'maison-deluxe',
    maker_name: 'Maison DeLuxe',
    maker_slug: 'maison-deluxe',
    rating: 4.8,
    reviews: 94,
    badges: ['Handmade', 'Gift box', 'Award-winning'],
    cacao_percentage: 58,
    is_gift_box: true,
    is_popular: true,
    ingredients: ['Cocoa mass', 'Cane sugar', 'Hazelnut praline', 'Cream', 'Butter'],
    allergens: ['Milk', 'Tree nuts', 'Soy'],
    weight: '180 g',
    shipping_info: 'Gift wrapped and shipped from Brussels in 2-5 business days.',
    shippingPackaging: {
      shipsFromCountry: 'Belgium',
      shipsFromCity: 'Brussels',
      deliveryEstimate: '2-5',
      heatProtection: true,
      giftPackaging: true,
      summerShipping: true,
      ecoPackaging: true,
    },
    story: 'A polished introduction to Belgian praline craft, finished by hand in small weekly batches.',
    gallery: [luxuryPralineBox, celebrationBonbons, chocolatierHands],
  },
  {
    id: 'demo-lavender-truffle-box',
    name: 'Lavender Ganache Truffles',
    description: 'Dark chocolate truffles with Provence lavender and a satin cocoa dusting.',
    price: 279,
    image_url: handmadeTruffles,
    category: 'Truffles',
    country: 'France',
    city: 'Lyon',
    stock: 11,
    created_at: '2026-01-08T10:00:00.000Z',
    seller_id: 'atelier-du-cacao',
    maker_id: 'atelier-du-cacao',
    maker_name: 'Atelier du Cacao',
    maker_slug: 'atelier-du-cacao',
    rating: 4.7,
    reviews: 76,
    badges: ['Handmade', 'Small batch'],
    cacao_percentage: 64,
    ingredients: ['Dark chocolate', 'Cream', 'Lavender infusion', 'Cocoa powder'],
    allergens: ['Milk', 'May contain nuts'],
    weight: '160 g',
    shipping_info: 'Ships from Lyon with insulated packaging in 2-4 business days.',
    shippingPackaging: {
      shipsFromCountry: 'France',
      shipsFromCity: 'Lyon',
      deliveryEstimate: '2-4',
      heatProtection: true,
      giftPackaging: true,
      summerShipping: true,
      ecoPackaging: true,
    },
    story: 'A soft floral ganache inspired by quiet mornings in Provence markets.',
    gallery: [handmadeTruffles, heroTruffles, chocolatierHands],
  },
  {
    id: 'demo-alpine-milk-pralines',
    name: 'Alpine Milk Pralines',
    description: 'Silky Swiss milk chocolate pralines filled with roasted hazelnut cream.',
    price: 259,
    image_url: romancePralines,
    category: 'Milk Chocolate',
    country: 'Switzerland',
    city: 'Zurich',
    stock: 20,
    created_at: '2026-01-07T10:00:00.000Z',
    seller_id: 'alpenschoggi',
    maker_id: 'alpenschoggi',
    maker_name: 'AlpenSchoggi',
    maker_slug: 'alpenschoggi',
    rating: 4.6,
    reviews: 63,
    badges: ['Handmade', 'Family recipe'],
    cacao_percentage: 38,
    ingredients: ['Milk chocolate', 'Alpine cream', 'Hazelnut paste', 'Cane sugar'],
    allergens: ['Milk', 'Tree nuts', 'Soy'],
    weight: '150 g',
    shipping_info: 'Ships from Zurich in 2-5 business days.',
    shippingPackaging: {
      shipsFromCountry: 'Switzerland',
      shipsFromCity: 'Zurich',
      deliveryEstimate: '2-5',
      heatProtection: true,
      giftPackaging: true,
      summerShipping: true,
      ecoPackaging: true,
    },
    story: 'A comfort-forward praline box built around roasted hazelnuts and Swiss alpine milk.',
    gallery: [romancePralines, luxuryPralineBox, celebrationBonbons],
  },
  {
    id: 'demo-vegan-cacao-selection',
    name: 'Vegan Cacao Selection',
    description: 'A plant-based tasting set with dark bars, nibs, and recyclable presentation.',
    price: 229,
    image_url: ecoPackaging,
    category: 'Vegan',
    country: 'Austria',
    city: 'Vienna',
    stock: 10,
    created_at: '2026-01-06T10:00:00.000Z',
    seller_id: 'edelkakao',
    maker_id: 'edelkakao',
    maker_name: 'EdelKakao',
    maker_slug: 'edelkakao',
    rating: 4.8,
    reviews: 51,
    badges: ['Vegan', 'Organic', 'Plastic-free'],
    cacao_percentage: 70,
    is_vegan: true,
    is_organic: true,
    ingredients: ['Organic cacao', 'Cane sugar', 'Cacao nibs'],
    allergens: ['May contain nuts'],
    weight: '120 g',
    shipping_info: 'Ships plastic-free from Vienna in 2-4 business days.',
    shippingPackaging: {
      shipsFromCountry: 'Austria',
      shipsFromCity: 'Vienna',
      deliveryEstimate: '2-4',
      heatProtection: true,
      giftPackaging: false,
      summerShipping: true,
      ecoPackaging: true,
    },
    story: 'Built for cacao purists who want plant-based chocolate with transparent sourcing.',
    gallery: [ecoPackaging, artisanDarkBars, tastingFlight],
  },
  {
    id: 'demo-celebration-bonbons',
    name: 'Celebration Bonbons',
    description: 'A jewel-like assortment of filled bonbons for dinner parties and special gifts.',
    price: 369,
    image_url: celebrationBonbons,
    category: 'Gifts',
    country: 'Belgium',
    city: 'Brussels',
    stock: 14,
    created_at: '2026-01-05T10:00:00.000Z',
    seller_id: 'maison-deluxe',
    maker_id: 'maison-deluxe',
    maker_name: 'Maison DeLuxe',
    maker_slug: 'maison-deluxe',
    rating: 4.9,
    reviews: 112,
    badges: ['Gift box', 'Award-winning', 'Handmade'],
    cacao_percentage: 55,
    is_gift_box: true,
    is_popular: true,
    ingredients: ['Cocoa butter', 'Cocoa mass', 'Fruit ganache', 'Caramel', 'Cream'],
    allergens: ['Milk', 'Tree nuts', 'Soy'],
    weight: '210 g',
    shipping_info: 'Ships gift-ready from Brussels in 2-5 business days.',
    shippingPackaging: {
      shipsFromCountry: 'Belgium',
      shipsFromCity: 'Brussels',
      deliveryEstimate: '2-5',
      heatProtection: true,
      giftPackaging: true,
      summerShipping: true,
      ecoPackaging: true,
    },
    story: 'Designed as a table centerpiece: bright shells, soft centers, and refined Belgian technique.',
    gallery: [celebrationBonbons, luxuryPralineBox, chocolatierHands],
  },
];

export const getDemoProductById = (id?: string) =>
  demoProducts.find((product) => product.id === id);

export const getDemoMakerById = (id?: string) =>
  demoMakers.find((maker) => maker.id === id || maker.slug === id);

export const getDemoProductsByMaker = (makerId?: string) =>
  demoProducts.filter((product) => product.maker_id === makerId || product.maker_slug === makerId || product.seller_id === makerId);
