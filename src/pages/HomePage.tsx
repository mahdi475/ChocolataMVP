import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FadeIn from '../components/animations/FadeIn';
import Button from '../components/ui/Button';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

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
          // Buyers can stay on homepage or choose to browse catalog
          break;
        default:
          console.log('🤷 Homepage: Unknown role, staying on homepage');
          break;
      }
    }
  }, [user, role, navigate]);

  return (
    <div className={styles.container}>
      <FadeIn>
        <section className={styles.hero}>
          <h1 className={styles.title}>🍭 Welcome to Oompaloompa</h1>
          <p className={styles.subtitle}>
            Discover premium chocolate products from verified sellers
          </p>
          <div className={styles.actions}>
            <Link to="/catalog">
              <Button size="lg">Browse Catalog</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">
                Become a Seller
              </Button>
            </Link>
          </div>
        </section>
      </FadeIn>
    </div>
  );
};

export default HomePage;

