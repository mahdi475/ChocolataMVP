import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import type { ProductFormValues } from '../../components/forms/ProductForm';
import ProductForm from '../../components/forms/ProductForm';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import { DEMO_SELLER_PROFILE_SLUG } from '../../lib/sellerProfile';
import styles from './SellerProductEditPage.module.css';

const SellerProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<ProductFormValues | undefined>();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  const [savedProductId, setSavedProductId] = useState<string | null>(null);

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

  const handleSuccess = (productId?: string) => {
    setSavedProductId(productId || id || null);
    if (!productId && !id) {
      navigate('/seller/products');
    }
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
          <div className={styles.header}>
            <h1 className={styles.title}>{id ? 'Edit Product' : 'Create Product'}</h1>
            {id && (
              <Link to={`/product/${id}`}>
                <Button type="button" variant="outline">View product as customer</Button>
              </Link>
            )}
          </div>
          {savedProductId && (
            <div className={styles.successPanel}>
              <strong>Product saved and published.</strong>
              <span>Customers can now see this product in the marketplace prototype.</span>
              <div className={styles.successActions}>
                <Link to={`/product/${savedProductId}`}><Button type="button" variant="outline">View product as customer</Button></Link>
                <Link to={`/chocolatiers/${DEMO_SELLER_PROFILE_SLUG}`}><Button type="button" variant="outline">View seller public profile</Button></Link>
                <Link to="/catalog"><Button type="button" variant="ghost">Go to shop</Button></Link>
                <Link to="/seller/products"><Button type="button">Back to products</Button></Link>
              </div>
            </div>
          )}
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

