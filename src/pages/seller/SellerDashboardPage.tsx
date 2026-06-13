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
    verificationStatus: null as 'pending' | 'approved' | 'rejected' | null,
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
          verificationStatus: verificationResult.data?.status || null,
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
        <div className={styles.panel}>
          <div className={styles.hero}>
            <div className={styles.heroText}>
              <p className={styles.heroTag}>Seller Portal</p>
              <h1 className={styles.title}>Seller HQ</h1>
              <p className={styles.heroSubtitle}>
                Manage your chocolate empire with ease. Track products, monitor orders, and grow your business.
              </p>
            </div>
            <span className={styles.heroBadge}>
              {stats.totalOrders} {stats.totalOrders === 1 ? 'order' : 'orders'}
            </span>
          </div>
          {stats.verificationStatus === 'pending' && (
            <Card className={styles.warning}>
              <h3>⏳ Verification Pending</h3>
              <p>Your seller account is pending admin approval. You cannot create products until verified.</p>
            </Card>
          )}
          {stats.verificationStatus === 'rejected' && (
            <Card className={styles.errorCard}>
              <h3>❌ Verification Rejected</h3>
              <p>Your seller verification was rejected. Please resubmit your documents.</p>
            </Card>
          )}
          {stats.verificationStatus === 'approved' && (
            <Card className={styles.successCard}>
              <h3>✅ Account Verified</h3>
              <p>Your seller account is verified. You can now create and sell products!</p>
            </Card>
          )}
          {!stats.verificationStatus && (
            <Card className={styles.infoCard}>
              <h3>📄 Verification Required</h3>
              <p>Please submit your verification documents to start selling.</p>
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
        </div>
      </FadeIn>
    </div>
  );
};

export default SellerDashboardPage;

