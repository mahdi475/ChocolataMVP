import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { addNotification } from '../../store/slices/notificationSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './SellerVerificationPage.module.css';

interface SellerVerification {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  document_url?: string;
  admin_notes?: string;
  submitted_at?: string;
  reviewed_at?: string;
}

const SellerVerificationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verification, setVerification] = useState<SellerVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchVerification = async () => {
      if (!user) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('seller_verifications')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
        setVerification(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load verification status');
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (PDF, JPG, PNG)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF, JPG, or PNG file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setError(null);

    try {
      // Create file path: userId/timestamp_filename
      const timestamp = Date.now();
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${user.id}/${timestamp}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('seller_docs')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('seller_docs')
        .getPublicUrl(filePath);

      // Create or update verification record
      if (verification) {
        // Update existing verification
        const { data, error: updateError } = await supabase
          .from('seller_verifications')
          .update({
            document_url: urlData.publicUrl,
            status: 'pending',
            submitted_at: new Date().toISOString(),
          })
          .eq('id', verification.id)
          .select()
          .single();

        if (updateError) throw updateError;
        setVerification(data);
      } else {
        // Create new verification
        const { data, error: insertError } = await supabase
          .from('seller_verifications')
          .insert({
            user_id: user.id,
            document_url: urlData.publicUrl,
            status: 'pending',
            submitted_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setVerification(data);
      }

      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      dispatch(addNotification({
        type: 'success',
        message: 'Document uploaded successfully! Your submission is now under review.',
        duration: 5000,
      }));
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to upload document';
      setError(errorMsg);
      dispatch(addNotification({
        type: 'error',
        message: errorMsg,
      }));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { text: 'Pending Review', className: styles.statusPending },
      approved: { text: 'Approved ✓', className: styles.statusApproved },
      rejected: { text: 'Rejected', className: styles.statusRejected },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <span className={`${styles.statusBadge} ${statusInfo.className}`}>{statusInfo.text}</span>;
  };

  return (
    <div className={styles.container}>
      <FadeIn>
        <h1 className={styles.title}>Seller Verification</h1>

        {verification?.status === 'approved' && (
          <Card className={styles.successCard}>
            <h3>🎉 Your seller account is verified!</h3>
            <p>You can now start selling products on Oompaloompa.</p>
            <Button onClick={() => navigate('/seller/products')}>
              Go to My Products
            </Button>
          </Card>
        )}

        <Card className={styles.infoCard}>
          <h2 className={styles.sectionTitle}>Verification Status</h2>
          {verification ? (
            <div className={styles.statusSection}>
              <div className={styles.statusRow}>
                <span className={styles.label}>Status:</span>
                {getStatusBadge(verification.status)}
              </div>
              {verification.submitted_at && (
                <div className={styles.statusRow}>
                  <span className={styles.label}>Submitted:</span>
                  <span>{new Date(verification.submitted_at).toLocaleDateString()}</span>
                </div>
              )}
              {verification.reviewed_at && (
                <div className={styles.statusRow}>
                  <span className={styles.label}>Reviewed:</span>
                  <span>{new Date(verification.reviewed_at).toLocaleDateString()}</span>
                </div>
              )}
              {verification.admin_notes && verification.status === 'rejected' && (
                <div className={styles.adminNotes}>
                  <span className={styles.label}>Admin Notes:</span>
                  <p>{verification.admin_notes}</p>
                </div>
              )}
              {verification.document_url && (
                <div className={styles.statusRow}>
                  <span className={styles.label}>Document:</span>
                  <a
                    href={verification.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.documentLink}
                  >
                    View Uploaded Document
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className={styles.noVerification}>
              You haven't submitted verification documents yet.
            </p>
          )}
        </Card>

        {(!verification || verification.status === 'rejected') && (
          <Card className={styles.uploadCard}>
            <h2 className={styles.sectionTitle}>
              {verification?.status === 'rejected' ? 'Resubmit Documents' : 'Upload Verification Documents'}
            </h2>
            <p className={styles.instructions}>
              Please upload a valid business document (business license, tax ID, or company registration):
            </p>
            <ul className={styles.requirements}>
              <li>Accepted formats: PDF, JPG, PNG</li>
              <li>Maximum file size: 5MB</li>
              <li>Document must be clear and readable</li>
            </ul>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.uploadSection}>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className={styles.fileInput}
                data-testid="verification-file-input"
              />
              {selectedFile && (
                <div className={styles.selectedFile}>
                  <span>📄 {selectedFile.name}</span>
                  <span className={styles.fileSize}>
                    ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              )}
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                isLoading={uploading}
                className={styles.uploadButton}
                data-testid="verification-upload-button"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </Card>
        )}

        {verification?.status === 'pending' && (
          <Card className={styles.warningCard}>
            <h3>⏳ Verification in Progress</h3>
            <p>
              Your documents are being reviewed by our admin team. This usually takes 1-2 business days.
              We'll notify you once the review is complete.
            </p>
          </Card>
        )}
      </FadeIn>
    </div>
  );
};

export default SellerVerificationPage;
