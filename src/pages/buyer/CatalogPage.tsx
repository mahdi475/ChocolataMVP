import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, X, Check, RotateCcw, ArrowUpDown } from 'lucide-react';
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

const SORT_OPTIONS = [
  { label: 'Featured', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
];

const CatalogPage = () => {
  const { t } = useTranslation('products');
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Filter states - initialize from URL params
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => searchParams.get('category') || 'all');
  const [minPrice, setMinPrice] = useState<string>(() => searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(() => searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState<SortOption>(() => (searchParams.get('sort') as SortOption) || 'newest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [itemsPerPage] = useState(12);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [productsResult, categoriesResult] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('name', { ascending: true }),
        ]);

        if (productsResult.error) {
          throw new Error(`Failed to load products: ${productsResult.error.message}`);
        }

        if (categoriesResult.error) {
          console.warn('⚠️ Failed to load categories:', categoriesResult.error.message);
        }

        const loadedProducts = productsResult.data || [];
        setProducts(loadedProducts);
        setCategories(categoriesResult.data || []);

        const counts: Record<string, number> = {};
        loadedProducts.forEach((product) => {
          if (product.category) {
            counts[product.category] = (counts[product.category] || 0) + 1;
          }
        });
        setCategoryCounts(counts);
      } catch (err: any) {
        console.error('❌ Catalog fetch error:', err);
        setError(err.message || 'Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter((term) => term.length > 0);
      result = result.filter((product) => {
        const searchableText = [product.name, product.description || '', product.category || '']
          .join(' ')
          .toLowerCase();
        return searchTerms.every((term) => searchableText.includes(term));
      });
    }

    if (selectedCategory !== 'all') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      result = result.filter((product) => product.price >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      result = result.filter((product) => product.price <= max);
    }

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

  useEffect(() => {
    const hasFilters = searchQuery || selectedCategory !== 'all' || minPrice || maxPrice;
    if (hasFilters && currentPage > 1) {
      const urlPage = searchParams.get('page');
      if (!urlPage || urlPage === '1') {
        setCurrentPage(1);
      }
    }
  }, [searchQuery, selectedCategory, minPrice, maxPrice, currentPage, searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    window.history.replaceState({}, '', `/catalog${newUrl}`);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, minPrice, maxPrice, sortBy, currentPage, setSearchParams]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateParams = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const FilterContent = () => {
    const [localMin, setLocalMin] = useState(minPrice);
    const [localMax, setLocalMax] = useState(maxPrice);

    const applyPrice = () => {
      const newParams = new URLSearchParams(searchParams);
      if (localMin) newParams.set('minPrice', localMin);
      else newParams.delete('minPrice');
      if (localMax) newParams.set('maxPrice', localMax);
      else newParams.delete('maxPrice');
      setSearchParams(newParams);
      setMinPrice(localMin);
      setMaxPrice(localMax);
    };

    return (
      <>
        <div className={styles.filterCategorySection}>
          <h4 className={styles.filterSectionTitle}>Categories</h4>
          <ul className={styles.categoryList}>
            <li>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setIsFilterOpen(false);
                }}
                className={`${styles.categoryButton} ${selectedCategory === 'all' ? styles.categoryButtonActive : ''}`}
              >
                <span>View All</span>
                {selectedCategory === 'all' && <Check className={styles.checkIcon} />}
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setIsFilterOpen(false);
                  }}
                  className={`${styles.categoryButton} ${selectedCategory === cat.name ? styles.categoryButtonActive : ''}`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.name && <Check className={styles.checkIcon} />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.filterPriceSection}>
          <h4 className={styles.filterSectionTitle}>Price Range</h4>
          <div className={styles.priceInputs}>
            <div className={styles.priceInputWrapper}>
              <span className={styles.pricePrefix}>SEK</span>
              <input
                type="number"
                placeholder="Min"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                onBlur={applyPrice}
                onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
                className={styles.priceInputField}
              />
            </div>
            <span className={styles.priceSeparator}>-</span>
            <div className={styles.priceInputWrapper}>
              <span className={styles.pricePrefix}>SEK</span>
              <input
                type="number"
                placeholder="Max"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                onBlur={applyPrice}
                onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
                className={styles.priceInputField}
              />
            </div>
          </div>
          <p className={styles.priceHint}>Press enter to apply</p>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner fullScreen text="Melting chocolate..." />
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

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || minPrice || maxPrice;
  const selectedCategoryName = categories.find((c) => c.name === selectedCategory)?.name || 'All Chocolates';

  return (
    <div className={styles.container}>
      <FadeIn>
        <div className={styles.header}>
          <div>
            <p className={styles.headerTag}>The Collection</p>
            <h1 className={styles.title}>{selectedCategoryName}</h1>
          </div>
          <div className={styles.headerActions}>
            <span className={styles.resultsCountDesktop}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Result' : 'Results'}
            </span>

            <button
              onClick={() => setIsFilterOpen(true)}
              className={styles.mobileFilterButton}
            >
              <SlidersHorizontal className={styles.filterIcon} /> Filters
            </button>

            <div className={styles.sortWrapper} ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={styles.sortButton}
              >
                <span className={styles.sortLabel}>Sort by:</span>
                <span className={styles.sortValue}>
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label || 'Featured'}
                </span>
                <ChevronDown className={`${styles.sortChevron} ${isSortOpen ? styles.sortChevronOpen : ''}`} />
              </button>

              {isSortOpen && (
                <div className={styles.sortDropdown}>
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value as SortOption);
                        setIsSortOpen(false);
                      }}
                      className={`${styles.sortOption} ${sortBy === option.value ? styles.sortOptionActive : ''}`}
                    >
                      {option.label}
                      {sortBy === option.value && <Check className={styles.sortCheckIcon} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <aside className={styles.desktopSidebar}>
            <div className={styles.sidebarSticky}>
              <h3 className={styles.sidebarTitle}>
                <SlidersHorizontal className={styles.sidebarIcon} /> Filters
              </h3>
              <FilterContent />
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className={styles.resetButton}>
                  <RotateCcw className={styles.resetIcon} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </aside>

          {isFilterOpen && (
            <div className={styles.mobileFilterOverlay}>
              <div className={styles.mobileFilterBackdrop} onClick={() => setIsFilterOpen(false)}></div>
              <div className={styles.mobileFilterDrawer}>
                <div className={styles.mobileFilterHeader}>
                  <h3 className={styles.mobileFilterTitle}>Filters</h3>
                  <button onClick={() => setIsFilterOpen(false)} className={styles.mobileFilterClose}>
                    <X className={styles.mobileFilterCloseIcon} />
                  </button>
                </div>
                <div className={styles.mobileFilterContent}>
                  <FilterContent />
                </div>
                <div className={styles.mobileFilterFooter}>
                  <Button onClick={() => setIsFilterOpen(false)} className={styles.mobileFilterApply}>
                    Show {filteredProducts.length} Results
                  </Button>
                  {hasActiveFilters && (
                    <button onClick={handleClearFilters} className={styles.mobileFilterReset}>
                      <RotateCcw className={styles.resetIcon} /> Reset Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className={styles.productArea}>
            {filteredProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                  <ArrowUpDown className={styles.emptyIcon} />
                </div>
                <h3 className={styles.emptyTitle}>No chocolates found</h3>
                <p className={styles.emptyText}>Try adjusting your price range or category.</p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={styles.grid}>
                  {paginatedProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      data-testid="pagination-prev"
                    >
                      Previous
                    </Button>

                    <div className={styles.pageNumbers}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                              data-testid={`pagination-page-${page}`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className={styles.pageEllipsis}>...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      data-testid="pagination-next"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default CatalogPage;
