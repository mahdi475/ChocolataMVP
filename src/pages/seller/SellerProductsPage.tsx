import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import type { Product } from '../../components/cards/ProductCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './SellerProductsPage.module.css';

const SellerProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setProducts(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
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
        <div className={styles.header}>
          <h1 className={styles.title}>My Products</h1>
          <Link to="/seller/products/new">
            <Button data-testid="create-product-button">Create Product</Button>
          </Link>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {products.length === 0 ? (
          <Card>
            <p className={styles.empty}>No products yet. Create your first product!</p>
            <Link to="/seller/products/new">
              <Button>Create Product</Button>
            </Link>
          </Card>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <Card key={product.id} className={styles.productCard}>
                {product.image_url && (
                  <img src={product.image_url} alt={product.name} className={styles.image} />
                )}
                <div className={styles.content}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>
                    {new Intl.NumberFormat('sv-SE', {
                      style: 'currency',
                      currency: 'SEK',
                    }).format(product.price)}
                  </p>
                  <div className={styles.actions}>
                    <Link to={`/seller/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      data-testid={`delete-product-${product.id}`}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </FadeIn>
    </div>
  );
};

export default SellerProductsPage;

