import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import Badge from '../components/ui/Badge';
import styles from './ChocolatePassportPage.module.css';

const ChocolatePassportPage = () => {
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
            <BookOpen className={styles.heroIcon} />
          </div>
          <Badge variant="gold">Coming Soon</Badge>
          <h1 className={styles.heroTitle}>Chocolate Passport</h1>
          <p className={styles.heroSubtitle}>
            Collect stamps from different countries as you explore. Complete your passport for exclusive rewards!
          </p>
        </div>
      </motion.div>

      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <div className={styles.comingSoonSection}>
            <h2 className={styles.sectionTitle}>Adventure Awaits</h2>
            <p className={styles.description}>
              We're building an exciting passport program that lets you track your chocolate journey around the world. 
              Each purchase from a different country earns you a stamp, and completing your passport unlocks exclusive 
              rewards and special offers.
            </p>
            <p className={styles.description}>
              Stay tuned for updates on when this feature launches!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChocolatePassportPage;
