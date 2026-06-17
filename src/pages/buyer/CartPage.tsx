import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store';
import { removeItem, updateQuantity } from '../../store/slices/cartSlice';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StoredImage from '../../components/ui/StoredImage';
import FadeIn from '../../components/animations/FadeIn';
import styles from './CartPage.module.css';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation('ui');
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (productId: string) => {
    dispatch(removeItem(productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <FadeIn>
          <Card>
            <h1 className={styles.title}>{t('cart.pageTitle')}</h1>
            <p className={styles.empty}>{t('cart.empty')}</p>
            <Button onClick={() => navigate('/catalog')}>{t('cart.browseProducts')}</Button>
          </Card>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <h1 className={styles.title}>{t('cart.pageTitle')}</h1>
        <div className={styles.content}>
          <div className={styles.items}>
            {cartItems.map((item) => (
              <Card key={item.id} className={styles.item}>
                <div className={styles.itemContent}>
                  {item.imageUrl && (
                    <StoredImage src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                  )}
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <div className={styles.itemPrice}>
                      {new Intl.NumberFormat('sv-SE', {
                        style: 'currency',
                        currency: 'SEK',
                      }).format(item.price)}
                    </div>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.quantity}>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className={styles.quantityButton}
                      aria-label={t('cart.decrease')}
                    >
                      −
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className={styles.quantityButton}
                      aria-label={t('cart.increase')}
                    >
                      +
                    </button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(item.productId)}
                    data-testid={`remove-${item.productId}`}
                  >
                    {t('cart.remove')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Card className={styles.summary}>
            <h2 className={styles.summaryTitle}>{t('cart.orderSummary')}</h2>
            <div className={styles.summaryRow}>
              <span>{t('cart.subtotal')}</span>
              <span>
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: 'SEK',
                }).format(total)}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>{t('cart.total')}</span>
              <span className={styles.total}>
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: 'SEK',
                }).format(total)}
              </span>
            </div>
            <Button
              size="lg"
              className={styles.checkoutButton}
              onClick={() => navigate('/checkout')}
              data-testid="proceed-to-checkout"
            >
              {t('cart.proceedToCheckout')}
            </Button>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
};

export default CartPage;

