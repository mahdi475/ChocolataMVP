import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './SellerDashboardPage.module.css';

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingVerification: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const [productsResult, ordersResult, verificationResult] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact' }).eq('seller_id', user.id),
          supabase.from('orders').select('id', { count: 'exact' }).eq('seller_id', user.id),
          supabase
            .from('seller_verifications')
            .select('status')
            .eq('user_id', user.id)
            .single(),
        ]);

        setStats({
          totalProducts: productsResult.count || 0,
          totalOrders: ordersResult.count || 0,
          pendingVerification: verificationResult.data?.status === 'pending',
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
        <h1 className={styles.title}>Seller Dashboard</h1>
        {stats.pendingVerification && (
          <Card className={styles.warning}>
            <h3>Verification Pending</h3>
            <p>Your seller account is pending admin approval. You can add products, but they won't be visible to buyers until approved.</p>
          </Card>
        )}
        <div className={styles.stats}>
          <Card className={styles.statCard}>
            <h3 className={styles.statValue}>{stats.totalProducts}</h3>
            <p className={styles.statLabel}>Total Products</p>
          </Card>
          <Card className={styles.statCard}>
            <h3 className={styles.statValue}>{stats.totalOrders}</h3>
            <p className={styles.statLabel}>Total Orders</p>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
};

export default SellerDashboardPage;

