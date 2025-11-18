import { Link } from 'react-router-dom';
import FadeIn from '../components/animations/FadeIn';
import Button from '../components/ui/Button';
import styles from './HomePage.module.css';

const HomePage = () => {

  return (
    <div className={styles.container}>
      <FadeIn>
        <section className={styles.hero}>
          <h1 className={styles.title}>🍫 Welcome to Chocolata</h1>
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

