import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import type { RootState } from '../../store';
import { clearCart } from '../../store/slices/cartSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FadeIn from '../../components/animations/FadeIn';
import styles from './CheckoutPage.module.css';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  interface ProductStockInfo {
    id: string;
    stock: number | null;
    name: string;
  }

  interface StockValidationResult {
    valid: boolean;
    productMap?: Map<string, ProductStockInfo>;
  }

  const validateStockBeforeCheckout = async (): Promise<StockValidationResult> => {
    const productIds = Array.from(new Set(cartItems.map((item) => item.productId)));
    if (productIds.length === 0) {
      setError('Your cart is empty');
      return { valid: false };
    }

    const { data: liveProducts, error: stockFetchError } = await supabase
      .from('products')
      .select('id, stock, name')
      .in('id', productIds);

    if (stockFetchError) {
      setError('Could not verify stock levels. Please try again.');
      return { valid: false };
    }

    const productMap = new Map<string, ProductStockInfo>(
      (liveProducts || []).map((product) => [product.id, product])
    );

    for (const item of cartItems) {
      const productInfo = productMap.get(item.productId);
      if (!productInfo) {
        setError('One of your selected products is no longer available. Please update your cart.');
        return { valid: false };
      }

      const available = productInfo.stock ?? 0;
      if (available <= 0) {
        setError(`${productInfo.name} is sold out. Remove it from your cart to continue.`);
        return { valid: false };
      }

      if (item.quantity > available) {
        setError(`Only ${available} left of ${productInfo.name}. Update the quantity to continue.`);
        return { valid: false };
      }
    }

    return { valid: true, productMap };
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      setError('You must be logged in to checkout');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { valid: stockIsAvailable, productMap } = await validateStockBeforeCheckout();
      if (!stockIsAvailable || !productMap) {
        return;
      }

      const { data: newOrderId, error: createOrderError } = await supabase.rpc(
        'create_order',
        {
          p_shipping_name: data.fullName,
          p_shipping_address: `${data.address}, ${data.city}, ${data.postalCode}, ${data.country}`,
          p_shipping_email: data.email,
          p_items: cartItems.map(item => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
        }
      );

      if (createOrderError) throw createOrderError;

      dispatch(addNotification({
        type: 'success',
        message: 'Order placed successfully!',
      }));
      dispatch(clearCart());
      navigate(`/checkout/confirmation/${newOrderId}`);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to place order';
      setError(errorMsg);
      dispatch(addNotification({
        type: 'error',
        message: errorMsg,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <Card>
          <h1>Checkout</h1>
          <p>Your cart is empty</p>
          <Button onClick={() => navigate('/catalog')}>Browse Products</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <h1 className={styles.title}>Checkout</h1>
        <div className={styles.content}>
          <Card className={styles.formCard}>
            <h2 className={styles.formTitle}>Shipping Information</h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
              <Input
                {...register('fullName')}
                label="Full Name"
                error={errors.fullName?.message}
                data-testid="checkout-fullName"
              />
              <Input
                {...register('email')}
                type="email"
                label="Email"
                error={errors.email?.message}
                data-testid="checkout-email"
              />
              <Input
                {...register('address')}
                label="Address"
                error={errors.address?.message}
                data-testid="checkout-address"
              />
              <div className={styles.row}>
                <Input
                  {...register('city')}
                  label="City"
                  error={errors.city?.message}
                  data-testid="checkout-city"
                />
                <Input
                  {...register('postalCode')}
                  label="Postal Code"
                  error={errors.postalCode?.message}
                  data-testid="checkout-postalCode"
                />
              </div>
              <Input
                {...register('country')}
                label="Country"
                error={errors.country?.message}
                data-testid="checkout-country"
              />
              <Button
                type="submit"
                isLoading={isSubmitting}
                size="lg"
                className={styles.submitButton}
                data-testid="checkout-submit"
              >
                Place Order
              </Button>
            </form>
          </Card>
          <Card className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.items}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>
                    {new Intl.NumberFormat('sv-SE', {
                      style: 'currency',
                      currency: 'SEK',
                    }).format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: 'SEK',
                }).format(total)}
              </span>
            </div>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
};

export default CheckoutPage;

