import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './CustomerProfilePage.module.css';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  role: string;
  created_at: string;
}

interface OrderSnapshot {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const CustomerProfilePage = () => {
  const { user, handleLogout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<OrderSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setError('You need to be logged in to view your profile.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('id, email, full_name, role, created_at')
          .eq('id', user.id)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData as UserProfile);

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, status, total_amount, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);
        if (ordersError) throw ordersError;
        setRecentOrders(ordersData || []);

        const { count: totalOrders, error: countError } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if (countError) throw countError;
        setOrdersCount(totalOrders || 0);
      } catch (fetchError: any) {
        setError(fetchError.message || 'Unable to load your profile right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const displayName = useMemo(() => {
    if (profile?.full_name) return profile.full_name;
    if (profile?.email) return profile.email.split('@')[0];
    return 'Customer';
  }, [profile]);

  const memberSince = useMemo(() => {
    if (!profile?.created_at) return null;
    return new Date(profile.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [profile]);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={styles.container}>
        <FadeIn>
          <Card className={styles.errorCard}>
            <h1 className={styles.title}>Profile unavailable</h1>
            <p className={styles.errorMessage}>{error || 'We could not load your account details.'}</p>
            <div className={styles.actions}>
              <Link to="/catalog">
                <Button>Browse Catalog</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Card>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FadeIn>
        <div className={styles.header}>
          <div>
            <p className={styles.label}>Account</p>
            <h1 className={styles.title}>{displayName}</h1>
            {memberSince && <p className={styles.subtitle}>Member since {memberSince}</p>}
          </div>
          <div className={styles.headerActions}>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            <Link to="/orders">
              <Button variant="outline">View Orders</Button>
            </Link>
          </div>
        </div>

        <div className={styles.grid}>
          <Card className={styles.profileCard}>
            <div className={styles.avatar} aria-hidden="true">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className={styles.profileInfo}>
              <div>
                <p className={styles.profileLabel}>Full name</p>
                <p className={styles.profileValue}>{profile.full_name || 'Not provided'}</p>
              </div>
              <div>
                <p className={styles.profileLabel}>Email</p>
                <p className={styles.profileValue}>{profile.email}</p>
              </div>
              <div>
                <p className={styles.profileLabel}>Role</p>
                <p className={styles.profileValue}>{profile.role}</p>
              </div>
              <div>
                <p className={styles.profileLabel}>Orders placed</p>
                <p className={styles.profileValue}>{ordersCount}</p>
              </div>
            </div>
          </Card>

          <Card className={styles.linksCard}>
            <h2 className={styles.sectionTitle}>Next steps</h2>
            <div className={styles.linkList}>
              <Link to="/catalog" className={styles.linkItem}>
                <div>
                  <p className={styles.linkTitle}>Continue shopping</p>
                  <p className={styles.linkSubtitle}>Discover new treats and restock favorites.</p>
                </div>
                <span className={styles.linkChevron}>→</span>
              </Link>
              <Link to="/orders" className={styles.linkItem}>
                <div>
                  <p className={styles.linkTitle}>Manage orders</p>
                  <p className={styles.linkSubtitle}>Review order history and track shipments.</p>
                </div>
                <span className={styles.linkChevron}>→</span>
              </Link>
            </div>
          </Card>
        </div>

        <Card className={styles.ordersCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent orders</h2>
            <Link to="/orders">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className={styles.emptyState}>You have not placed any orders yet.</p>
          ) : (
            <div className={styles.orderList}>
              {recentOrders.map((order) => (
                <div key={order.id} className={styles.orderRow}>
                  <div>
                    <p className={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={styles.orderAmount}>
                    {new Intl.NumberFormat('sv-SE', {
                      style: 'currency',
                      currency: 'SEK',
                    }).format(order.total_amount)}
                  </span>
                  <span className={styles.orderStatus}>
                    {statusLabel[order.status] || order.status}
                  </span>
                  <Link to={`/orders/${order.id}`} className={styles.orderLink}>
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </FadeIn>
    </div>
  );
};

export default CustomerProfilePage;
