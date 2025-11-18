import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabaseClient';
import { addItem } from '../../store/slices/cartSlice';
import type { CartItem } from '../../store/slices/cartSlice';
import type { Product } from '../../components/cards/ProductCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('products');
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image_url,
    };
    dispatch(addItem(cartItem));
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || 'Product not found'}</div>
        <Button onClick={() => navigate('/catalog')}>Back to Catalog</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <div className={styles.content}>
          <div className={styles.imageSection}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className={styles.image} />
            ) : (
              <div className={styles.placeholder}>No Image</div>
            )}
          </div>
          <div className={styles.detailsSection}>
            <Card>
              <h1 className={styles.title}>{product.name}</h1>
              {product.description && <p className={styles.description}>{product.description}</p>}
              <div className={styles.meta}>
                {product.category && (
                  <span className={styles.category}>Category: {product.category}</span>
                )}
                {product.stock !== undefined && (
                  <span className={styles.stock}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>
              <div className={styles.price}>
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: 'SEK',
                }).format(product.price)}
              </div>
              <Button
                onClick={handleAddToCart}
                size="lg"
                className={styles.addButton}
                disabled={product.stock === 0}
                data-testid={`add-to-cart-detail-${product.id}`}
              >
                {product.stock === 0 ? t('card.outOfStock') : t('card.addToCart')}
              </Button>
            </Card>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default ProductDetailPage;

