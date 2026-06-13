import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, PackageCheck, Star } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import ProductCard, { type Product } from '../../components/cards/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import FadeIn from '../../components/animations/FadeIn';
import {
  getDemoMakerById,
  getDemoProductsByMaker,
  type MakerProfile,
} from '../../data/demoCatalog';
import styles from './SellerProfilePage.module.css';

interface Seller {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  city?: string;
  country?: string;
  story?: string;
  image_url?: string;
}

const SellerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<Seller | MakerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!id) {
        setError('Seller ID is required');
        setLoading(false);
        return;
      }

      try {
        const { data: sellerData, error: sellerError } = await supabase
          .from('users')
          .select('id, email, full_name, created_at')
          .eq('id', id)
          .eq('role', 'seller')
          .single();

        if (sellerError) throw sellerError;
        setSeller(sellerData);

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (err: any) {
        const demoMaker = getDemoMakerById(id);
        if (demoMaker) {
          setSeller(demoMaker);
          setProducts(getDemoProductsByMaker(id));
          setError(null);
        } else {
          setError(err.message || 'Failed to load seller information');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [id]);

  if (loading) {
    return <div className={styles.container}><LoadingSpinner /></div>;
  }

  if (error || !seller) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || 'Seller not found'}</div>
        <button onClick={() => navigate('/catalog')} className={styles.backButton}>
          Back to Catalog
        </button>
      </div>
    );
  }

  const sellerName = 'name' in seller ? seller.name : seller.full_name || seller.email;
  const location = [seller.city, seller.country].filter(Boolean).join(', ');
  const story = seller.story || 'An independent chocolate maker on Chocolata, crafting small-batch products for discerning chocolate lovers.';
  const image = seller.image_url;

  return (
    <div className={styles.container}>
      <FadeIn>
        <section className={styles.hero}>
          {image && <img src={image} alt={sellerName} className={styles.heroImage} />}
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Chocolatier profile</p>
            <h1 className={styles.sellerName}>{sellerName}</h1>
            {location && (
              <p className={styles.location}><MapPin /> {location}</p>
            )}
            <p className={styles.story}>{story}</p>
            <div className={styles.stats}>
              <span><PackageCheck /> {products.length} products</span>
              <span><Star /> Curated maker</span>
              {seller.created_at && (
                <span>Since {new Date(seller.created_at).getFullYear()}</span>
              )}
            </div>
          </div>
        </section>

        <section className={styles.productsSection}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Shop the atelier</p>
            <h2 className={styles.productsTitle}>Products by {sellerName}</h2>
          </div>

          {products.length === 0 ? (
            <div className={styles.emptyState}>
              <p>This seller has not listed any products yet.</p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </FadeIn>
    </div>
  );
};

export default SellerProfilePage;
