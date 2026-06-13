import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Minus, PackageCheck, Plus, ShieldCheck, Star, Truck } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabaseClient';
import { addItem } from '../../store/slices/cartSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import type { CartItem } from '../../store/slices/cartSlice';
import type { Product } from '../../components/cards/ProductCard';
import ProductCard from '../../components/cards/ProductCard';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import {
  demoProducts,
  getDemoMakerById,
  getDemoProductById,
  type PremiumProduct,
} from '../../data/demoCatalog';
import { findChocolatierMatch, getChocolatierProfilePath } from '../../lib/chocolatierMatcher';
import styles from './ProductDetailPage.module.css';

interface Seller {
  id: string;
  email: string;
  full_name: string | null;
}

interface ProductWithSeller extends PremiumProduct {
  seller?: Seller;
}

const asPremiumProduct = (product: Product): ProductWithSeller => ({
  ...product,
  maker_id: product.maker_slug || product.seller_id || 'demo-seller',
  maker_name: product.maker_name || product.seller_id || 'Chocolata maker',
  maker_slug: product.maker_slug || product.seller_id || 'demo-seller',
  city: product.city || '',
  rating: product.rating || 0,
  reviews: product.reviews || 0,
  badges: product.badges || [],
  ingredients: [],
  allergens: [],
  weight: '',
  shipping_info: '',
  story: product.description || '',
  gallery: product.image_url ? [product.image_url] : [],
});

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<ProductWithSeller | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [sameMakerProducts, setSameMakerProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

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
          .select(`
            *,
            seller:users!seller_id(id, email, full_name)
          `)
          .eq('id', id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        const normalized = asPremiumProduct(data as Product);
        normalized.seller = data?.seller as Seller | undefined;
        if (!normalized.maker_name || normalized.maker_name === normalized.seller_id) {
          normalized.maker_name = normalized.seller?.full_name || normalized.seller?.email || normalized.maker_name;
        }
        setProduct(normalized);
        setActiveImage(normalized.gallery[0] || normalized.image_url || '');
      } catch (err: any) {
        const fallbackProduct = getDemoProductById(id);
        if (fallbackProduct) {
          const fallbackMaker = getDemoMakerById(fallbackProduct.maker_id);
          setProduct({
            ...fallbackProduct,
            seller: fallbackMaker
              ? {
                  id: fallbackMaker.id,
                  email: fallbackMaker.email,
                  full_name: fallbackMaker.name,
                }
              : undefined,
          });
          setActiveImage(fallbackProduct.gallery[0] || fallbackProduct.image_url || '');
          setError(null);
        } else {
          setError(err.message || 'Failed to load product');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      try {
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
                .limit(4)
            : Promise.resolve({ data: [], error: null }),
        ]);

        const sellerProducts = sameSellerResult.data || [];
        const categoryProducts = sameCategoryResult.data || [];
        const combined = [...sellerProducts, ...categoryProducts].filter(
          (item, index, self) => index === self.findIndex((candidate) => candidate.id === item.id)
        );

        setSameMakerProducts(
          sellerProducts.length
            ? sellerProducts.slice(0, 4)
            : demoProducts.filter((item) => item.maker_id === product.maker_id && item.id !== product.id).slice(0, 4)
        );
        setRelatedProducts(
          combined.length
            ? combined.slice(0, 4)
            : demoProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)
        );
      } catch (err) {
        console.error('Failed to load related products:', err);
        setSameMakerProducts(demoProducts.filter((item) => item.maker_id === product.maker_id && item.id !== product.id).slice(0, 4));
        setRelatedProducts(demoProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4));
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const images = [product.image_url, ...(product.gallery || [])].filter(Boolean) as string[];
    return Array.from(new Set(images));
  }, [product]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;

    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.image_url,
    };

    dispatch(addItem(cartItem));
    dispatch(addNotification({
      type: 'success',
      message: `${quantity} x ${product.name} added to cart`,
    }));
  };

  if (loading) {
    return <div className={styles.container}><LoadingSpinner /></div>;
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || 'Product not found'}</div>
        <Button onClick={() => navigate('/catalog')}>Back to Catalog</Button>
      </div>
    );
  }

  const makerName = product.maker_name || product.seller?.full_name || 'Chocolata maker';
  const chocolatierMatch = findChocolatierMatch(
    makerName,
    product.maker_slug,
    product.maker_id,
    product.seller?.full_name,
    product.seller_id
  );
  const makerProfilePath = chocolatierMatch ? getChocolatierProfilePath(chocolatierMatch.slug) : undefined;
  const isSoldOut = product.stock !== undefined && product.stock <= 0;

  return (
    <div className={styles.container}>
      <FadeIn>
        <div className={styles.breadcrumbs}>
          <Link to="/catalog">Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <section className={styles.productLayout}>
          <div className={styles.gallery}>
            <div className={styles.mainImageWrap}>
              {activeImage ? (
                <img src={activeImage} alt={product.name} className={styles.mainImage} />
              ) : (
                <div className={styles.placeholder}>No image</div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className={styles.thumbnails}>
                {gallery.map((image) => (
                  <button
                    key={image}
                    className={`${styles.thumbnail} ${activeImage === image ? styles.thumbnailActive : ''}`}
                    onClick={() => setActiveImage(image)}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.details}>
            <div className={styles.makerLine}>
              {makerProfilePath ? (
                <Link to={makerProfilePath} aria-label={`View ${chocolatierMatch?.name || makerName} chocolatier profile`}>
                  {chocolatierMatch?.name || makerName}
                </Link>
              ) : (
                <span>{makerName}</span>
              )}
              {product.rating > 0 && (
                <span className={styles.rating}>
                  <Star fill="currentColor" />
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
              )}
            </div>

            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.origin}>{[product.city, product.country].filter(Boolean).join(', ')}</p>
            <p className={styles.description}>{product.story || product.description}</p>

            {makerProfilePath && (
              <Link to={makerProfilePath} className={styles.profileButton}>
                View maker profile
              </Link>
            )}

            {product.badges.length > 0 && (
              <div className={styles.badges}>
                {product.badges.map((badge) => <span key={badge}>{badge}</span>)}
              </div>
            )}

            <div className={styles.price}>
              {new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(product.price)}
            </div>

            <div className={styles.buyBox}>
              <div className={styles.quantityRow}>
                <span>Quantity</span>
                <div className={styles.quantityControl}>
                  <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus /></button>
                  <strong>{quantity}</strong>
                  <button onClick={() => setQuantity((value) => Math.min(product.stock || 99, value + 1))} aria-label="Increase quantity"><Plus /></button>
                </div>
              </div>
              <Button size="lg" className={styles.addButton} onClick={handleAddToCart} disabled={isSoldOut}>
                {isSoldOut ? 'Out of stock' : 'Add to cart'}
              </Button>
            </div>

            <div className={styles.assuranceGrid}>
              <div><Truck /> {product.shipping_info || 'Ships from the maker in protective packaging.'}</div>
              <div><PackageCheck /> {product.weight || 'Small batch format'}</div>
              <div><ShieldCheck /> Secure checkout and buyer support</div>
            </div>
          </div>
        </section>

        <section className={styles.infoGrid}>
          <div>
            <h2>Product Story</h2>
            <p>{product.story || product.description}</p>
          </div>
          <div>
            <h2>Details</h2>
            <dl className={styles.specs}>
              <div><dt>Cacao</dt><dd>{product.cacao_percentage ? `${product.cacao_percentage}%` : 'Varies by piece'}</dd></div>
              <div><dt>Weight</dt><dd>{product.weight || 'See package'}</dd></div>
              <div><dt>Origin</dt><dd>{[product.city, product.country].filter(Boolean).join(', ') || 'European atelier'}</dd></div>
            </dl>
          </div>
          <div>
            <h2>Ingredients</h2>
            <p>{product.ingredients.length ? product.ingredients.join(', ') : 'Ingredient details available from the maker.'}</p>
          </div>
          <div>
            <h2>Allergens</h2>
            <p>{product.allergens.length ? product.allergens.join(', ') : 'May contain milk, nuts, and soy.'}</p>
          </div>
        </section>

        <section className={styles.reviews}>
          <div>
            <h2>Reviews</h2>
            <p>Customer reviews will appear here once verified purchases are collected.</p>
          </div>
          <div className={styles.reviewScore}>
            <Star fill="currentColor" />
            {product.rating ? product.rating.toFixed(1) : 'New'}
          </div>
        </section>

        {sameMakerProducts.length > 0 && (
          <section className={styles.productSection}>
            <h2>More from {product.maker_name}</h2>
            <div className={styles.relatedGrid}>
              {sameMakerProducts.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className={styles.productSection}>
            <h2>Similar products</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </section>
        )}
      </FadeIn>
    </div>
  );
};

export default ProductDetailPage;
