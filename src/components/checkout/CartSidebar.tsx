import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCart } from '../../contexts/CartContext';
import type { RootState } from '../../store';
import { removeItem, updateQuantity } from '../../store/slices/cartSlice';
import Button from '../ui/Button';
import styles from './CartSidebar.module.css';

const CartSidebar = () => {
  const { isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isCartOpen) return null;

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeItem(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleRemove = (productId: string) => {
    dispatch(removeItem(productId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Basket</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className={styles.closeButton}
            aria-label="Close cart"
          >
            <X className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>Your basket is empty.</p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImageContainer}>
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                    )}
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemPrice}>
                      {new Intl.NumberFormat('sv-SE', {
                        style: 'currency',
                        currency: 'SEK',
                      }).format(item.price)}
                    </p>
                    <div className={styles.itemActions}>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className={styles.quantityButton}
                          aria-label="Decrease quantity"
                        >
                          <Minus className={styles.quantityIcon} />
                        </button>
                        <span className={styles.quantityValue}>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className={styles.quantityButton}
                          aria-label="Increase quantity"
                        >
                          <Plus className={styles.quantityIcon} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className={styles.removeButton}
                        aria-label="Remove item"
                      >
                        <Trash2 className={styles.removeIcon} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Subtotal</span>
              <span className={styles.totalAmount}>
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: 'SEK',
                }).format(cartTotal)}
              </span>
            </div>
            <p className={styles.shippingNote}>Shipping and taxes calculated at checkout.</p>
            <Button className={styles.checkoutButton} onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;

