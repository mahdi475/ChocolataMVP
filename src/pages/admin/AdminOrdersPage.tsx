import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabaseClient';
import { addNotification } from '../../store/slices/notificationSlice';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import styles from './AdminOrdersPage.module.css';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

const STATUS_META: Record<OrderStatus, { label: string }> = {
  pending: { label: 'Pending' },
  processing: { label: 'Processing' },
  shipped: { label: 'Shipped' },
  completed: { label: 'Completed' },
  cancelled: { label: 'Cancelled' },
};

const STATUS_FILTER_OPTIONS: Array<'all' | OrderStatus> = ['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled'];

interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_name: string;
  shipping_email: string;
  shipping_address: string;
  created_at: string;
}

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('id, user_id, status, total_amount, shipping_name, shipping_email, shipping_address, created_at')
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
    let filtered = orders;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((order) => 
        order.id.toLowerCase().includes(query) ||
        order.user_id.toLowerCase().includes(query) ||
        order.shipping_name.toLowerCase().includes(query) ||
        order.shipping_email.toLowerCase().includes(query) ||
        order.shipping_address.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [orders, statusFilter, searchQuery]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));

      dispatch(addNotification({
        type: 'success',
        message: `Order status updated to ${newStatus}`,
      }));
    } catch (err: any) {
      dispatch(addNotification({
        type: 'error',
        message: err.message || 'Failed to update order',
      }));
    }
  };

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
        <div className={styles.panel}>
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

          <div className={styles.searchBar}>
            <Input
              type="text"
              placeholder="Search by Order ID, User ID, Name, Email, or Address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className={styles.clearSearchButton}
              >
                Clear
              </Button>
            )}
          </div>

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
            <div className={styles.filterGroup}>
              {STATUS_FILTER_OPTIONS.map((statusKey) => {
                const isAll = statusKey === 'all';
                const label = isAll ? 'All' : STATUS_META[statusKey].label;
                const count = isAll ? orders.length : statusSummary[statusKey];
                return (
                <button
                  key={statusKey}
                  type="button"
                  className={`${styles.filterButton} ${statusFilter === statusKey ? styles.filterActive : ''}`}
                  onClick={() => setStatusFilter(statusKey)}
                >
                  {label} ({count})
                </button>
                );
              })}
            </div>
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => setStatusFilter('all')}
              disabled={statusFilter === 'all'}
            >
              Clear Filters
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <Card className={styles.emptyState}>
            <p>{searchQuery ? 'No orders found matching your search.' : 'No orders found for this filter.'}</p>
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
                    <p className={styles.label}>User ID</p>
                    <p className={styles.value}>{order.user_id.slice(0, 12)}...</p>
                  </div>
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
                <div className={styles.orderActions}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className={styles.statusSelect}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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

export default AdminOrdersPage;
