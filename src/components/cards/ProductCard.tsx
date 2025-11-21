import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItem } from '../../store/slices/cartSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import type { CartItem } from '../../store/slices/cartSlice';
import Button from '../ui/Button';
import Card from '../ui/Card';
import FadeIn from '../animations/FadeIn';
import styles from './ProductCard.module.css';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  stock?: number;
  created_at?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { t } = useTranslation('products');
  const dispatch = useDispatch();
  const isSoldOut = product.stock !== undefined && product.stock <= 0;

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
    <FadeIn>
      <Card className={styles.card}>
        <Link to={`/product/${product.id}`} className={styles.link}>
          <div className={styles.imageContainer}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className={styles.image} />
            ) : (
              <div className={styles.placeholder}>No Image</div>
            )}
            {isSoldOut && (
              <span className={styles.soldOutBadge}>{t('card.outOfStock', 'Slutsåld')}</span>
            )}
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{product.name}</h3>
            {product.description && (
              <p className={styles.description}>{product.description}</p>
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
                    ? `${product.stock} ${t('card.inStock')}`
                    : t('card.outOfStock', 'Slutsåld')}
                </span>
              )}
            </div>
          </div>
        </Link>
        <Button
          onClick={handleAddToCart}
          className={styles.addButton}
          disabled={isSoldOut}
          data-testid={`add-to-cart-${product.id}`}
        >
          {isSoldOut ? t('card.outOfStock') : t('card.addToCart')}
        </Button>
      </Card>
    </FadeIn>
  );
};

export default ProductCard;

