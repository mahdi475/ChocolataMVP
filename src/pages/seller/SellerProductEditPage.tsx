import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import type { ProductFormValues } from '../../components/forms/ProductForm';
import ProductForm from '../../components/forms/ProductForm';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './SellerProductEditPage.module.css';

const SellerProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<ProductFormValues | undefined>();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setInitialValues(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSuccess = () => {
    navigate('/seller/products');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
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
        <Card>
          <h1 className={styles.title}>{id ? 'Edit Product' : 'Create Product'}</h1>
          {error && <div className={styles.error}>{error}</div>}
          <ProductForm
            initialValues={initialValues}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Card>
      </FadeIn>
    </div>
  );
};

export default SellerProductEditPage;

