import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './CheckoutConfirmationPage.module.css';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  shipping_name: string;
  shipping_address: string;
  created_at: string;
}

const CheckoutConfirmationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.container}>
        <Card>
          <h1>Order Not Found</h1>
          <p>{error || 'The order you are looking for does not exist.'}</p>
          <Link to="/catalog">
            <Button>Back to Catalog</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <Card className={styles.confirmationCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.title}>Order Confirmed!</h1>
          <p className={styles.message}>Thank you for your purchase. Your order has been received.</p>
          <div className={styles.orderDetails}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Order Number:</span>
              <span className={styles.value}>#{order.id.slice(0, 8)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Total Amount:</span>
              <span className={styles.value}>
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: 'SEK',
                }).format(order.total_amount)}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Shipping To:</span>
              <span className={styles.value}>{order.shipping_name}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Address:</span>
              <span className={styles.value}>{order.shipping_address}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Order Date:</span>
              <span className={styles.value}>
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className={styles.actions}>
            <Link to={`/orders/${order.id}`}>
              <Button variant="outline">View Order Details</Button>
            </Link>
            <Link to="/catalog">
              <Button>Continue Shopping</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};

export default CheckoutConfirmationPage;

