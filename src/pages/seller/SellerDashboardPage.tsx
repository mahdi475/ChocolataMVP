import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BarChart3, Eye, PackagePlus, ShoppingBag, Store, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import {
  DEMO_SELLER_PROFILE_SLUG,
  type SellerStoreProfile,
  loadSellerStoreProfile,
  saveSellerStoreProfile,
} from '../../lib/sellerProfile';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './SellerDashboardPage.module.css';

const demoAnalytics = {
  revenue: 18420,
  productViews: 1248,
  profileVisitors: 386,
  addToCart: 94,
  abandonedCarts: 21,
  conversionRate: 4.8,
  pendingOrders: 3,
  bestSellingProducts: [
    { name: 'Velvet Noir Bar', value: 42 },
    { name: 'Nordic Gift Box', value: 28 },
    { name: 'Sea Salt Truffles', value: 19 },
  ],
  mostViewedProducts: [
    { name: 'Nordic Gift Box', value: 312 },
    { name: 'Velvet Noir Bar', value: 284 },
    { name: 'Raspberry Bonbons', value: 177 },
  ],
  attention: ['Add stock to Velvet Noir Bar', 'Upload a stronger cover image', 'Review summer shipping settings'],
};

const SellerDashboardPage = () => {
  const { t } = useTranslation('ui');
  const { user } = useAuth();
  const [profile, setProfile] = useState<SellerStoreProfile>(() => loadSellerStoreProfile());
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

  const setProfileStatus = (status: SellerStoreProfile['status']) => {
    if (status === 'offline' && !window.confirm(t('sellerProfile.offlineWarning'))) return;
    const next = { ...profile, status };
    setProfile(next);
    saveSellerStoreProfile(next);
  };

  return (
    <div className={styles.container}>
      <FadeIn>
        <div className={styles.panel}>
          <div className={styles.hero}>
            <div className={styles.heroText}>
              <p className={styles.heroTag}>Seller Portal</p>
              <h1 className={styles.title}>Seller HQ</h1>
              <p className={styles.heroSubtitle}>
                Understand what customers view, add to cart, and buy so you can grow your Chocolata store with confidence.
              </p>
            </div>
            <div className={styles.heroActions}>
              <Link to="/seller/products/new"><Button><PackagePlus size={16} /> Add product</Button></Link>
              <Link to={`/chocolatiers/${DEMO_SELLER_PROFILE_SLUG}`}><Button variant="outline"><Store size={16} /> View public profile</Button></Link>
            </div>
          </div>
          <Card className={styles.profileStatusCard}>
            <div>
              <p>{t('sellerProfile.profileStatus')}</p>
              <h2>{profile.status === 'live' ? t('sellerProfile.live') : t('sellerProfile.offline')}</h2>
              <span>{profile.status === 'live' ? t('sellerProfile.liveHelp') : t('sellerProfile.offlineHelp')}</span>
            </div>
            <div className={styles.profileStatusActions}>
              <Button type="button" variant={profile.status === 'live' ? 'gold' : 'outline'} onClick={() => setProfileStatus('live')}>
                {t('sellerProfile.goLive')}
              </Button>
              <Button type="button" variant={profile.status === 'offline' ? 'gold' : 'ghost'} onClick={() => setProfileStatus('offline')}>
                {t('sellerProfile.goOffline')}
              </Button>
            </div>
          </Card>
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
            {[
              { label: 'Total sales', value: new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(demoAnalytics.revenue), icon: TrendingUp },
              { label: 'Orders', value: stats.totalOrders || demoAnalytics.pendingOrders, icon: ShoppingBag },
              { label: 'Products', value: stats.totalProducts, icon: PackagePlus },
              { label: 'Product views', value: demoAnalytics.productViews, icon: Eye },
              { label: 'Store visitors', value: demoAnalytics.profileVisitors, icon: Store },
              { label: 'Add-to-cart', value: demoAnalytics.addToCart, icon: BarChart3 },
              { label: 'Abandoned carts', value: demoAnalytics.abandonedCarts, icon: ShoppingBag },
              { label: 'Conversion rate', value: `${demoAnalytics.conversionRate}%`, icon: TrendingUp },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className={styles.statCard}>
                  <Icon className={styles.statIcon} />
                  <h3 className={styles.statValue}>{item.value}</h3>
                  <p className={styles.statLabel}>{item.label}</p>
                </Card>
              );
            })}
          </div>

          <div className={styles.insightsGrid}>
            <Card className={styles.insightCard}>
              <h2>Best-selling products</h2>
              {demoAnalytics.bestSellingProducts.map((product) => (
                <div key={product.name} className={styles.chartRow}>
                  <span>{product.name}</span>
                  <div><i style={{ width: `${product.value * 2}%` }} /></div>
                  <strong>{product.value}</strong>
                </div>
              ))}
            </Card>
            <Card className={styles.insightCard}>
              <h2>Most viewed products</h2>
              {demoAnalytics.mostViewedProducts.map((product) => (
                <div key={product.name} className={styles.chartRow}>
                  <span>{product.name}</span>
                  <div><i style={{ width: `${Math.min(product.value / 4, 100)}%` }} /></div>
                  <strong>{product.value}</strong>
                </div>
              ))}
            </Card>
            <Card className={styles.insightCard}>
              <h2>Needs attention</h2>
              <ul className={styles.attentionList}>
                {demoAnalytics.attention.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Card>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default SellerDashboardPage;

