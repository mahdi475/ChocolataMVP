import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabaseClient';
import { addNotification } from '../../store/slices/notificationSlice';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './AdminSellersPage.module.css';

interface SellerVerification {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  document_url?: string;
  created_at: string;
  user?: {
    email: string;
    full_name: string;
  };
}

const AdminSellersPage = () => {
  const dispatch = useDispatch();
  const [verifications, setVerifications] = useState<SellerVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('seller_verifications')
          .select('*, user:users(email, full_name)')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setVerifications(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load verifications');
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, []);

  const handleApprove = async (id: string, userId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('seller_verifications')
        .update({ status: 'approved' })
        .eq('id', id);

      if (updateError) throw updateError;

      const { error: userError } = await supabase
        .from('users')
        .update({ role: 'seller' })
        .eq('id', userId);

      if (userError) throw userError;

      setVerifications(
        verifications.map((v) => (v.id === id ? { ...v, status: 'approved' as const } : v)),
      );
      dispatch(addNotification({
        type: 'success',
        message: 'Seller approved successfully!',
      }));
    } catch (err: any) {
      dispatch(addNotification({
        type: 'error',
        message: err.message || 'Failed to approve seller',
      }));
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('seller_verifications')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      setVerifications(
        verifications.map((v) => (v.id === id ? { ...v, status: 'rejected' as const } : v)),
      );
      dispatch(addNotification({
        type: 'info',
        message: 'Seller rejected',
      }));
    } catch (err: any) {
      dispatch(addNotification({
        type: 'error',
        message: err.message || 'Failed to reject seller',
      }));
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  const pendingVerifications = verifications.filter((v) => v.status === 'pending');

  return (
    <div className={styles.container}>
      <FadeIn>
        <h1 className={styles.title}>Seller Approvals</h1>
        {error && <div className={styles.error}>{error}</div>}
        {pendingVerifications.length === 0 ? (
          <Card>
            <p className={styles.empty}>No pending verifications</p>
          </Card>
        ) : (
          <div className={styles.verifications}>
            {pendingVerifications.map((verification) => (
              <Card key={verification.id} className={styles.verificationCard}>
                <div className={styles.header}>
                  <div>
                    <h3 className={styles.name}>
                      {verification.user?.full_name || 'Unknown User'}
                    </h3>
                    <p className={styles.email}>{verification.user?.email}</p>
                    <p className={styles.date}>
                      Submitted: {new Date(verification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {verification.document_url && (
                  <div className={styles.document}>
                    <p style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--color-chocolate-dark)' }}>
                      Verification Document:
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <a
                        href={verification.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.documentLink}
                      >
                        👁️ View Document
                      </a>
                      <a
                        href={verification.document_url}
                        download
                        className={styles.documentLink}
                      >
                        ⬇️ Download
                      </a>
                    </div>
                  </div>
                )}
                <div className={styles.actions}>
                  <Button
                    onClick={() => handleApprove(verification.id, verification.user_id)}
                    data-testid={`approve-seller-${verification.id}`}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(verification.id)}
                    data-testid={`reject-seller-${verification.id}`}
                  >
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  );
};

export default AdminSellersPage;

