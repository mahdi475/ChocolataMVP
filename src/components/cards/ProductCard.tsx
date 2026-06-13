import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { MapPin, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { addItem } from '../../store/slices/cartSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import type { CartItem } from '../../store/slices/cartSlice';
import { findChocolatierForProduct, getChocolatierProfilePath } from '../../lib/chocolatierMatcher';
import Button from '../ui/Button';
import Card from '../ui/Card';
import styles from './ProductCard.module.css';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  country?: string;
  stock?: number;
  created_at?: string;
  seller_id?: string;
  maker_id?: string;
  maker_name?: string;
  maker_slug?: string;
  city?: string;
  rating?: number;
  reviews?: number;
  badges?: string[];
  cacao_percentage?: number;
  is_vegan?: boolean;
  is_organic?: boolean;
  is_gift_box?: boolean;
  is_popular?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation(['ui', 'products']);
  const dispatch = useDispatch();
  const isSoldOut = product.stock !== undefined && product.stock <= 0;
  const isLowStock = !isSoldOut && product.stock !== undefined && product.stock > 0 && product.stock < 5;
  const makerName = product.maker_name || 'Chocolata maker';
  const chocolatierMatch = findChocolatierForProduct(product);
  const makerProfilePath = chocolatierMatch ? getChocolatierProfilePath(chocolatierMatch.slug) : null;
  const origin = [product.city, product.country].filter(Boolean).join(', ');
  const badges = product.badges?.length
    ? product.badges
    : [
        product.is_organic ? 'Organic' : null,
        product.is_vegan ? 'Vegan' : null,
        product.is_gift_box ? 'Gift box' : null,
      ].filter(Boolean) as string[];

  const handleAddToCart = () => {
    if (isSoldOut) return;

    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image_url,
    };

    dispatch(addItem(cartItem));
    dispatch(addNotification({
      type: 'success',
      message: `${product.name} added to cart!`,
      duration: 3000,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className={styles.card}>
        <Link to={`/product/${product.id}`} className={styles.imageLink} aria-label={`View ${product.name}`}>
          <div className={styles.imageContainer}>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className={styles.image}
                loading="lazy"
                onError={(event) => {
                  const target = event.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.parentElement?.querySelector(`.${styles.placeholder}`) as HTMLElement;
                  if (placeholder) {
                    placeholder.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            {(!product.image_url || product.image_url === '') && (
              <div className={styles.placeholder}>
                <span>Chocolate</span>
                <span>No Image</span>
              </div>
            )}
            <div className={styles.priceBadge}>
              {new Intl.NumberFormat('sv-SE', {
                style: 'currency',
                currency: 'SEK',
              }).format(product.price)}
            </div>
            {product.cacao_percentage && (
              <span className={styles.cacaoBadge}>{product.cacao_percentage}% cacao</span>
            )}
            {isSoldOut && (
              <span className={styles.soldOutBadge}>{t('ui:productCard.outOfStock')}</span>
            )}
            {isLowStock && (
              <span className={styles.lowStockBadge}>{t('ui:productCard.lowStock')}</span>
            )}
            {product.description && (
              <div className={styles.hoverOverlay}>{product.description}</div>
            )}
          </div>
        </Link>

        <div className={styles.content}>
          <div className={styles.makerRow}>
            {makerProfilePath ? (
              <Link
                to={makerProfilePath}
                className={styles.makerLink}
                aria-label={`View ${chocolatierMatch?.name || makerName} chocolatier profile`}
              >
                {chocolatierMatch?.name || makerName}
              </Link>
            ) : (
              <span className={styles.maker}>{makerName}</span>
            )}
            {product.rating && (
              <span className={styles.rating}>
                <Star className={styles.ratingIcon} fill="currentColor" />
                {product.rating.toFixed(1)}
                {product.reviews ? <span className={styles.reviewCount}>({product.reviews})</span> : null}
              </span>
            )}
          </div>

          <Link to={`/product/${product.id}`} className={styles.titleLink}>
            <h3 className={styles.title}>{product.name}</h3>
          </Link>

          {origin && makerProfilePath ? (
            <Link
              to={makerProfilePath}
              className={styles.originLink}
              aria-label={`View ${chocolatierMatch?.name || makerName} profile`}
            >
              <MapPin className={styles.originIcon} />
              {origin}
            </Link>
          ) : origin ? (
            <p className={styles.origin}>
              <MapPin className={styles.originIcon} />
              {origin}
            </p>
          ) : null}

          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}
          {badges.length > 0 && (
            <div className={styles.badges}>
              {badges.slice(0, 3).map((badge) => (
                <span key={badge} className={styles.badge}>{badge}</span>
              ))}
            </div>
          )}
          <div className={styles.footer}>
            <span className={styles.price}>
              {new Intl.NumberFormat('sv-SE', {
                style: 'currency',
                currency: 'SEK',
              }).format(product.price)}
            </span>
            {product.stock !== undefined && (
              <span className={styles.stock}>
                {product.stock > 0
                  ? `${product.stock} ${t('ui:productCard.inStock')}`
                  : t('ui:productCard.outOfStock')}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          className={styles.addButton}
          disabled={isSoldOut}
          data-testid={`add-to-cart-${product.id}`}
          variant={isSoldOut ? 'outline' : 'primary'}
        >
          <ShoppingBag className={styles.addIcon} />
          {isSoldOut ? t('ui:productCard.outOfStock') : t('ui:productCard.addToCart')}
        </Button>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
