import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import styles from './OrderDetailPage.module.css';

interface OrderRecord {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_name: string;
  shipping_address: string;
  shipping_email: string;
  created_at: string;
}

interface ProductSummary {
  id: string;
  name: string;
  image_url?: string | null;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: ProductSummary | null;
}

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: styles.statusPending },
  processing: { label: 'Processing', className: styles.statusProcessing },
  shipped: { label: 'Shipped', className: styles.statusShipped },
  completed: { label: 'Completed', className: styles.statusCompleted },
  cancelled: { label: 'Cancelled', className: styles.statusCancelled },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(value);

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      if (!user) {
        setError('You must be logged in to view this order.');
        setLoading(false);
        return;
      }

      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();

        if (orderError) throw orderError;
        if (!orderData || orderData.user_id !== user.id) {
          setError('This order does not exist or you do not have access to it.');
          return;
        }

        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(
            `id, product_id, quantity, price,
             product:products ( id, name, image_url )`
          )
          .eq('order_id', id);

        if (itemsError) throw itemsError;

        const normalizedItems: OrderItem[] = (itemsData || []).map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          product: item.product,
        }));

        setOrder(orderData as OrderRecord);
        setItems(normalizedItems);
      } catch (fetchError: any) {
        setError(fetchError.message || 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  const statusBadge = useMemo(() => {
    if (!order) return null;
    const info = statusMap[order.status] || statusMap.pending;
    return <span className={`${styles.statusBadge} ${info.className}`}>{info.label}</span>;
  }, [order]);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.container}>
        <FadeIn>
          <Card className={styles.errorCard}>
            <h1 className={styles.title}>Order Not Available</h1>
            <p className={styles.errorMessage}>{error || 'Unable to locate this order.'}</p>
            <div className={styles.actions}>
              <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
              <Link to="/catalog">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </Card>
        </FadeIn>
      </div>
    );
  }

  const createdDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.container}>
      <FadeIn>
        <div className={styles.header}>
          <div>
            <p className={styles.orderLabel}>Order</p>
            <h1 className={styles.title}>#{order.id.slice(0, 8).toUpperCase()}</h1>
            <p className={styles.subtitle}>Placed on {createdDate}</p>
          </div>
          <div className={styles.headerActions}>
            {statusBadge}
            <Button variant="ghost" onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <Card className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Items</h2>
                <span className={styles.sectionMeta}>{items.length} total</span>
              </div>
              {items.length === 0 ? (
                <p className={styles.emptyState}>No line items were recorded for this order.</p>
              ) : (
                <div className={styles.itemsList}>
                  {items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      {item.product?.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className={styles.itemImage}
                        />
                      ) : (
                        <div className={styles.itemPlaceholder}>No Image</div>
                      )}
                      <div className={styles.itemDetails}>
                        <p className={styles.itemName}>{item.product?.name || 'Product removed'}</p>
                        <p className={styles.itemMeta}>Qty {item.quantity}</p>
                      </div>
                      <div className={styles.itemPricing}>
                        <span className={styles.itemPrice}>{formatCurrency(item.price)}</span>
                        <span className={styles.itemSubtotal}>
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className={styles.sideColumn}>
            <Card className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Order Summary</h2>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>Calculated at fulfillment</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total Paid</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </Card>

            <Card className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Shipping Information</h2>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Recipient</span>
                <span className={styles.infoValue}>{order.shipping_name}</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Address</span>
                <span className={styles.infoValue}>{order.shipping_address}</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{order.shipping_email}</span>
              </div>
            </Card>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default OrderDetailPage;
