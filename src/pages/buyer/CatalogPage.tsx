import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient';
import ProductCard, { type Product } from '../../components/cards/ProductCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './CatalogPage.module.css';

interface Category {
  id: string;
  name: string;
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

const CatalogPage = () => {
  const { t } = useTranslation('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('📦 Fetching catalog data...');
        
        // Temporary: Add mock data so you can test the features
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Dark Chocolate 70%',
            description: 'Premium Belgian dark chocolate',
            price: 15.99,
            category: 'Dark Chocolate',
            stock: 50,
            image_url: null,
            is_active: true,
            seller_id: '1',
            created_at: new Date().toISOString()
          },
          {
            id: '2', 
            name: 'Milk Chocolate Truffles',
            description: 'Hand-crafted milk chocolate truffles',
            price: 24.99,
            category: 'Milk Chocolate',
            stock: 25,
            image_url: null,
            is_active: true,
            seller_id: '1',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'White Chocolate Hearts', 
            description: 'Valentine special white chocolate',
            price: 19.99,
            category: 'White Chocolate',
            stock: 30,
            image_url: null,
            is_active: true,
            seller_id: '1',
            created_at: new Date().toISOString()
          }
        ];

        const mockCategories = [
          { id: '1', name: 'Dark Chocolate' },
          { id: '2', name: 'Milk Chocolate' },
          { id: '3', name: 'White Chocolate' }
        ];

        console.log('✅ Using mock data for testing');
        setProducts(mockProducts);
        setCategories(mockCategories);
        
        // Still try Supabase in background for real data
        setTimeout(async () => {
          try {
            const [productsResult, categoriesResult] = await Promise.all([
              supabase.from('products').select('*').eq('is_active', true),
              supabase.from('categories').select('*').order('name', { ascending: true })
            ]);
            
            if (!productsResult.error && !categoriesResult.error) {
              console.log('✅ Real Supabase data loaded, replacing mock data');
              setProducts(productsResult.data || []);
              setCategories(categoriesResult.data || []);
            }
          } catch (err) {
            console.log('⚠️ Supabase still unreachable, keeping mock data');
          }
        }, 1000);

      } catch (err: any) {
        console.error('❌ Catalog fetch error:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        console.log('🏁 Setting catalog loading to false');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Price filters
    if (minPrice) {
      const min = parseFloat(minPrice);
      result = result.filter((product) => product.price >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      result = result.filter((product) => product.price <= max);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'newest':
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || minPrice || maxPrice;

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <h1 className={styles.title}>{t('catalog.title')}</h1>

        {/* Filters Section */}
        <div className={styles.filtersSection}>
          <div className={styles.searchBar}>
            <Input
              type="text"
              placeholder="Search products by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              data-testid="catalog-search"
            />
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label htmlFor="category-filter" className={styles.filterLabel}>
                Category:
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.select}
                data-testid="catalog-category-filter"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="min-price" className={styles.filterLabel}>
                Min Price:
              </label>
              <Input
                id="min-price"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className={styles.priceInput}
                data-testid="catalog-min-price"
              />
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="max-price" className={styles.filterLabel}>
                Max Price:
              </label>
              <Input
                id="max-price"
                type="number"
                placeholder="∞"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={styles.priceInput}
                data-testid="catalog-max-price"
              />
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="sort-by" className={styles.filterLabel}>
                Sort By:
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={styles.select}
                data-testid="catalog-sort"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A-Z</option>
                <option value="name_desc">Name: Z-A</option>
              </select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className={styles.clearButton}
                data-testid="catalog-clear-filters"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className={styles.resultsHeader}>
          <p className={styles.resultsCount}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.empty}>
              {hasActiveFilters
                ? 'No products match your filters. Try adjusting your search.'
                : t('catalog.empty')}
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  );
};

export default CatalogPage;

