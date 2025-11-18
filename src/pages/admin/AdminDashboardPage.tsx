import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingVerifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersResult, productsResult, ordersResult, verificationsResult] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact' }),
          supabase.from('products').select('id', { count: 'exact' }),
          supabase.from('orders').select('id', { count: 'exact' }),
          supabase
            .from('seller_verifications')
            .select('id', { count: 'exact' })
            .eq('status', 'pending'),
        ]);

        setStats({
          totalUsers: usersResult.count || 0,
          totalProducts: productsResult.count || 0,
          totalOrders: ordersResult.count || 0,
          pendingVerifications: verificationsResult.count || 0,
        });
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

  return (
    <div className={styles.container}>
      <FadeIn>
        <h1 className={styles.title}>Admin Dashboard</h1>
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
      </FadeIn>
    </div>
  );
};

export default AdminDashboardPage;

