import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Gift, Heart, Coffee, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProductCard, { type Product } from '../components/cards/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import styles from './HomePage.module.css';

interface Category {
  id: string;
  name: string;
  slug?: string;
}

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <img
          src="https://images.unsplash.com/photo-1615486511484-92e5462d9971?auto=format&fit=crop&q=80&w=2500"
          alt="Molten Chocolate"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}></div>
      </div>

      <div className={styles.heroContent}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={styles.heroBadge}
        >
          <Badge variant="gold">Award Winning Collection</Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={styles.heroTitle}
        >
          The Art of <br />
          <span className={styles.heroTitleAccent}>Fine Chocolate</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={styles.heroSubtitle}
        >
          Discover a curated marketplace of the world's finest artisan chocolatiers.
          Ethically sourced, masterfully crafted.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={styles.heroActions}
        >
          <Link to="/catalog">
            <Button variant="gold" className={styles.heroButton}>
              Shop Collection
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" className={styles.heroButtonOutline}>
              Our Story
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const CategorySection = ({ categories }: { categories: Category[] }) => {
  const icons: Record<string, React.ReactNode> = {
    dark: <Coffee className={styles.categoryIcon} />,
    milk: <Heart className={styles.categoryIcon} />,
    white: <Star className={styles.categoryIcon} />,
    truffles: <div className={styles.categoryIconCircle}></div>,
    vegan: <Leaf className={styles.categoryIcon} />,
    gifts: <Gift className={styles.categoryIcon} />,
  };

  return (
    <section className={styles.categorySection}>
      <div className={styles.categoryContainer}>
        <div className={styles.categoryHeader}>
          <h2 className={styles.categoryTitle}>Explore by Taste</h2>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <Link
              to={`/catalog?category=${cat.slug || cat.name.toLowerCase()}`}
              key={cat.id}
              className={styles.categoryCard}
            >
              <div className={styles.categoryIconWrapper}>
                {icons[cat.slug || cat.name.toLowerCase()] || (
                  <Star className={styles.categoryIcon} />
                )}
              </div>
              <span className={styles.categoryName}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductGrid = ({
  title,
  products,
  linkText,
  linkTo,
}: {
  title: string;
  products: Product[];
  linkText?: string;
  linkTo?: string;
}) => {
  return (
    <section className={styles.productGridSection}>
      <div className={styles.productGridContainer}>
        <div className={styles.productGridHeader}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.productGridTitle}>{title}</h2>
            <div className={styles.productGridUnderline}></div>
          </motion.div>
          {linkText && linkTo && (
            <Link to={linkTo} className={styles.productGridLink}>
              {linkText} <ArrowRight className={styles.productGridLinkIcon} />
            </Link>
          )}
        </div>

        <div className={styles.productGrid}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {linkText && linkTo && (
          <div className={styles.productGridMobileLink}>
            <Link to={linkTo} className={styles.productGridLink}>
              {linkText} <ArrowRight className={styles.productGridLinkIcon} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

const SpotlightSection = () => {
  return (
    <section className={styles.spotlightSection}>
      <div className={styles.spotlightPattern}></div>
      <div className={styles.spotlightContainer}>
        <div className={styles.spotlightGrid}>
          <motion.div
            className={styles.spotlightImageWrapper}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.spotlightBorder}></div>
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200"
              alt="Luxury Gift Set"
              className={styles.spotlightImage}
            />
          </motion.div>
          <div className={styles.spotlightContent}>
            <span className={styles.spotlightBadge}>Curator's Pick</span>
            <h2 className={styles.spotlightTitle}>
              The Velvet <br /> Collection
            </h2>
            <p className={styles.spotlightText}>
              An exclusive assortment of our darkest, richest single-origin bars
              paired with hand-rolled truffles. The perfect gift for the true
              chocolate aficionado.
            </p>
            <div className={styles.spotlightActions}>
              <Link to="/catalog?category=gifts">
                <Button variant="gold" className={styles.spotlightButton}>
                  Shop the Collection
                </Button>
              </Link>
              <Link to="/catalog">
                <Button variant="outline" className={styles.spotlightButtonOutline}>
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className={styles.newsletterSection}>
      <div className={styles.newsletterContainer}>
        <h2 className={styles.newsletterTitle}>Join the Inner Circle</h2>
        <p className={styles.newsletterSubtitle}>
          Get early access to limited edition drops, chocolatier interviews, and
          sweet deals.
        </p>
        <form onSubmit={handleSubmit} className={styles.newsletterForm}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.newsletterInput}
            required
          />
          <button type="submit" className={styles.newsletterButton}>
            Sign Up
          </button>
        </form>
      </div>
    </section>
  );
};

const HomePage = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (user && role) {
      console.log('🏠 Homepage: User is logged in with role:', role);
      switch (role) {
        case 'seller':
          console.log('➡️ Homepage: Redirecting seller to dashboard');
          navigate('/seller/dashboard', { replace: true });
          break;
        case 'admin':
          console.log('➡️ Homepage: Redirecting admin to dashboard');
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'buyer':
          console.log('➡️ Homepage: Buyer can stay on homepage or browse catalog');
          break;
        default:
          console.log('🤷 Homepage: Unknown role, staying on homepage');
          break;
      }
    }
  }, [user, role, navigate]);

  // Fetch products and categories from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResult, categoriesResult] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(6),
          supabase.from('categories').select('*').order('name', { ascending: true }),
        ]);

        if (productsResult.error) {
          throw productsResult.error;
        }

        const allProducts = productsResult.data || [];
        setFeaturedProducts(allProducts.slice(0, 3));
        setNewProducts(allProducts.slice(3, 6));
        setCategories(categoriesResult.data || []);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner fullScreen text="Melting chocolate..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Hero />
      <CategorySection categories={categories} />
      <ProductGrid
        title="Trending Now"
        products={featuredProducts}
        linkText="View All Best Sellers"
        linkTo="/catalog"
      />
      <SpotlightSection />
      <ProductGrid
        title="Fresh from the Kitchen"
        products={newProducts}
        linkText="Shop New Arrivals"
        linkTo="/catalog"
      />
      <Newsletter />
    </div>
  );
};

export default HomePage;
