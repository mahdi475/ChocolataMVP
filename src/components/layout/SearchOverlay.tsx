import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ArrowRight, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient';
import type { Product } from '../../components/cards/ProductCard';
import { demoProducts } from '../../data/demoCatalog';
import { translateLabel } from '../../lib/translationLabels';
import { readPublicDemoSellerProducts } from '../../lib/marketplaceData';
import { findSellerStoreProfileBySlug, isPublicSellerProduct } from '../../lib/sellerProfile';
import StoredImage from '../ui/StoredImage';
import styles from './SearchOverlay.module.css';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const isPublicSearchProduct = (product: Product) => {
  const sellerProfile = findSellerStoreProfileBySlug(product.maker_slug);
  if (sellerProfile) return isPublicSellerProduct(product, sellerProfile);
  return product.is_active !== false && product.status !== 'draft' && product.status !== 'archived';
};

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const { t } = useTranslation('ui');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 1) {
      setLoading(true);
      const searchProducts = async () => {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(4);

        if (!error && data?.length) {
          const normalizedQuery = query.toLowerCase();
          const sellerProducts = readPublicDemoSellerProducts().filter((product) =>
            [product.name, product.category || '', product.description || '']
              .join(' ')
              .toLowerCase()
              .includes(normalizedQuery)
          );
          const publicResults = (data as Product[]).filter(isPublicSearchProduct);
          setResults([...sellerProducts, ...publicResults].slice(0, 4));
        } else {
          const normalizedQuery = query.toLowerCase();
          setResults(
            [...readPublicDemoSellerProducts(), ...demoProducts]
              .filter((product) =>
                [product.name, product.category || '', product.description || '']
                  .join(' ')
                  .toLowerCase()
                  .includes(normalizedQuery)
              )
              .slice(0, 4)
          );
        }
        setLoading(false);
      };
      searchProducts();
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    onClose();
    navigate(`/catalog?search=${encodeURIComponent(query)}`);
  };

  const trendingTerms = ['Dark Chocolate', 'Vegan', 'Gift Box', 'Hazelnuts', 'Truffles'];

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={onClose} className={styles.closeButton} aria-label={t('search.close')}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            autoFocus
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.submitButton} aria-label={t('nav.search')}>
            <ArrowRight className={styles.submitIcon} />
          </button>
        </form>

        <div className={styles.resultsContainer}>
          {query.length === 0 ? (
            <div>
              <h3 className={styles.trendingTitle}>
                <TrendingUp className={styles.trendingIcon} />
                {t('search.trendingNow')}
              </h3>
              <div className={styles.trendingTerms}>
                {trendingTerms.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className={styles.trendingButton}
                  >
                    {translateLabel(t, 'searchTerms', term)}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <p className={styles.loadingText}>{t('search.loading')}</p>
          ) : results.length > 0 ? (
            <div className={styles.resultsGrid}>
              {results.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  key={product.id}
                  className={styles.resultItem}
                >
                  {product.image_url && (
                    <StoredImage src={product.image_url} alt={product.name} className={styles.resultImage} />
                  )}
                  <div className={styles.resultContent}>
                    <h4 className={styles.resultName}>{product.name}</h4>
                    <p className={styles.resultPrice}>
                      {new Intl.NumberFormat('sv-SE', {
                        style: 'currency',
                        currency: 'SEK',
                      }).format(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.noResults}>
              {t('search.noResults', { query })}{' '}
              <button onClick={() => handleSearch()} className={styles.viewAllLink}>
                {t('search.viewAllProducts')}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
