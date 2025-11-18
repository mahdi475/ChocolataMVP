import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './SellerOrdersPage.module.css';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_name: string;
}

const SellerOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setOrders(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <h1 className={styles.title}>Orders</h1>
        {error && <div className={styles.error}>{error}</div>}
        {orders.length === 0 ? (
          <Card>
            <p className={styles.empty}>No orders yet</p>
          </Card>
        ) : (
          <div className={styles.orders}>
            {orders.map((order) => (
              <Card key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <h3 className={styles.orderId}>Order #{order.id.slice(0, 8)}</h3>
                    <p className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`${styles.status} ${styles[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className={styles.orderDetails}>
                  <p className={styles.customer}>Customer: {order.shipping_name}</p>
                  <p className={styles.total}>
                    Total:{' '}
                    {new Intl.NumberFormat('sv-SE', {
                      style: 'currency',
                      currency: 'SEK',
                    }).format(order.total_amount)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  );
};

export default SellerOrdersPage;

