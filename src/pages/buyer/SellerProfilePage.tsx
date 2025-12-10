import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient';
import ProductCard, { type Product } from '../../components/cards/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Card from '../../components/ui/Card';
import FadeIn from '../../components/animations/FadeIn';
import styles from './SellerProfilePage.module.css';

interface Seller {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

const SellerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('products');
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!id) {
        setError('Seller ID is required');
        setLoading(false);
        return;
      }

      try {
        // Fetch seller info
        const { data: sellerData, error: sellerError } = await supabase
          .from('users')
          .select('id, email, full_name, created_at')
          .eq('id', id)
          .eq('role', 'seller')
          .single();

        if (sellerError) throw sellerError;
        setSeller(sellerData);

        // Fetch seller's products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load seller information');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || 'Seller not found'}</div>
        <button onClick={() => navigate('/catalog')} className={styles.backButton}>
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <Card className={styles.sellerCard}>
          <h1 className={styles.sellerName}>{seller.full_name || seller.email}</h1>
          <p className={styles.sellerEmail}>{seller.email}</p>
          {seller.created_at && (
            <p className={styles.sellerSince}>
              Seller since {new Date(seller.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          )}
        </Card>

        <div className={styles.productsSection}>
          <h2 className={styles.productsTitle}>
            Products ({products.length})
          </h2>
          {products.length === 0 ? (
            <div className={styles.emptyState}>
              <p>This seller hasn't listed any products yet.</p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default SellerProfilePage;

