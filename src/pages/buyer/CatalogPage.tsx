import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Leaf, PackageCheck, RotateCcw, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import ProductCard, { type Product } from '../../components/cards/ProductCard';
import { demoCategories, demoProducts } from '../../data/demoCatalog';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './CatalogPage.module.css';

interface Category {
  id: string;
  name: string;
  slug?: string;
}

type SortOption = 'popular' | 'newest' | 'price_asc' | 'price_desc';

const COUNTRIES = ['Belgium', 'France', 'Switzerland', 'Austria', 'Sweden', 'Germany', 'Peru', 'Ecuador'];

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: 'Popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price low-high', value: 'price_asc' },
  { label: 'Price high-low', value: 'price_desc' },
];

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'all');
  const [selectedCountry, setSelectedCountry] = useState(() => searchParams.get('country') || 'all');
  const [minPrice, setMinPrice] = useState(() => searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get('maxPrice') || '');
  const [minCacao, setMinCacao] = useState(() => searchParams.get('cacao') || '');
  const [veganOnly, setVeganOnly] = useState(() => searchParams.get('vegan') === '1');
  const [organicOnly, setOrganicOnly] = useState(() => searchParams.get('organic') === '1');
  const [giftOnly, setGiftOnly] = useState(() => searchParams.get('gift') === '1');
  const [sortBy, setSortBy] = useState<SortOption>(() => (searchParams.get('sort') as SortOption) || 'popular');

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

        const loadedProducts = productsResult.data || [];
        setProducts(loadedProducts.length > 0 ? loadedProducts : demoProducts);
        setCategories(categoriesResult.data?.length ? categoriesResult.data : demoCategories);
      } catch (err) {
        console.error('Catalog fetch error:', err);
        setProducts(demoProducts);
        setCategories(demoCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

    const result = products.filter((product) => {
      const searchableText = [
        product.name,
        product.description || '',
        product.category || '',
        product.maker_name || '',
        product.country || '',
        product.city || '',
      ].join(' ').toLowerCase();

      const matchesSearch = searchTerms.every((term) => searchableText.includes(term));
      const matchesCategory = categoryMatches(product, selectedCategory);
      const matchesCountry = selectedCountry === 'all' || product.country === selectedCountry;
      const matchesMin = !minPrice || product.price >= Number(minPrice);
      const matchesMax = !maxPrice || product.price <= Number(maxPrice);
      const matchesCacao = !minCacao || (product.cacao_percentage || 0) >= Number(minCacao);
      const matchesVegan = !veganOnly || product.is_vegan || product.badges?.includes('Vegan');
      const matchesOrganic = !organicOnly || product.is_organic || product.badges?.includes('Organic');
      const matchesGift = !giftOnly || product.is_gift_box || product.badges?.includes('Gift box');

      return matchesSearch && matchesCategory && matchesCountry && matchesMin && matchesMax && matchesCacao && matchesVegan && matchesOrganic && matchesGift;
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
  }, [products, searchQuery, selectedCategory, selectedCountry, minPrice, maxPrice, minCacao, veganOnly, organicOnly, giftOnly, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedCountry !== 'all') params.set('country', selectedCountry);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minCacao) params.set('cacao', minCacao);
    if (veganOnly) params.set('vegan', '1');
    if (organicOnly) params.set('organic', '1');
    if (giftOnly) params.set('gift', '1');
    if (sortBy !== 'popular') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, selectedCountry, minPrice, maxPrice, minCacao, veganOnly, organicOnly, giftOnly, sortBy, setSearchParams]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCountry('all');
    setMinPrice('');
    setMaxPrice('');
    setMinCacao('');
    setVeganOnly(false);
    setOrganicOnly(false);
    setGiftOnly(false);
    setSortBy('popular');
  };

  const activeFilterCount = [
    searchQuery,
    selectedCategory !== 'all',
    selectedCountry !== 'all',
    minPrice,
    maxPrice,
    minCacao,
    veganOnly,
    organicOnly,
    giftOnly,
  ].filter(Boolean).length;

  const FilterPanel = () => (
    <div className={styles.filterPanel}>
      <div className={styles.filterSection}>
        <p className={styles.filterLabel}>Category</p>
        <div className={styles.choiceList}>
          <button className={`${styles.choice} ${selectedCategory === 'all' ? styles.choiceActive : ''}`} onClick={() => setSelectedCategory('all')}>
            All chocolate {selectedCategory === 'all' && <Check className={styles.choiceIcon} />}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.choice} ${selectedCategory === category.name || selectedCategory === category.slug ? styles.choiceActive : ''}`}
              onClick={() => setSelectedCategory(category.slug || category.name)}
            >
              {category.name}
              {(selectedCategory === category.name || selectedCategory === category.slug) && <Check className={styles.choiceIcon} />}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <p className={styles.filterLabel}>Country</p>
        <select className={styles.select} value={selectedCountry} onChange={(event) => setSelectedCountry(event.target.value)}>
          <option value="all">All countries</option>
          {COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
        </select>
      </div>

      <div className={styles.filterSection}>
        <p className={styles.filterLabel}>Price</p>
        <div className={styles.priceInputs}>
          <input className={styles.input} type="number" placeholder="Min SEK" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
          <input className={styles.input} type="number" placeholder="Max SEK" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
        </div>
      </div>

      <div className={styles.filterSection}>
        <p className={styles.filterLabel}>Cacao percentage</p>
        <input className={styles.input} type="number" placeholder="Minimum %" value={minCacao} onChange={(event) => setMinCacao(event.target.value)} />
      </div>

      <div className={styles.filterSection}>
        <p className={styles.filterLabel}>Qualities</p>
        <label className={styles.toggle}><input type="checkbox" checked={veganOnly} onChange={(event) => setVeganOnly(event.target.checked)} /> <Leaf /> Vegan</label>
        <label className={styles.toggle}><input type="checkbox" checked={organicOnly} onChange={(event) => setOrganicOnly(event.target.checked)} /> <Sparkles /> Organic</label>
        <label className={styles.toggle}><input type="checkbox" checked={giftOnly} onChange={(event) => setGiftOnly(event.target.checked)} /> <PackageCheck /> Gift box</label>
      </div>

      {activeFilterCount > 0 && (
        <button className={styles.resetButton} onClick={clearFilters}>
          <RotateCcw className={styles.resetIcon} />
          Reset filters
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner fullScreen text="Melting chocolate..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>European artisan marketplace</p>
            <h1 className={styles.title}>Shop fine chocolate by maker, origin, and occasion.</h1>
            <p className={styles.subtitle}>
              Discover small-batch bars, truffles, pralines, and gift boxes from independent European chocolatiers.
            </p>
          </div>
          <div className={styles.heroStats}>
            <span>{products.length} products</span>
            <span>{demoCategories.length} collections</span>
            <span>{products.some(isDemoLikeProduct) ? 'Curated makers' : 'Live catalog'}</span>
          </div>
        </section>

        <section className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search truffles, pralines, vegan bars..."
              className={styles.searchInput}
            />
          </div>
          <button className={styles.mobileFilterButton} onClick={() => setIsFilterOpen(true)}>
            <SlidersHorizontal className={styles.filterIcon} />
            Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </button>
          <select className={styles.sortSelect} value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
            {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </section>

        <div className={styles.mainContent}>
          <aside className={styles.desktopSidebar}>
            <FilterPanel />
          </aside>

          {isFilterOpen && (
            <div className={styles.mobileFilterOverlay}>
              <button className={styles.mobileFilterBackdrop} aria-label="Close filters" onClick={() => setIsFilterOpen(false)} />
              <div className={styles.mobileFilterDrawer}>
                <div className={styles.mobileFilterHeader}>
                  <h2>Filters</h2>
                  <button className={styles.mobileFilterClose} onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
                    <X />
                  </button>
                </div>
                <FilterPanel />
                <Button className={styles.mobileApply} onClick={() => setIsFilterOpen(false)}>Show {filteredProducts.length} products</Button>
              </div>
            </div>
          )}

          <section className={styles.productArea}>
            <div className={styles.resultHeader}>
              <p>{filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}</p>
              {activeFilterCount > 0 && <button onClick={clearFilters}>Clear all</button>}
            </div>

            {filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No chocolates found</h3>
                <p>Try broadening the country, price, or cacao filters.</p>
                <Button variant="outline" onClick={clearFilters}>Reset filters</Button>
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
