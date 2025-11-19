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

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      setError('You must be logged in to checkout');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          shipping_address: `${data.address}, ${data.city}, ${data.postalCode}, ${data.country}`,
          shipping_name: data.fullName,
          shipping_email: data.email,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (orderData) {
        const orderItems = cartItems.map((item) => ({
          order_id: orderData.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) throw itemsError;

        dispatch(addNotification({
          type: 'success',
          message: 'Order placed successfully!',
        }));
        dispatch(clearCart());
        navigate(`/checkout/confirmation/${orderData.id}`);
      }
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

