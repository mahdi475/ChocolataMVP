import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { removeItem, updateQuantity } from '../../store/slices/cartSlice';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FadeIn from '../../components/animations/FadeIn';
import styles from './CartPage.module.css';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
            <h1 className={styles.title}>Your Cart</h1>
            <p className={styles.empty}>Your cart is empty</p>
            <Button onClick={() => navigate('/catalog')}>Browse Products</Button>
          </Card>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <h1 className={styles.title}>Your Cart</h1>
        <div className={styles.content}>
          <div className={styles.items}>
            {cartItems.map((item) => (
              <Card key={item.id} className={styles.item}>
                <div className={styles.itemContent}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
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
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className={styles.quantityButton}
                      aria-label="Increase quantity"
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
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Card className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: 'SEK',
                }).format(total)}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Total</span>
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
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
};

export default CartPage;

