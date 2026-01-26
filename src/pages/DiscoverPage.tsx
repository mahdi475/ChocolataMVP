import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import Badge from '../components/ui/Badge';
import styles from './DiscoverPage.module.css';

const DiscoverPage = () => {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.iconWrapper}>
            <Compass className={styles.heroIcon} />
          </div>
          <Badge variant="gold">Coming Soon</Badge>
          <h1 className={styles.heroTitle}>Discover</h1>
          <p className={styles.heroSubtitle}>
            Explore new flavors and chocolatiers through our curated discovery program. Find your next favorite chocolate.
          </p>
        </div>
      </motion.div>

      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <div className={styles.comingSoonSection}>
            <h2 className={styles.sectionTitle}>Your Journey of Discovery</h2>
            <p className={styles.description}>
              Our Discovery program will guide you through curated selections of artisan chocolates, helping you 
              explore new flavors, regions, and chocolatiers. Get personalized recommendations based on your 
              preferences and discover hidden gems from around the world.
            </p>
            <p className={styles.description}>
              We're crafting an amazing discovery experience. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
