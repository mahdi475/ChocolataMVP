import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './AdminDashboardPage.module.css';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

const ORDER_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const createEmptySummary = () => ORDER_STATUSES.reduce<Record<OrderStatus, number>>((acc, status) => {
  acc[status] = 0;
  return acc;
}, {} as Record<OrderStatus, number>);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingVerifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [orderStatusCounts, setOrderStatusCounts] = useState<Record<OrderStatus, number>>(createEmptySummary());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersResult, productsResult, ordersResult, verificationsResult] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id, status').order('created_at', { ascending: false }),
          supabase
            .from('seller_verifications')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
        ]);

        const statusSummary = createEmptySummary();
        const orderData = ordersResult.data || [];
        orderData.forEach((order) => {
          const status = (order as { status?: OrderStatus }).status;
          if (status && status in statusSummary) {
            statusSummary[status as OrderStatus] += 1;
          }
        });

        setStats({
          totalUsers: usersResult.count || 0,
          totalProducts: productsResult.count || 0,
          totalOrders: orderData.length,
          pendingVerifications: verificationsResult.count || 0,
        });
        setOrderStatusCounts(statusSummary);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  const heroBadgeText = `${stats.totalOrders} total orders`;

  return (
    <div className={styles.container}>
      <FadeIn>
        <div className={styles.panel}>
          <div className={styles.hero}>
            <div className={styles.heroText}>
              <p className={styles.heroTag}>Admin Panel</p>
              <h1 className={`${styles.title} ${styles.heroTitle}`}>Admin HQ</h1>
              <p className={styles.heroSubtitle}>Keep the chocolate supply chain smooth with friendly telemetry and rapid insights.</p>
            </div>
            <span className={styles.heroBadge}>{heroBadgeText}</span>
          </div>
          <div className={styles.stats}>
            <Card className={styles.statCard}>
              <h3 className={styles.statValue}>{stats.totalUsers}</h3>
              <p className={styles.statLabel}>Total Users</p>
            </Card>
            <Card className={styles.statCard}>
              <h3 className={styles.statValue}>{stats.totalProducts}</h3>
              <p className={styles.statLabel}>Total Products</p>
            </Card>
            <Card className={styles.statCard}>
              <h3 className={styles.statValue}>{stats.totalOrders}</h3>
              <p className={styles.statLabel}>Total Orders</p>
            </Card>
            <Card className={styles.statCard}>
              <h3 className={styles.statValue}>{stats.pendingVerifications}</h3>
              <p className={styles.statLabel}>Pending Verifications</p>
            </Card>
          </div>

          <div className={styles.statusSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Order Status Overview</h2>
            <p className={styles.sectionSubtext}>Track bottlenecks and progress in real time. 🍫</p>
          </div>
          <div className={styles.statusGrid}>
            {ORDER_STATUSES.map((status) => (
              <Card key={status} className={styles.statusCard}>
                <div className={styles.statusHeader}>
                  <span className={`${styles.statusBadge} ${styles[status]}`}>{STATUS_LABEL[status]}</span>
                  <span className={styles.statusValueSmall}>{orderStatusCounts[status]}</span>
                </div>
                <p className={styles.statusLabelSmall}>
                  {status === 'pending'
                    ? 'Awaiting processing'
                    : status === 'processing'
                    ? 'Being packed'
                    : status === 'shipped'
                    ? 'On the way'
                    : status === 'completed'
                    ? 'Delivered successfully'
                    : 'Cancelled or refunded'}
                </p>
              </Card>
            ))}
          </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default AdminDashboardPage;

