import { motion } from 'framer-motion';
import { Dice1 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import styles from './SurpriseMePage.module.css';

const SurpriseMePage = () => {
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
            <Dice1 className={styles.heroIcon} />
          </div>
          <Badge variant="gold">Coming Soon</Badge>
          <h1 className={styles.heroTitle}>Surprise Me</h1>
          <p className={styles.heroSubtitle}>
            Feeling adventurous? Let us randomly select an artisan box tailored to your taste preferences.
          </p>
        </div>
      </motion.div>

      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <div className={styles.comingSoonSection}>
            <h2 className={styles.sectionTitle}>Discover the Unexpected</h2>
            <p className={styles.description}>
              Our Surprise Me feature will curate a personalized selection of artisan chocolates based on your 
              taste preferences. Simply tell us what you like, and we'll surprise you with a carefully selected 
              box of chocolates from around the world.
            </p>
            <p className={styles.description}>
              This feature is currently in development. Check back soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurpriseMePage;
