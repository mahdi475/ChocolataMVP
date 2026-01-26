import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import Badge from '../components/ui/Badge';
import styles from './CorporatePortalPage.module.css';

const CorporatePortalPage = () => {
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
            <Gift className={styles.heroIcon} />
          </div>
          <Badge variant="gold">Coming Soon</Badge>
          <h1 className={styles.heroTitle}>Corporate Portal</h1>
          <p className={styles.heroSubtitle}>
            Easy bulk ordering with branded packaging options. Perfect for client gifts and employee rewards.
          </p>
        </div>
      </motion.div>

      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <div className={styles.comingSoonSection}>
            <h2 className={styles.sectionTitle}>Elevate Your Corporate Gifting</h2>
            <p className={styles.description}>
              Our Corporate Portal will streamline bulk ordering with custom branding options, volume discounts, 
              and dedicated account management. Perfect for client appreciation gifts, employee recognition, 
              or corporate events.
            </p>
            <p className={styles.description}>
              We're putting the finishing touches on this feature. Contact us for early access!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporatePortalPage;
