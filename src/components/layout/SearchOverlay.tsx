import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ArrowRight, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import type { Product } from '../../components/cards/ProductCard';
import styles from './SearchOverlay.module.css';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
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

        if (!error && data) {
          setResults(data);
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
          <button onClick={onClose} className={styles.closeButton} aria-label="Close search">
            <X className={styles.closeIcon} />
          </button>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            autoFocus
            type="text"
            placeholder="Search for truffles, bars, gifts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.submitButton} aria-label="Search">
            <ArrowRight className={styles.submitIcon} />
          </button>
        </form>

        <div className={styles.resultsContainer}>
          {query.length === 0 ? (
            <div>
              <h3 className={styles.trendingTitle}>
                <TrendingUp className={styles.trendingIcon} />
                Trending Now
              </h3>
              <div className={styles.trendingTerms}>
                {trendingTerms.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className={styles.trendingButton}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <p className={styles.loadingText}>Searching...</p>
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
                    <img src={product.image_url} alt={product.name} className={styles.resultImage} />
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
              No results found for "{query}".{' '}
              <button onClick={() => handleSearch()} className={styles.viewAllLink}>
                View all products
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;

