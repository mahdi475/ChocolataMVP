import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabaseClient';
import { addNotification } from '../../store/slices/notificationSlice';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './AdminProductsPage.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  category_id?: string;
  seller_id: string;
  created_at: string;
  seller?: {
    email: string;
    full_name: string;
  };
  category?: {
    name: string;
  };
}

const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:users!seller_id(email, full_name),
          category:categories(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      dispatch(addNotification({
        type: 'error',
        message: err.message || 'Failed to load products',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editForm.name,
          description: editForm.description,
          price: editForm.price,
          stock: editForm.stock,
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...editForm }
          : p
      ));

      dispatch(addNotification({
        type: 'success',
        message: 'Product updated successfully!',
      }));

      setEditingProduct(null);
    } catch (err: any) {
      dispatch(addNotification({
        type: 'error',
        message: err.message || 'Failed to update product',
      }));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      dispatch(addNotification({
        type: 'success',
        message: 'Product deleted successfully!',
      }));
    } catch (err: any) {
      dispatch(addNotification({
        type: 'error',
        message: err.message || 'Failed to delete product',
      }));
    }
  };

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.seller?.email.toLowerCase().includes(query) ||
      product.seller?.full_name.toLowerCase().includes(query)
    );
  });

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
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>All Products</h1>
              <p className={styles.subtitle}>Manage all products from all sellers</p>
            </div>
          </div>

          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search products, sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.stats}>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>{products.length}</div>
              <div className={styles.statLabel}>Total Products</div>
            </Card>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>
                {products.filter(p => p.stock > 0).length}
              </div>
              <div className={styles.statLabel}>In Stock</div>
            </Card>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>
                {products.filter(p => p.stock === 0).length}
              </div>
              <div className={styles.statLabel}>Out of Stock</div>
            </Card>
          </div>

          <div className={styles.productList}>
            {filteredProducts.map((product) => (
              <Card key={product.id} className={styles.productCard}>
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className={styles.productImage}
                  />
                )}
                <div className={styles.productContent}>
                  <div className={styles.productHeader}>
                    <div>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productSeller}>
                        Seller: {product.seller?.full_name || product.seller?.email}
                      </p>
                      {product.category && (
                        <span className={styles.categoryBadge}>
                          {product.category.name}
                        </span>
                      )}
                    </div>
                    <div className={styles.productPrice}>
                      {new Intl.NumberFormat('sv-SE', {
                        style: 'currency',
                        currency: 'SEK',
                      }).format(product.price)}
                    </div>
                  </div>
                  
                  <p className={styles.productDescription}>{product.description}</p>
                  
                  <div className={styles.productMeta}>
                    <span className={`${styles.stockBadge} ${product.stock > 0 ? styles.inStock : styles.outOfStock}`}>
                      Stock: {product.stock}
                    </span>
                    <span className={styles.productDate}>
                      {new Date(product.created_at).toLocaleDateString('sv-SE')}
                    </span>
                  </div>

                  <div className={styles.productActions}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <Card className={styles.emptyState}>
              <p>No products found</p>
            </Card>
          )}
        </div>
      </FadeIn>

      {/* Edit Modal */}
      {editingProduct && (
        <div className={styles.modalOverlay} onClick={() => setEditingProduct(null)}>
          <Card className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Edit Product</h2>
            
            <div className={styles.formGroup}>
              <label>Product Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className={styles.textarea}
                rows={4}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Price (SEK)</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                  className={styles.input}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Stock</label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                  className={styles.input}
                  min="0"
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
