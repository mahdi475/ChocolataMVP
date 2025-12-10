import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabaseClient';
import { addItem } from '../../store/slices/cartSlice';
import type { CartItem } from '../../store/slices/cartSlice';
import type { Product } from '../../components/cards/ProductCard';
import ProductCard from '../../components/cards/ProductCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ImageLightbox from '../../components/ui/ImageLightbox';
import FadeIn from '../../components/animations/FadeIn';
import styles from './ProductDetailPage.module.css';

interface Seller {
  id: string;
  email: string;
  full_name: string | null;
}

interface ProductWithSeller extends Product {
  seller?: Seller;
  seller_id: string;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('products');
  const dispatch = useDispatch();
  const [product, setProduct] = useState<ProductWithSeller | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        // Fetch product with seller information
        const { data, error: fetchError } = await supabase
          .from('products')
          .select(`
            *,
            seller:users!seller_id(id, email, full_name)
          `)
          .eq('id', id)
          .single();

        if (fetchError) {
          console.error('Error fetching product:', fetchError);
          throw fetchError;
        }
        
        console.log('Product data:', data);
        console.log('Seller data:', data?.seller);
        setProduct(data as ProductWithSeller);
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      setRelatedLoading(true);
      try {
        // Fetch products from same seller and same category
        const [sameSellerResult, sameCategoryResult] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('seller_id', product.seller_id)
            .eq('is_active', true)
            .neq('id', product.id)
            .limit(4),
          product.category
            ? supabase
                .from('products')
                .select('*')
                .eq('category', product.category)
                .eq('is_active', true)
                .neq('id', product.id)
                .neq('seller_id', product.seller_id)
                .limit(4)
            : Promise.resolve({ data: [], error: null })
        ]);

        // Combine and deduplicate products
        const sellerProducts = sameSellerResult.data || [];
        const categoryProducts = sameCategoryResult.data || [];
        
        // Prioritize seller products, then category products
        const combined = [...sellerProducts, ...categoryProducts];
        const uniqueProducts = combined.filter((product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
        );

        setRelatedProducts(uniqueProducts.slice(0, 6));
      } catch (err: any) {
        console.error('Failed to load related products:', err);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock !== undefined && product.stock <= 0) return;

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

  const isSoldOut = product.stock !== undefined && product.stock <= 0;
  const stockClasses = [styles.stock];
  if (isSoldOut) {
    stockClasses.push(styles.stockSoldOut);
  } else {
    stockClasses.push(styles.stockAvailable);
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <div className={styles.content}>
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              {product.image_url ? (
                <>
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className={styles.image}
                    onClick={() => setLightboxOpen(true)}
                    style={{ cursor: 'pointer' }}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.parentElement?.querySelector(`.${styles.placeholder}`) as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                  <button
                    className={styles.zoomHint}
                    onClick={() => setLightboxOpen(true)}
                    aria-label="View full size image"
                    title="Click to view full size"
                  >
                    🔍
                  </button>
                </>
              ) : (
                <div className={styles.placeholder}>
                  <span>🍫</span>
                  <span>No Image</span>
                </div>
              )}
              {isSoldOut && (
                <span className={styles.soldOutBadge}>{t('card.outOfStock')}</span>
              )}
            </div>
          </div>
          {product.image_url && (
            <ImageLightbox
              imageUrl={product.image_url}
              alt={product.name}
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
            />
          )}
          <div className={styles.detailsSection}>
            <Card>
              <h1 className={styles.title}>{product.name}</h1>
              {product.description && <p className={styles.description}>{product.description}</p>}
              
              {/* Seller Information */}
              {product.seller && (
                <div className={styles.sellerInfo}>
                  <div className={styles.sellerLabel}>Sold by:</div>
                  <Link 
                    to={`/seller/${product.seller.id}`} 
                    className={styles.sellerLink}
                  >
                    {product.seller.full_name || product.seller.email}
                  </Link>
                </div>
              )}

              <div className={styles.meta}>
                {product.category && (
                  <span className={styles.category}>
                    Category: <Link to={`/catalog?category=${encodeURIComponent(product.category)}`} className={styles.categoryLink}>{product.category}</Link>
                  </span>
                )}
                {product.stock !== undefined && (
                  <span className={stockClasses.join(' ')}>
                    {isSoldOut
                      ? t('card.outOfStock')
                      : `${product.stock} ${t('card.inStock')}`}
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
                disabled={isSoldOut}
                data-testid={`add-to-cart-detail-${product.id}`}
              >
                {isSoldOut ? t('card.outOfStock') : t('card.addToCart')}
              </Button>
            </Card>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>You might also like</h2>
            {relatedLoading ? (
              <LoadingSpinner />
            ) : (
              <div className={styles.relatedGrid}>
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            )}
          </div>
        )}
      </FadeIn>
    </div>
  );
};

export default ProductDetailPage;

