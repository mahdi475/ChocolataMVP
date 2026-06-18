import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import ProductCard, { type Product } from '../../components/cards/ProductCard';
import { demoCategories, demoProducts } from '../../data/demoCatalog';
import { MARKETPLACE_COUNTRIES } from '../../lib/marketplaceCountries';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import { translateLabel } from '../../lib/translationLabels';
import { readPublicDemoSellerProducts } from '../../lib/marketplaceData';
import { findSellerStoreProfileBySlug, isPublicSellerProduct } from '../../lib/sellerProfile';
import { isProductPublished } from '../../lib/sellerVisibility';
import styles from './CatalogPage.module.css';

interface Category {
  id: string;
  name: string;
  slug?: string;
}

type SortOption = 'popular' | 'newest' | 'price_asc' | 'price_desc';

const COUNTRIES = MARKETPLACE_COUNTRIES;

const CHOCOLATE_TYPES = ['Dark', 'Milk', 'White', 'Pralines', 'Truffles', 'Bonbons', 'Gift Boxes'];
const FLAVOR_OPTIONS = ['Hazelnut', 'Caramel', 'Ganache', 'Fruit', 'Floral', 'Cocoa Nibs'];
const DIETARY_OPTIONS = ['Vegan', 'Organic', 'Dairy-free', 'Plastic-free'];
const OCCASION_OPTIONS = ['Gift Box', 'Celebration', 'Corporate', 'Tasting', 'Self Care', 'Romantic'];
const ADVANCED_FILTERS = ['Award Winning', 'Bean-to-Bar', 'Handmade', 'Small Batch', 'Organic', 'Sustainable', 'Limited Edition'];

const normalize = (value?: string) => (value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const isPublicCatalogProduct = (product: Product) => {
  const sellerProfile = findSellerStoreProfileBySlug(product.maker_slug);
  if (sellerProfile) return isPublicSellerProduct(product, sellerProfile);
  return product.is_active !== false && isProductPublished(product);
};

const productSearchText = (product: Product) => {
  const richProduct = product as Product & { ingredients?: string[]; story?: string };
  return [
    product.name,
    product.description || '',
    product.category || '',
    product.maker_name || '',
    product.country || '',
    product.city || '',
    product.badges?.join(' ') || '',
    product.tags?.join(' ') || '',
    richProduct.ingredients?.join(' ') || '',
    richProduct.story || '',
  ].join(' ').toLowerCase();
};

const toggleArrayValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

const productHasSignal = (product: Product, signal: string) => {
  const text = productSearchText(product);
  const badges = product.badges?.map((badge) => normalize(badge)) || [];
  const tags = product.tags?.map((tag) => normalize(tag)) || [];
  const normalizedSignal = normalize(signal);

  if (badges.includes(normalizedSignal) || tags.includes(normalizedSignal) || text.includes(signal.toLowerCase())) return true;

  switch (signal) {
    case 'Gift Boxes':
    case 'Gift Box':
      return product.is_gift_box || text.includes('gift');
    case 'Dairy-free':
      return product.is_vegan || text.includes('plant-based');
    case 'Plastic-free':
      return text.includes('plastic-free') || text.includes('recyclable');
    case 'Cocoa Nibs':
      return text.includes('nib');
    case 'Fruit':
      return text.includes('fruit') || text.includes('raspberry') || text.includes('red fruit');
    case 'Floral':
      return text.includes('lavender') || text.includes('floral');
    case 'Corporate':
      return text.includes('gift') || text.includes('box');
    case 'Tasting':
      return text.includes('tasting') || text.includes('selection');
    case 'Self Care':
      return text.includes('truffle') || text.includes('comfort');
    case 'Romantic':
      return text.includes('romance') || text.includes('praline');
    case 'Award Winning':
      return badges.includes('awardwinning') || text.includes('award-winning');
    case 'Bean-to-Bar':
      return badges.includes('beantobar') || text.includes('bean-to-bar');
    case 'Small Batch':
      return badges.includes('smallbatch') || text.includes('small batch');
    case 'Organic':
      return product.is_organic || badges.includes('organic');
    case 'Sustainable':
      return text.includes('sustainable') || text.includes('plastic-free') || text.includes('recyclable') || text.includes('transparent sourcing');
    case 'Limited Edition':
      return text.includes('limited');
    default:
      return text.includes(signal.toLowerCase());
  }
};

const categoryMatches = (product: Product, selectedCategory: string) => {
  if (selectedCategory === 'all') return true;
  const selected = selectedCategory.toLowerCase();
  const productCategory = product.category?.toLowerCase() || '';
  const category = demoCategories.find((cat) => cat.slug === selected || cat.name.toLowerCase() === selected);

  return productCategory === selected || (category ? productCategory === category.name.toLowerCase() : false);
};

const isDemoLikeProduct = (product: Product) =>
  Boolean(product.badges || product.rating || product.cacao_percentage || product.maker_name);

const CatalogPage = () => {
  const { t } = useTranslation('ui');
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'all');
  const [selectedCountry, setSelectedCountry] = useState(() => searchParams.get('country') || 'all');
  const [selectedChocolateTypes, setSelectedChocolateTypes] = useState<string[]>(() => searchParams.get('types')?.split(',').filter(Boolean) || []);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>(() => searchParams.get('flavors')?.split(',').filter(Boolean) || []);
  const [selectedDietary, setSelectedDietary] = useState<string[]>(() => searchParams.get('dietary')?.split(',').filter(Boolean) || []);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(() => searchParams.get('occasion')?.split(',').filter(Boolean) || []);
  const [minPrice, setMinPrice] = useState(() => searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(() => searchParams.get('rating') || '');
  const [selectedMaker, setSelectedMaker] = useState(() => searchParams.get('maker') || 'all');
  const [minCacao, setMinCacao] = useState(() => searchParams.get('cacao') || '');
  const [veganOnly, setVeganOnly] = useState(() => searchParams.get('vegan') === '1');
  const [organicOnly, setOrganicOnly] = useState(() => searchParams.get('organic') === '1');
  const [giftOnly, setGiftOnly] = useState(() => searchParams.get('gift') === '1');
  const [selectedAdvanced, setSelectedAdvanced] = useState<string[]>(() => searchParams.get('advanced')?.split(',').filter(Boolean) || []);
  const [sortBy, setSortBy] = useState<SortOption>(() => (searchParams.get('sort') as SortOption) || 'popular');
  const sortOptions: Array<{ label: string; value: SortOption }> = [
    { label: t('shop.popular'), value: 'popular' },
    { label: t('shop.newest'), value: 'newest' },
    { label: t('shop.priceLowHigh'), value: 'price_asc' },
    { label: t('shop.priceHighLow'), value: 'price_desc' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [productsResult, categoriesResult] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('display_order', { ascending: true }).order('name', { ascending: true }),
        ]);

        if (productsResult.error) {
          throw productsResult.error;
        }

        const loadedProducts = (productsResult.data || []).filter(isPublicCatalogProduct);
        const sellerProducts = readPublicDemoSellerProducts();
        const nextProducts = [...sellerProducts, ...loadedProducts.filter((product) => !sellerProducts.some((sellerProduct) => sellerProduct.id === product.id))];
        setProducts(nextProducts.length > 0 ? nextProducts : demoProducts);
        setCategories(categoriesResult.data?.length ? categoriesResult.data : demoCategories);
      } catch (err) {
        console.error('Catalog fetch error:', err);
        const sellerProducts = readPublicDemoSellerProducts();
        setProducts(sellerProducts.length > 0 ? [...sellerProducts, ...demoProducts] : demoProducts);
        setCategories(demoCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const makers = useMemo(
    () => Array.from(new Set(products.map((product) => product.maker_name).filter(Boolean) as string[])).sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

    const result = products.filter((product) => {
      const searchableText = productSearchText(product);

      const matchesSearch = searchTerms.every((term) => searchableText.includes(term));
      const matchesCategory = categoryMatches(product, selectedCategory);
      const matchesCountry = selectedCountry === 'all' || product.country === selectedCountry;
      const matchesTypes = selectedChocolateTypes.length === 0 || selectedChocolateTypes.some((type) => productHasSignal(product, type));
      const matchesFlavors = selectedFlavors.length === 0 || selectedFlavors.some((flavor) => productHasSignal(product, flavor));
      const matchesDietary = selectedDietary.length === 0 || selectedDietary.every((preference) => productHasSignal(product, preference));
      const matchesOccasion = selectedOccasions.length === 0 || selectedOccasions.some((occasion) => productHasSignal(product, occasion));
      const matchesMin = !minPrice || product.price >= Number(minPrice);
      const matchesMax = !maxPrice || product.price <= Number(maxPrice);
      const matchesRating = !minRating || (product.rating || 0) >= Number(minRating);
      const matchesMaker = selectedMaker === 'all' || product.maker_name === selectedMaker;
      const matchesCacao = !minCacao || (product.cacao_percentage || 0) >= Number(minCacao);
      const matchesVegan = !veganOnly || product.is_vegan || product.badges?.includes('Vegan');
      const matchesOrganic = !organicOnly || product.is_organic || product.badges?.includes('Organic');
      const matchesGift = !giftOnly || product.is_gift_box || product.badges?.includes('Gift box');
      const matchesAdvanced = selectedAdvanced.length === 0 || selectedAdvanced.every((signal) => productHasSignal(product, signal));

      return matchesSearch && matchesCategory && matchesCountry && matchesTypes && matchesFlavors && matchesDietary && matchesOccasion && matchesMin && matchesMax && matchesRating && matchesMaker && matchesCacao && matchesVegan && matchesOrganic && matchesGift && matchesAdvanced;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'popular':
        default:
          return (b.rating || 0) * 100 + (b.reviews || 0) - ((a.rating || 0) * 100 + (a.reviews || 0));
      }
    });

    return result;
  }, [products, searchQuery, selectedCategory, selectedCountry, selectedChocolateTypes, selectedFlavors, selectedDietary, selectedOccasions, minPrice, maxPrice, minRating, selectedMaker, minCacao, veganOnly, organicOnly, giftOnly, selectedAdvanced, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedCountry !== 'all') params.set('country', selectedCountry);
    if (selectedChocolateTypes.length) params.set('types', selectedChocolateTypes.join(','));
    if (selectedFlavors.length) params.set('flavors', selectedFlavors.join(','));
    if (selectedDietary.length) params.set('dietary', selectedDietary.join(','));
    if (selectedOccasions.length) params.set('occasion', selectedOccasions.join(','));
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minRating) params.set('rating', minRating);
    if (selectedMaker !== 'all') params.set('maker', selectedMaker);
    if (minCacao) params.set('cacao', minCacao);
    if (veganOnly) params.set('vegan', '1');
    if (organicOnly) params.set('organic', '1');
    if (giftOnly) params.set('gift', '1');
    if (selectedAdvanced.length) params.set('advanced', selectedAdvanced.join(','));
    if (sortBy !== 'popular') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, selectedCountry, selectedChocolateTypes, selectedFlavors, selectedDietary, selectedOccasions, minPrice, maxPrice, minRating, selectedMaker, minCacao, veganOnly, organicOnly, giftOnly, selectedAdvanced, sortBy, setSearchParams]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCountry('all');
    setSelectedChocolateTypes([]);
    setSelectedFlavors([]);
    setSelectedDietary([]);
    setSelectedOccasions([]);
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSelectedMaker('all');
    setMinCacao('');
    setVeganOnly(false);
    setOrganicOnly(false);
    setGiftOnly(false);
    setSelectedAdvanced([]);
    setSortBy('popular');
  };

  const activeFilterCount = [
    searchQuery,
    selectedCategory !== 'all',
    selectedCountry !== 'all',
    selectedChocolateTypes.length,
    selectedFlavors.length,
    selectedDietary.length,
    selectedOccasions.length,
    minPrice,
    maxPrice,
    minRating,
    selectedMaker !== 'all',
    minCacao,
    veganOnly,
    organicOnly,
    giftOnly,
    selectedAdvanced.length,
  ].filter(Boolean).length;

  const MultiChoiceGroup = ({
    options,
    selected,
    onToggle,
  }: {
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
  }) => (
    <div className={styles.chipGrid}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`${styles.chip} ${selected.includes(option) ? styles.chipActive : ''}`}
          onClick={() => onToggle(option)}
        >
          {translateLabel(t, 'filters', option)}
          {selected.includes(option) && <Check className={styles.chipIcon} />}
        </button>
      ))}
    </div>
  );

  const FilterGroup = ({
    title,
    summary,
    children,
    defaultOpen = false,
  }: {
    title: string;
    summary?: string;
    children: ReactNode;
    defaultOpen?: boolean;
  }) => (
    <details className={styles.filterGroup} open={defaultOpen}>
      <summary className={styles.filterSummary}>
        <span>
          <strong>{title}</strong>
          {summary && <small>{summary}</small>}
        </span>
        <ChevronDown className={styles.filterChevron} />
      </summary>
      <div className={styles.filterGroupBody}>{children}</div>
    </details>
  );

  const FilterPanel = () => (
    <div className={styles.filterPanel}>
      <div className={styles.filterIntro}>
        <span>{t('shop.curateBox')}</span>
        <p>{t('shop.curateHint')}</p>
      </div>

      <FilterGroup title={t('shop.origin')} summary={t('shop.originSummary')} defaultOpen>
        <label className={styles.fieldLabel} htmlFor="country-filter">{t('shop.country')}</label>
        <select id="country-filter" className={styles.select} value={selectedCountry} onChange={(event) => setSelectedCountry(event.target.value)}>
          <option value="all">{t('shop.allCountries')}</option>
          {COUNTRIES.map((country) => <option key={country} value={country}>{translateLabel(t, 'countries', country)}</option>)}
        </select>

        <label className={styles.fieldLabel} htmlFor="maker-filter">{t('shop.maker')}</label>
        <select id="maker-filter" className={styles.select} value={selectedMaker} onChange={(event) => setSelectedMaker(event.target.value)}>
          <option value="all">{t('shop.allMakers')}</option>
          {makers.map((maker) => <option key={maker} value={maker}>{maker}</option>)}
        </select>
      </FilterGroup>

      <FilterGroup title={t('shop.taste')} summary={t('shop.tasteSummary')} defaultOpen>
        <label className={styles.fieldLabel} htmlFor="category-filter">{t('shop.category')}</label>
        <select id="category-filter" className={styles.select} value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
          <option value="all">{t('shop.allCategories')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug || category.name}>{translateLabel(t, 'categories', category.name)}</option>
          ))}
        </select>

        <p className={styles.filterLabel}>{t('shop.chocolateType')}</p>
        <MultiChoiceGroup
          options={CHOCOLATE_TYPES}
          selected={selectedChocolateTypes}
          onToggle={(value) => setSelectedChocolateTypes((current) => toggleArrayValue(current, value))}
        />

        <p className={styles.filterLabel}>{t('shop.flavorFillings')}</p>
        <MultiChoiceGroup
          options={FLAVOR_OPTIONS}
          selected={selectedFlavors}
          onToggle={(value) => setSelectedFlavors((current) => toggleArrayValue(current, value))}
        />

        <label className={styles.fieldLabel} htmlFor="cacao-filter">{t('shop.minimumCacao')}</label>
        <input id="cacao-filter" className={styles.input} type="number" placeholder={t('shop.anyPercent')} value={minCacao} onChange={(event) => setMinCacao(event.target.value)} />
      </FilterGroup>

      <FilterGroup title={t('shop.lifestyle')} summary={t('shop.dietaryPreferences')}>
        <MultiChoiceGroup
          options={DIETARY_OPTIONS}
          selected={selectedDietary}
          onToggle={(value) => setSelectedDietary((current) => toggleArrayValue(current, value))}
        />
      </FilterGroup>

      <FilterGroup title={t('shop.occasion')} summary={t('shop.occasionSummary')}>
        <MultiChoiceGroup
          options={OCCASION_OPTIONS}
          selected={selectedOccasions}
          onToggle={(value) => setSelectedOccasions((current) => toggleArrayValue(current, value))}
        />
      </FilterGroup>

      <FilterGroup title={t('shop.priceRating')} summary={t('shop.priceRatingSummary')}>
        <div className={styles.priceInputs}>
          <input className={styles.input} type="number" placeholder={t('shop.minSek')} value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
          <input className={styles.input} type="number" placeholder={t('shop.maxSek')} value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
        </div>
        <label className={styles.fieldLabel} htmlFor="rating-filter">{t('shop.minimumRating')}</label>
        <select id="rating-filter" className={styles.select} value={minRating} onChange={(event) => setMinRating(event.target.value)}>
          <option value="">{t('shop.anyRating')}</option>
          <option value="4.9">{t('shop.ratingAbove', { rating: '4.9' })}</option>
          <option value="4.8">{t('shop.ratingAbove', { rating: '4.8' })}</option>
          <option value="4.5">{t('shop.ratingAbove', { rating: '4.5' })}</option>
        </select>
      </FilterGroup>

      <FilterGroup title={t('shop.advancedCraft')} summary={t('shop.advancedSummary')}>
        <MultiChoiceGroup
          options={ADVANCED_FILTERS}
          selected={selectedAdvanced}
          onToggle={(value) => setSelectedAdvanced((current) => toggleArrayValue(current, value))}
        />
      </FilterGroup>

      {activeFilterCount > 0 && (
        <button className={styles.resetButton} onClick={clearFilters}>
          <RotateCcw className={styles.resetIcon} />
          {t('shop.resetFilters')}
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner fullScreen text={t('shop.loading')} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>{t('shop.eyebrow')}</p>
            <h1 className={styles.title}>{t('shop.title')}</h1>
            <p className={styles.subtitle}>
              {t('shop.subtitle')}
            </p>
          </div>
          <div className={styles.heroStats}>
            <span>{products.length} {t('shop.products')}</span>
            <span>{demoCategories.length} {t('shop.collections')}</span>
            <span>{products.some(isDemoLikeProduct) ? t('shop.curatedMakers') : t('shop.liveCatalog')}</span>
          </div>
        </section>

        <section className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('shop.searchPlaceholder')}
              className={styles.searchInput}
            />
          </div>
          <button className={styles.mobileFilterButton} onClick={() => setIsFilterOpen(true)}>
            <SlidersHorizontal className={styles.filterIcon} />
            {t('shop.filters')} {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </button>
          <select className={styles.sortSelect} value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </section>

        <div className={styles.mainContent}>
          <aside className={styles.desktopSidebar}>
            <FilterPanel />
          </aside>

          {isFilterOpen && (
            <div className={styles.mobileFilterOverlay}>
              <button className={styles.mobileFilterBackdrop} aria-label={t('shop.closeFilters')} onClick={() => setIsFilterOpen(false)} />
              <div className={styles.mobileFilterDrawer}>
                <div className={styles.mobileFilterHeader}>
                  <h2>{t('shop.filters')}</h2>
                  <button className={styles.mobileFilterClose} onClick={() => setIsFilterOpen(false)} aria-label={t('shop.closeFilters')}>
                    <X />
                  </button>
                </div>
                <FilterPanel />
                <Button className={styles.mobileApply} onClick={() => setIsFilterOpen(false)}>{t('shop.showProducts', { count: filteredProducts.length })}</Button>
              </div>
            </div>
          )}

          <section className={styles.productArea}>
            <div className={styles.resultHeader}>
              <p>{filteredProducts.length} {filteredProducts.length === 1 ? t('shop.result') : t('shop.results')}</p>
              {activeFilterCount > 0 && <button onClick={clearFilters}>{t('shop.clearAll')}</button>}
            </div>

            {filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>{t('shop.emptyTitle')}</h3>
                <p>{t('shop.emptyText')}</p>
                <Button variant="outline" onClick={clearFilters}>{t('shop.resetFilters')}</Button>
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </FadeIn>
    </div>
  );
};

export default CatalogPage;
