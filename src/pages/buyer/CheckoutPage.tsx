import { useState, useEffect, useMemo } from 'react';
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
import { processPayment, calculateShippingCost, calculateTax, calculateEstimatedDeliveryDate } from '../../lib/payment';
import { sendOrderConfirmationEmail } from '../../lib/email';
import type { PaymentMethod } from '../../components/checkout/PaymentMethodSelector';
import PaymentMethodSelector from '../../components/checkout/PaymentMethodSelector';
import AddressSelector, { type Address } from '../../components/checkout/AddressSelector';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './CheckoutPage.module.css';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  address_line1: z.string().min(5, 'Address is required'),
  address_line2: z.string().optional(),
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [address, setAddress] = useState<Address>({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: 'SE', // Default to Sweden
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      country: 'SE',
    },
  });

  // Watch form values to sync with address state
  const formValues = watch();

  useEffect(() => {
    // Sync address state with form values
    setAddress({
      full_name: formValues.fullName || '',
      address_line1: formValues.address_line1 || '',
      address_line2: formValues.address_line2 || '',
      city: formValues.city || '',
      postal_code: formValues.postalCode || '',
      country: formValues.country || 'SE',
    });
  }, [formValues]);

  // Calculate order totals
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const shippingCost = useMemo(() => {
    return calculateShippingCost(address.country || 'SE', subtotal);
  }, [address.country, subtotal]);

  const taxAmount = useMemo(() => {
    return calculateTax(subtotal, shippingCost, address.country || 'SE');
  }, [subtotal, shippingCost, address.country]);

  const total = useMemo(() => {
    return subtotal + shippingCost + taxAmount;
  }, [subtotal, shippingCost, taxAmount]);

  const estimatedDelivery = useMemo(() => {
    return calculateEstimatedDeliveryDate(address.country || 'SE');
  }, [address.country]);

  // Handle address change from AddressSelector
  const handleAddressChange = (newAddress: Address) => {
    setAddress(newAddress);
    setValue('fullName', newAddress.full_name);
    setValue('address_line1', newAddress.address_line1);
    setValue('address_line2', newAddress.address_line2 || '');
    setValue('city', newAddress.city);
    setValue('postalCode', newAddress.postal_code);
    setValue('country', newAddress.country);
  };

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
      // Step 1: Validate stock
      const { valid: stockIsAvailable } = await validateStockBeforeCheckout();
      if (!stockIsAvailable) {
        setIsSubmitting(false);
        return;
      }

      // Step 2: Process payment
      setIsProcessingPayment(true);
      const paymentResult = await processPayment(total, 'SEK', paymentMethod);

      if (!paymentResult.success) {
        setError(paymentResult.error || 'Payment processing failed. Please try again.');
        setIsProcessingPayment(false);
        setIsSubmitting(false);
        return;
      }

      setIsProcessingPayment(false);

      // Step 3: Create order with payment and shipping info
      const shippingAddress = `${data.address_line1}${data.address_line2 ? `, ${data.address_line2}` : ''}, ${data.city}, ${data.postalCode}, ${data.country}`;
      
      const { data: newOrderId, error: createOrderError } = await supabase.rpc(
        'create_order',
        {
          p_shipping_name: data.fullName,
          p_shipping_address: shippingAddress,
          p_shipping_email: data.email,
          p_items: cartItems.map(item => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
        }
      );

      if (createOrderError) throw createOrderError;

      // Step 4: Update order with payment and shipping details
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({
          payment_method: paymentMethod,
          payment_status: 'completed',
          payment_transaction_id: paymentResult.transactionId,
          shipping_cost: shippingCost,
          tax_amount: taxAmount,
          estimated_delivery_date: estimatedDelivery.toISOString().split('T')[0],
        })
        .eq('id', newOrderId);

      if (updateOrderError) {
        console.error('Failed to update order with payment info:', updateOrderError);
        // Don't fail the order, just log the error
      }

      // Step 5: Send order confirmation email (non-blocking)
      sendOrderConfirmationEmail({
        orderId: newOrderId,
        customerName: data.fullName,
        customerEmail: data.email,
        orderDate: new Date().toISOString(),
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shippingCost,
        taxAmount,
        total,
        shippingAddress: shippingAddress,
        estimatedDeliveryDate: estimatedDelivery.toISOString().split('T')[0],
        paymentMethod,
        paymentStatus: 'completed',
      }).catch(err => {
        console.error('Failed to send confirmation email:', err);
        // Don't fail the order if email fails
      });

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
      setIsProcessingPayment(false);
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
            
            {/* Address Selector */}
            <div className={styles.addressSection}>
              <AddressSelector
                value={address}
                onChange={handleAddressChange}
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
              <Input
                {...register('fullName')}
                label="Full Name"
                error={errors.fullName?.message}
                data-testid="checkout-fullName"
                value={address.full_name}
                onChange={(e) => {
                  setValue('fullName', e.target.value);
                  handleAddressChange({ ...address, full_name: e.target.value });
                }}
              />
              <Input
                {...register('email')}
                type="email"
                label="Email"
                error={errors.email?.message}
                data-testid="checkout-email"
              />
              <Input
                {...register('address_line1')}
                label="Address Line 1"
                error={errors.address_line1?.message}
                data-testid="checkout-address"
                value={address.address_line1}
                onChange={(e) => {
                  setValue('address_line1', e.target.value);
                  handleAddressChange({ ...address, address_line1: e.target.value });
                }}
              />
              <Input
                {...register('address_line2')}
                label="Address Line 2 (Optional)"
                error={errors.address_line2?.message}
                data-testid="checkout-address2"
                value={address.address_line2}
                onChange={(e) => {
                  setValue('address_line2', e.target.value);
                  handleAddressChange({ ...address, address_line2: e.target.value });
                }}
              />
              <div className={styles.row}>
                <Input
                  {...register('city')}
                  label="City"
                  error={errors.city?.message}
                  data-testid="checkout-city"
                  value={address.city}
                  onChange={(e) => {
                    setValue('city', e.target.value);
                    handleAddressChange({ ...address, city: e.target.value });
                  }}
                />
                <Input
                  {...register('postalCode')}
                  label="Postal Code"
                  error={errors.postalCode?.message}
                  data-testid="checkout-postalCode"
                  value={address.postal_code}
                  onChange={(e) => {
                    setValue('postalCode', e.target.value);
                    handleAddressChange({ ...address, postal_code: e.target.value });
                  }}
                />
              </div>
              <Input
                {...register('country')}
                label="Country"
                error={errors.country?.message}
                data-testid="checkout-country"
                value={address.country}
                onChange={(e) => {
                  setValue('country', e.target.value);
                  handleAddressChange({ ...address, country: e.target.value });
                }}
              />

              {/* Payment Method Selector */}
              <div className={styles.paymentSection}>
                <PaymentMethodSelector
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting || isProcessingPayment}
                size="lg"
                className={styles.submitButton}
                data-testid="checkout-submit"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? 'Processing Payment...' : 'Place Order'}
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
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>
                  {new Intl.NumberFormat('sv-SE', {
                    style: 'currency',
                    currency: 'SEK',
                  }).format(subtotal)}
                </span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className={styles.freeShipping}>FREE</span>
                  ) : (
                    new Intl.NumberFormat('sv-SE', {
                      style: 'currency',
                      currency: 'SEK',
                    }).format(shippingCost)
                  )}
                </span>
              </div>
              {taxAmount > 0 && (
                <div className={styles.totalRow}>
                  <span>Tax (VAT)</span>
                  <span>
                    {new Intl.NumberFormat('sv-SE', {
                      style: 'currency',
                      currency: 'SEK',
                    }).format(taxAmount)}
                  </span>
                </div>
              )}
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
            {estimatedDelivery && (
              <div className={styles.deliveryInfo}>
                <p className={styles.deliveryLabel}>Estimated Delivery:</p>
                <p className={styles.deliveryDate}>
                  {estimatedDelivery.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </Card>
        </div>
      </FadeIn>
    </div>
  );
};

export default CheckoutPage;
