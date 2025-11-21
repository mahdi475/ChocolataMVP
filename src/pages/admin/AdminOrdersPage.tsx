import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import Button from '../../components/ui/Button';
import styles from './AdminOrdersPage.module.css';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

const STATUS_META: Record<OrderStatus, { label: string }> = {
  pending: { label: 'Pending' },
  processing: { label: 'Processing' },
  shipped: { label: 'Shipped' },
  completed: { label: 'Completed' },
  cancelled: { label: 'Cancelled' },
};

interface Order {
  id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_name: string;
  shipping_email: string;
  shipping_address: string;
  created_at: string;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('id, status, total_amount, shipping_name, shipping_email, shipping_address, created_at')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setOrders((data || []) as Order[]);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const statusSummary = useMemo(() => {
    const summary: Record<OrderStatus, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      summary[order.status] = (summary[order.status] || 0) + 1;
    });

    return summary;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    }).format(value);
  };

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
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Orders</h1>
            <p className={styles.subtitle}>Monitor every order status at a glance.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            className={styles.refreshButton}
          >
            Refresh
          </Button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.statusGrid}>
          {Object.entries(STATUS_META).map(([status, meta]) => (
            <Card key={status} className={styles.statusCard}>
              <span className={`${styles.statusBadge} ${styles[status as OrderStatus]}`}>
                {meta.label}
              </span>
              <p className={styles.statusValue}>{statusSummary[status as OrderStatus]}</p>
              <p className={styles.statusLabel}>orders</p>
            </Card>
          ))}
        </div>

        <div className={styles.filterBar}>
          {['all', ...Object.keys(STATUS_META)].map((status) => (
            <button
              key={status}
              type="button"
              className={`${styles.filterButton} ${statusFilter === status ? styles.filterActive : ''}`}
              onClick={() => setStatusFilter(status as 'all' | OrderStatus)}
            >
              {status === 'all' ? 'All' : STATUS_META[status as OrderStatus].label}
              {status === 'all' ? ` (${orders.length})` : ` (${statusSummary[status as OrderStatus]})`}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <Card className={styles.emptyState}>
            <p>No orders found for this filter.</p>
          </Card>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => (
              <Card key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <p className={styles.orderId}>Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                    {STATUS_META[order.status].label}
                  </span>
                </div>
                <div className={styles.orderDetails}>
                  <div>
                    <p className={styles.label}>Total</p>
                    <p className={styles.value}>{formatCurrency(order.total_amount)}</p>
                  </div>
                  <div>
                    <p className={styles.label}>Customer</p>
                    <p className={styles.value}>{order.shipping_name}</p>
                    <p className={styles.subValue}>{order.shipping_email}</p>
                  </div>
                  <div>
                    <p className={styles.label}>Address</p>
                    <p className={styles.value}>{order.shipping_address}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  );
};

export default AdminOrdersPage;
