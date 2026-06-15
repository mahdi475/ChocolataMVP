import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Gift, Leaf, Minus, PackageCheck, Plus, ShieldCheck, Star, ThermometerSun, Truck } from 'lucide-react';
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
import { getShippingPackaging, type ShippingPackagingInfo } from '../../lib/shippingPackaging';
import {
  DEMO_SELLER_PROFILE_SLUG,
  isPublicSellerProduct,
  isSellerProfileLive,
  loadSellerStoreProfile,
} from '../../lib/sellerProfile';
import { translateLabel } from '../../lib/translationLabels';
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
  shippingPackaging: undefined,
  story: product.description || '',
  gallery: [product.image_url, ...(product.gallery_images || [])].filter(Boolean) as string[],
});

const ProductDetailPage = () => {
  const { t } = useTranslation('ui');
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
        setError(t('productDetail.idRequired'));
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
        if (normalized.maker_slug === DEMO_SELLER_PROFILE_SLUG && (!isSellerProfileLive() || !isPublicSellerProduct(normalized))) {
          throw new Error(t('productDetail.notFound'));
        }
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
          setError(err.message || t('productDetail.loadFailed'));
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
      message: t('notifications.addedQuantityToCart', { quantity, product: product.name }),
    }));
  };

  if (loading) {
    return <div className={styles.container}><LoadingSpinner /></div>;
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || t('productDetail.notFound')}</div>
        <Button onClick={() => navigate('/catalog')}>{t('productDetail.backToCatalog')}</Button>
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
  const sellerProfile = chocolatierMatch?.slug === DEMO_SELLER_PROFILE_SLUG ? loadSellerStoreProfile() : null;
  const makerLogo = sellerProfile?.logoImage || chocolatierMatch?.logoImage;
  const isSoldOut = product.stock !== undefined && product.stock <= 0;
  const shippingPackaging = getShippingPackaging(product.shippingPackaging as ShippingPackagingInfo | undefined, {
    shipsFromCountry: product.country,
    shipsFromCity: product.city,
  });
  const productDescription = t(`productData.${product.id}.description`, { defaultValue: product.description || '' });
  const productStory = t(`productData.${product.id}.story`, { defaultValue: product.story || product.description || '' });
  const shipsFrom = [shippingPackaging.shipsFromCity, shippingPackaging.shipsFromCountry].filter(Boolean).join(', ');
  const deliveryEstimate = shippingPackaging.deliveryEstimate
    ? t('shippingPackaging.deliveryBusinessDays', { range: shippingPackaging.deliveryEstimate })
    : t('shippingPackaging.deliveryEstimateFallback');
  const productShippingItems = [
    {
      icon: Truck,
      label: t('shippingPackaging.shipsFrom'),
      value: shipsFrom || t('productDetail.europeanAtelier'),
    },
    {
      icon: ShieldCheck,
      label: t('shippingPackaging.deliveryEstimate'),
      value: deliveryEstimate,
    },
    {
      icon: PackageCheck,
      label: t('shippingPackaging.shippingEstimate'),
      value: t('shippingPackaging.calculatedAtCheckout'),
    },
    {
      icon: Gift,
      label: t('shippingPackaging.giftReady'),
      value: shippingPackaging.giftPackaging ? t('shippingPackaging.available') : t('shippingPackaging.onRequest'),
    },
    {
      icon: ThermometerSun,
      label: t('shippingPackaging.heatProtected'),
      value: shippingPackaging.heatProtection ? t('shippingPackaging.available') : t('shippingPackaging.onRequest'),
    },
    {
      icon: Leaf,
      label: t('shippingPackaging.ecoPackaging'),
      value: shippingPackaging.ecoPackaging ? t('shippingPackaging.available') : t('shippingPackaging.onRequest'),
    },
  ];

  return (
    <div className={styles.container}>
      <FadeIn>
        <div className={styles.breadcrumbs}>
          <Link to="/catalog">{t('nav.shop')}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <section className={styles.productLayout}>
          <div className={styles.gallery}>
            <div className={styles.mainImageWrap}>
              {activeImage ? (
                <img src={activeImage} alt={product.name} className={styles.mainImage} />
              ) : (
                <div className={styles.placeholder}>{t('productCard.noImage')}</div>
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
              <div className={styles.makerIdentity}>
                {makerLogo && <img src={makerLogo} alt="" className={styles.makerLogo} />}
                {makerProfilePath ? (
                  <Link to={makerProfilePath} aria-label={t('productCard.viewMakerProfileAria', { maker: chocolatierMatch?.name || makerName })}>
                    {chocolatierMatch?.name || makerName}
                  </Link>
                ) : (
                  <span>{makerName}</span>
                )}
              </div>
              {product.rating > 0 && (
                <span className={styles.rating}>
                  <Star fill="currentColor" />
                  {product.rating.toFixed(1)} ({t('productDetail.reviews', { count: product.reviews })})
                </span>
              )}
            </div>

            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.origin}>{[product.city, product.country].filter(Boolean).join(', ')}</p>
            <p className={styles.description}>{productStory || productDescription}</p>

            {makerProfilePath && (
              <Link to={makerProfilePath} className={styles.profileButton}>
                {t('productDetail.viewMakerProfile')}
              </Link>
            )}

            {product.badges.length > 0 && (
              <div className={styles.badges}>
                {product.badges.map((badge) => <span key={badge}>{translateLabel(t, 'badges', badge)}</span>)}
              </div>
            )}

            <div className={styles.price}>
              {new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(product.price)}
            </div>

            <div className={styles.buyBox}>
              <div className={styles.quantityRow}>
                <span>{t('productDetail.quantity')}</span>
                <div className={styles.quantityControl}>
                  <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label={t('cart.decrease')}><Minus /></button>
                  <strong>{quantity}</strong>
                  <button onClick={() => setQuantity((value) => Math.min(product.stock || 99, value + 1))} aria-label={t('cart.increase')}><Plus /></button>
                </div>
              </div>
              <Button size="lg" className={styles.addButton} onClick={handleAddToCart} disabled={isSoldOut}>
                {isSoldOut ? t('productCard.outOfStock') : t('productCard.addToCart')}
              </Button>
            </div>

            <div className={styles.shippingPanel} aria-labelledby="product-shipping-packaging">
              <div className={styles.shippingPanelHeader}>
                <h2 id="product-shipping-packaging">{t('shippingPackaging.productTitle')}</h2>
                <p>{t('shippingPackaging.productManagedByMaker')}</p>
              </div>
              <div className={styles.shippingGrid}>
                {productShippingItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className={styles.shippingItem}>
                      <Icon />
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.value}</small>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.infoGrid}>
          <div>
            <h2>{t('productDetail.productStory')}</h2>
            <p>{productStory || productDescription}</p>
          </div>
          <div>
            <h2>{t('productDetail.details')}</h2>
            <dl className={styles.specs}>
              <div><dt>{t('productDetail.cacao')}</dt><dd>{product.cacao_percentage ? `${product.cacao_percentage}%` : t('productDetail.variesByPiece')}</dd></div>
              <div><dt>{t('productDetail.weight')}</dt><dd>{product.weight || t('productDetail.seePackage')}</dd></div>
              <div><dt>{t('productDetail.origin')}</dt><dd>{[product.city, product.country].filter(Boolean).join(', ') || t('productDetail.europeanAtelier')}</dd></div>
            </dl>
          </div>
          <div>
            <h2>{t('productDetail.ingredients')}</h2>
            <p>{product.ingredients.length ? product.ingredients.join(', ') : t('productDetail.ingredientsFallback')}</p>
          </div>
          <div>
            <h2>{t('productDetail.allergens')}</h2>
            <p>{product.allergens.length ? product.allergens.join(', ') : t('productDetail.allergensFallback')}</p>
          </div>
        </section>

        <section className={styles.reviews}>
          <div>
            <h2>{t('productDetail.reviewsTitle')}</h2>
            <p>{t('productDetail.reviewsEmpty')}</p>
          </div>
          <div className={styles.reviewScore}>
            <Star fill="currentColor" />
            {product.rating ? product.rating.toFixed(1) : t('productDetail.new')}
          </div>
        </section>

        {sameMakerProducts.length > 0 && (
          <section className={styles.productSection}>
            <h2>{t('productDetail.moreFrom', { maker: product.maker_name })}</h2>
            <div className={styles.relatedGrid}>
              {sameMakerProducts.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className={styles.productSection}>
            <h2>{t('productDetail.similarProducts')}</h2>
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
