import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
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
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      >
        <h2 className={styles.welcome}>WELCOME TO THE FACTORY</h2>
        <h1 className={styles.title}>
          <span className={styles.chocoIcon}>🍫</span> A World of <span className={styles.imagination}>Pure Imagination</span> & Flavor
        </h1>
        <p className={styles.subtitle}>
          Discover artisan chocolates, rare sweets, and gourmet foods from independent creators worldwide. Collect stamps in your passport with every bite.
        </p>
        <blockquote className={styles.quote}>
          "The suspense is terrible... I hope it'll last!"
        </blockquote>
        <div className={styles.actions}>
          <Link to="/catalog">
            <Button variant="gold" size="lg">Start Exploring</Button>
          </Link>
          <Link to="/catalog">
            <Button variant="outline" size="lg">Surprise Me!</Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;

