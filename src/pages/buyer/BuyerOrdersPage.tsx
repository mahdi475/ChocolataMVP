import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './BuyerOrdersPage.module.css';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  shipping_name: string;
  shipping_address: string;
  shipping_email: string;
  created_at: string;
}

const BuyerOrdersPage = () => {
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
          .eq('user_id', user.id)
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { text: 'Pending', className: styles.statusPending },
      processing: { text: 'Processing', className: styles.statusProcessing },
      shipped: { text: 'Shipped', className: styles.statusShipped },
      completed: { text: 'Completed', className: styles.statusCompleted },
      cancelled: { text: 'Cancelled', className: styles.statusCancelled },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <span className={`${styles.statusBadge} ${statusInfo.className}`}>{statusInfo.text}</span>;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  const heroBadgeText = orders.length === 0 ? 'Awaiting first delight' : `${orders.length} orders tracked`;

  return (
    <div className={styles.container}>
      <FadeIn>
        <div className={styles.panel}>
          <div className={styles.hero}>
            <div className={styles.heroText}>
              <p className={styles.heroTag}>Orders</p>
              <h2 className={styles.heroTitle}>My Chocolate Journey</h2>
              <p className={styles.heroSubtitle}>Every order is a handcrafted celebration—track the shimmer from bean to bar.</p>
            </div>
            <span className={styles.heroBadge}>{heroBadgeText}</span>
          </div>

          <div className={styles.header}>
            <h1 className={styles.title}>My Orders</h1>
            <Link to="/catalog">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {orders.length === 0 ? (
            <Card className={styles.emptyCard}>
              <p className={styles.empty}>You haven't placed any orders yet.</p>
              <Link to="/catalog">
                <Button>Browse Products</Button>
              </Link>
            </Card>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <Card key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <h3 className={styles.orderId}>Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                      <p className={styles.orderDate}>
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className={styles.orderDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Total:</span>
                      <span className={styles.value}>
                        {new Intl.NumberFormat('sv-SE', {
                          style: 'currency',
                          currency: 'SEK',
                        }).format(order.total_amount)}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Shipping to:</span>
                      <span className={styles.value}>{order.shipping_name}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Address:</span>
                      <span className={styles.value}>{order.shipping_address}</span>
                    </div>
                  </div>

                  <div className={styles.orderActions}>
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default BuyerOrdersPage;
