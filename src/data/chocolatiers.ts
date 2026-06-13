import maisonDeluxe from '../assets/chocolatiers/maison-deluxe.png';
import alpenschoggi from '../assets/chocolatiers/alpenschoggi.png';
import edelkakao from '../assets/chocolatiers/edelkakao.png';
import cioccolatoFiorentino from '../assets/chocolatiers/cioccolato-fiorentino.png';
import atelierDuCacao from '../assets/chocolatiers/atelier-du-cacao.png';
import casaDelCacao from '../assets/chocolatiers/casa-del-cacao.png';
import dutchcraft from '../assets/chocolatiers/dutchcraft.png';
import nordiskKakao from '../assets/chocolatiers/nordisk-kakao.png';
import fjordcocoa from '../assets/chocolatiers/fjordcocoa.png';
import copenhagenCacaoLab from '../assets/chocolatiers/copenhagen-cacao-lab.png';
import arcticBean from '../assets/chocolatiers/arctic-bean.png';
import londonCocoaHouse from '../assets/chocolatiers/london-cocoa-house.png';

// Product images reused from the Collections AI assets
import truffles from '../assets/collections/winter-truffles.png';
import pralines from '../assets/collections/romance-pralines.png';
import bonbons from '../assets/collections/lunar-gold-bonbons.png';
import tastingBar from '../assets/collections/tasting-flight.png';
import giftBox from '../assets/collections/office-praline-box.png';
import centerpiece from '../assets/collections/celebration-bonbons.png';

export type ProductTag =
  | 'dark'
  | 'milk'
  | 'white'
  | 'vegan'
  | 'nut-free'
  | 'single-origin'
  | 'seasonal';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: ProductTag[];
}

export interface Chocolatier {
  slug: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  tagline: string;
  story: string;
  portrait: string;
  tags: string[];
  values: { title: string; description: string }[];
  products: Product[];
}

// Helper to build a varied product list per chocolatier from shared images
const buildProducts = (prefix: string, items: Omit<Product, 'id'>[]): Product[] =>
  items.map((p, i) => ({ ...p, id: `${prefix}-${i + 1}` }));

const DEFAULT_VALUES = [
  { title: 'Sustainability', description: 'Recycled and compostable packaging across every gift box.' },
  { title: 'Ethical Sourcing', description: 'Direct-trade cacao paid above Fair Trade premiums.' },
  { title: 'Family Business', description: 'Independent, family-owned and operated for generations.' },
  { title: 'Craftsmanship', description: 'Every piece hand-finished in small batches by trained artisans.' },
];

export const CHOCOLATIERS: Chocolatier[] = [
  {
    slug: 'maison-deluxe',
    name: 'Maison DeLuxe',
    city: 'Brussels',
    country: 'Belgium',
    flag: '🇧🇪',
    tagline: 'Heritage Belgian pralines crafted with modern flavor twists.',
    story:
      'Founded in 1923, Maison DeLuxe is a fourth-generation Belgian house celebrated for its glossy, hand-finished pralines. Today, head chocolatier Léa Devos reinterprets her great-grandfather\'s recipes with single-origin couverture and unexpected pairings — yuzu, smoked tea, miso caramel — without ever betraying the heritage.',
    portrait: maisonDeluxe,
    tags: ['pralines', 'ganache', 'luxury', 'traditional'],
    values: DEFAULT_VALUES,
    products: buildProducts('maison-deluxe', [
      { name: 'Signature Praline Box', description: '12 hand-finished pralines with seasonal infusions.', price: 32.0, image: pralines, tags: ['milk', 'dark', 'single-origin'] },
      { name: 'Dark Ganache Truffles', description: '70% single-origin dark ganache, dusted in cocoa.', price: 24.0, image: truffles, tags: ['dark', 'vegan', 'nut-free'] },
      { name: 'Gilded Bonbons', description: 'Champagne ganache with edible gold leaf.', price: 48.0, image: bonbons, tags: ['milk', 'seasonal'] },
      { name: 'Gift Selection', description: 'Curated 24-piece assortment in a luxury kraft box.', price: 58.0, image: giftBox, tags: ['milk', 'dark', 'nut-free'] },
    ]),
  },
  {
    slug: 'alpenschoggi',
    name: 'AlpenSchoggi',
    city: 'Zürich',
    country: 'Switzerland',
    flag: '🇨🇭',
    tagline: 'Swiss alpine milk chocolate perfected over three generations.',
    story:
      'High in the Swiss Alps, the Müller family has been turning fresh alpine cream into silky milk chocolate since 1962. Their slow-conched bars are still made in the same copper kettles their grandfather used. AlpenSchoggi is the rare brand that has refused to scale — every bar is finished and wrapped by hand.',
    portrait: alpenschoggi,
    tags: ['milk chocolate', 'family business', 'creamy', 'alpine'],
    values: DEFAULT_VALUES,
    products: buildProducts('alpenschoggi', [
      { name: 'Alpine Milk Bar', description: '38% milk chocolate with fresh alpine cream.', price: 12.0, image: tastingBar, tags: ['milk'] },
      { name: 'Hazelnut Pralines', description: 'Roasted Piemonte hazelnuts in milk ganache.', price: 26.0, image: pralines, tags: ['milk'] },
      { name: 'Truffle Trio', description: 'Three milk truffles: vanilla, honey, alpine herbs.', price: 22.0, image: truffles, tags: ['milk', 'nut-free'] },
      { name: 'Family Gift Box', description: 'A grand assortment of milk and dark favourites.', price: 64.0, image: giftBox, tags: ['milk', 'dark'] },
    ]),
  },
  {
    slug: 'edelkakao',
    name: 'EdelKakao',
    city: 'Vienna',
    country: 'Austria',
    flag: '🇦🇹',
    tagline: 'Viennese artistry meets single-origin cacao.',
    story:
      'In a quiet salon in Vienna\'s 1st district, EdelKakao\'s master makers craft single-origin bars from cacao traced to one farm at a time. Each tablet is paired with a printed tasting note describing terroir, fermentation and flavour arc — chocolate, the way wine is served.',
    portrait: edelkakao,
    tags: ['single origin', 'artisan', 'elegant', 'dark chocolate'],
    values: DEFAULT_VALUES,
    products: buildProducts('edelkakao', [
      { name: 'Peru 72% Single-Origin Bar', description: 'Chuncho cacao from the Cusco valley.', price: 14.0, image: tastingBar, tags: ['dark', 'vegan', 'single-origin', 'nut-free'] },
      { name: 'Madagascar 75% Bar', description: 'Bright red-fruit and citrus notes.', price: 14.0, image: tastingBar, tags: ['dark', 'vegan', 'single-origin', 'nut-free'] },
      { name: 'Origin Tasting Flight', description: 'Four bars, four terroirs, printed guide.', price: 48.0, image: tastingBar, tags: ['dark', 'single-origin', 'vegan'] },
      { name: 'Dark Truffle Box', description: '12 dark truffles, single-origin ganache.', price: 32.0, image: truffles, tags: ['dark', 'vegan'] },
    ]),
  },
  {
    slug: 'cioccolato-fiorentino',
    name: 'Cioccolato Fiorentino',
    city: 'Florence',
    country: 'Italy',
    flag: '🇮🇹',
    tagline: 'Tuscany-inspired chocolate with bold Mediterranean flavors.',
    story:
      'From a tiny laboratorio in Oltrarno, Lucia Bianchi blends Tuscan ingredients — olive oil, blood orange, Vin Santo, Pantelleria capers — into bold bean-to-bar chocolate. Cioccolato Fiorentino has been featured in Gambero Rosso and counts three Michelin-starred restaurants as its dessert partners.',
    portrait: cioccolatoFiorentino,
    tags: ['orange zest', 'olive oil chocolate', 'artisanal', 'Italian'],
    values: DEFAULT_VALUES,
    products: buildProducts('cioccolato-fiorentino', [
      { name: 'Blood Orange Tablet', description: 'Dark 65% with candied Sicilian blood orange.', price: 13.0, image: tastingBar, tags: ['dark', 'vegan', 'nut-free'] },
      { name: 'Olio & Cacao Bar', description: 'Dark chocolate enriched with Tuscan EVOO.', price: 15.0, image: tastingBar, tags: ['dark', 'vegan', 'nut-free'] },
      { name: 'Vin Santo Pralines', description: 'Pralines filled with Vin Santo ganache.', price: 28.0, image: pralines, tags: ['dark'] },
      { name: 'Toscana Gift Tin', description: 'Six iconic Tuscan flavours in a tin.', price: 42.0, image: giftBox, tags: ['dark', 'milk', 'nut-free'] },
    ]),
  },
  {
    slug: 'atelier-du-cacao',
    name: 'Atelier du Cacao',
    city: 'Lyon',
    country: 'France',
    flag: '🇫🇷',
    tagline: 'French haute-chocolate with delicate textures and bold aromas.',
    story:
      'Inside a discreet Lyon atelier, chef Étienne Rivière turns out architectural truffles and ganaches that have earned him the Meilleur Ouvrier de France title. His work is sculptural, his flavours unmistakably French — lavender, salted butter caramel, Earl Grey.',
    portrait: atelierDuCacao,
    tags: ['truffles', 'ganache', 'luxury', 'French'],
    values: DEFAULT_VALUES,
    products: buildProducts('atelier-du-cacao', [
      { name: 'Lavender Truffles', description: 'Provence lavender ganache, dark chocolate shell.', price: 26.0, image: truffles, tags: ['dark', 'nut-free'] },
      { name: 'Caramel Beurre Salé', description: 'Brittany salted caramel pralines.', price: 28.0, image: pralines, tags: ['milk'] },
      { name: 'Haute Couture Box', description: 'A sculptural 16-piece assortment.', price: 64.0, image: giftBox, tags: ['milk', 'dark', 'nut-free'] },
      { name: 'Earl Grey Tablet', description: 'Single-origin dark with bergamot tea.', price: 14.0, image: tastingBar, tags: ['dark', 'vegan'] },
    ]),
  },
  {
    slug: 'casa-del-cacao',
    name: 'Casa del Cacao',
    city: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    tagline: 'Vibrant Spanish flavors infused into bean-to-bar creations.',
    story:
      'Casa del Cacao began in a Born neighbourhood storefront with one stone melanger and a lot of ambition. Today the team roasts beans daily, blends them with chili, smoked paprika, Marcona almond, and saffron, and turns Barcelona\'s craft chocolate scene on its head.',
    portrait: casaDelCacao,
    tags: ['bean-to-bar', 'chili chocolate', 'Mediterranean', 'bold'],
    values: DEFAULT_VALUES,
    products: buildProducts('casa-del-cacao', [
      { name: 'Chili & Cacao Bar', description: 'Dark 70% with smoky chipotle chili.', price: 13.0, image: tastingBar, tags: ['dark', 'vegan', 'nut-free'] },
      { name: 'Saffron Bonbons', description: 'White chocolate ganache with Spanish saffron.', price: 30.0, image: bonbons, tags: ['white'] },
      { name: 'Marcona Pralines', description: 'Roasted Marcona almonds in dark praliné.', price: 26.0, image: pralines, tags: ['dark'] },
      { name: 'Tapas Tasting Box', description: 'Six small-format bars to share.', price: 38.0, image: giftBox, tags: ['dark', 'milk', 'vegan'] },
    ]),
  },
  {
    slug: 'dutchcraft',
    name: 'DutchCraft Chocolate',
    city: 'Amsterdam',
    country: 'Netherlands',
    flag: '🇳🇱',
    tagline: 'Smooth Dutch-style chocolate with innovative flavor pairings.',
    story:
      'Amsterdam\'s DutchCraft is run by a duo who met at culinary school and obsess over texture. Their stoneground bars are slow-conched for 72 hours and finished with unusual flavour partners — gin botanicals, stroopwafel crumb, North Sea sea salt.',
    portrait: dutchcraft,
    tags: ['smooth', 'innovative', 'caramel', 'Dutch'],
    values: DEFAULT_VALUES,
    products: buildProducts('dutchcraft', [
      { name: 'Stroopwafel Bar', description: 'Milk chocolate with stroopwafel crumb.', price: 12.0, image: tastingBar, tags: ['milk'] },
      { name: 'Gin Botanical Pralines', description: 'Pralines infused with juniper and citrus.', price: 28.0, image: pralines, tags: ['milk'] },
      { name: 'Salted Caramel Bonbons', description: 'Soft caramel, North Sea salt.', price: 26.0, image: bonbons, tags: ['milk'] },
      { name: 'Dutch Discovery Box', description: 'Twelve Dutch-flavour pralines and bonbons.', price: 44.0, image: giftBox, tags: ['milk', 'dark'] },
    ]),
  },
  {
    slug: 'nordisk-kakao',
    name: 'Nordisk Kakao',
    city: 'Gothenburg',
    country: 'Sweden',
    flag: '🇸🇪',
    tagline: 'Scandinavian minimalism meets ethically sourced cacao.',
    story:
      'Nordisk Kakao believes chocolate should be honest, traceable and beautiful. Their bars are minimal — three ingredients, no soy lecithin, single-origin — and their packaging is recycled, recyclable and printed with soy ink. Quietly perfect, like Sweden itself.',
    portrait: nordiskKakao,
    tags: ['ethical', 'minimalist', 'Nordic', 'dark chocolate'],
    values: DEFAULT_VALUES,
    products: buildProducts('nordisk-kakao', [
      { name: 'Ren 70% Bar', description: 'Three ingredients. Pure dark.', price: 13.0, image: tastingBar, tags: ['dark', 'vegan', 'nut-free', 'single-origin'] },
      { name: 'Lakrits Truffles', description: 'Dark truffles with Nordic liquorice root.', price: 24.0, image: truffles, tags: ['dark', 'vegan'] },
      { name: 'Single Origin Set', description: 'Three farms, three bars, one tasting card.', price: 36.0, image: tastingBar, tags: ['dark', 'single-origin', 'vegan'] },
      { name: 'Minimalist Gift Box', description: 'Eight bonbons in recycled card.', price: 32.0, image: giftBox, tags: ['dark', 'vegan'] },
    ]),
  },
  {
    slug: 'fjordcocoa',
    name: 'FjordCocoa',
    city: 'Bergen',
    country: 'Norway',
    flag: '🇳🇴',
    tagline: 'Cold-crafted chocolate inspired by Nordic nature.',
    story:
      'Bergen\'s rain and sea air shape every batch of FjordCocoa. Founder Magnus Lien finishes his dark chocolate with hand-harvested Arctic sea salt and lingonberry, evoking the dramatic landscape just outside his workshop window. Slow, considered, unmistakably Norwegian.',
    portrait: fjordcocoa,
    tags: ['sea salt', 'dark chocolate', 'natural', 'handcrafted'],
    values: DEFAULT_VALUES,
    products: buildProducts('fjordcocoa', [
      { name: 'Sea Salt Dark Bar', description: 'Dark 72% topped with Arctic sea salt flakes.', price: 13.0, image: tastingBar, tags: ['dark', 'vegan', 'nut-free'] },
      { name: 'Lingonberry Bonbons', description: 'Wild lingonberry ganache in dark shells.', price: 28.0, image: bonbons, tags: ['dark', 'nut-free'] },
      { name: 'Fjord Truffles', description: 'Hand-rolled cold-crafted dark truffles.', price: 26.0, image: truffles, tags: ['dark', 'vegan', 'nut-free'] },
      { name: 'Nordic Gift Box', description: 'Eight signature pieces in a wooden box.', price: 48.0, image: giftBox, tags: ['dark', 'nut-free'] },
    ]),
  },
  {
    slug: 'copenhagen-cacao-lab',
    name: 'Copenhagen Cacao Lab',
    city: 'Copenhagen',
    country: 'Denmark',
    flag: '🇩🇰',
    tagline: 'Experimental chocolate with Danish design aesthetics.',
    story:
      'Half chocolatier, half design studio. Copenhagen Cacao Lab releases small experimental batches — fermented strawberry, miso, pickled cherry — in collectible geometric moulds. Their work has been exhibited at the Danish Design Museum and shipped to chefs at Noma.',
    portrait: copenhagenCacaoLab,
    tags: ['experimental', 'design', 'modern', 'bean-to-bar'],
    values: DEFAULT_VALUES,
    products: buildProducts('copenhagen-cacao-lab', [
      { name: 'Miso Caramel Bar', description: 'Dark chocolate, white miso, caramel.', price: 14.0, image: tastingBar, tags: ['dark'] },
      { name: 'Fermented Berry Bonbons', description: 'Wild Nordic berries, ferment-led ganache.', price: 30.0, image: bonbons, tags: ['dark'] },
      { name: 'Geometric Praline Set', description: 'Six sculptural pralines in collectible mould.', price: 36.0, image: pralines, tags: ['dark', 'milk'] },
      { name: 'Lab Edition Box', description: 'Limited monthly experimental release.', price: 52.0, image: giftBox, tags: ['dark', 'seasonal'] },
    ]),
  },
  {
    slug: 'arctic-bean',
    name: 'Arctic Bean',
    city: 'Helsinki',
    country: 'Finland',
    flag: '🇫🇮',
    tagline: 'Pure flavors crafted with Nordic precision and calm.',
    story:
      'Arctic Bean was founded on a single principle: let the cacao speak. Every bar is a study in restraint — no inclusions, no flavour add-ins, just temperature, time, and a deep respect for the bean. Helsinki\'s answer to the slow-food movement.',
    portrait: arcticBean,
    tags: ['pure', 'clean', 'minimal', 'dark chocolate'],
    values: DEFAULT_VALUES,
    products: buildProducts('arctic-bean', [
      { name: 'Pure 75% Bar', description: 'Two ingredients. Single-origin Ecuador.', price: 13.0, image: tastingBar, tags: ['dark', 'vegan', 'single-origin', 'nut-free'] },
      { name: 'Pure 85% Bar', description: 'Two ingredients. Single-origin Tanzania.', price: 13.0, image: tastingBar, tags: ['dark', 'vegan', 'single-origin', 'nut-free'] },
      { name: 'Origin Quartet', description: 'Four single-origin bars, paired tasting notes.', price: 46.0, image: tastingBar, tags: ['dark', 'single-origin', 'vegan'] },
      { name: 'Studio Truffle Set', description: 'Eight pure dark truffles.', price: 32.0, image: truffles, tags: ['dark', 'vegan', 'nut-free'] },
    ]),
  },
  {
    slug: 'london-cocoa-house',
    name: 'London Cocoa House',
    city: 'London',
    country: 'England',
    flag: '🇬🇧',
    tagline: 'Classic British chocolate reinvented for the modern palate.',
    story:
      'Tucked behind a Mayfair shopfront, London Cocoa House blends British classics with modern technique. Their afternoon-tea collection — Earl Grey, sticky toffee, hot cross — has become a London institution. The full range is hand-finished at the back of the shop, in full view of customers.',
    portrait: londonCocoaHouse,
    tags: ['classic', 'modern', 'truffles', 'British'],
    values: DEFAULT_VALUES,
    products: buildProducts('london-cocoa-house', [
      { name: 'Earl Grey Truffles', description: 'Black tea ganache in dark chocolate.', price: 26.0, image: truffles, tags: ['dark', 'nut-free'] },
      { name: 'Sticky Toffee Pralines', description: 'Salted toffee in milk chocolate shells.', price: 28.0, image: pralines, tags: ['milk'] },
      { name: 'Centerpiece Box', description: 'Stacked tower of luxury bonbons.', price: 64.0, image: centerpiece, tags: ['dark', 'milk', 'seasonal'] },
      { name: 'Afternoon Tea Set', description: 'Twelve British-classic flavours.', price: 38.0, image: giftBox, tags: ['milk', 'dark', 'nut-free'] },
    ]),
  },
];

export const getChocolatierBySlug = (slug: string | undefined): Chocolatier | undefined =>
  CHOCOLATIERS.find((c) => c.slug === slug);
