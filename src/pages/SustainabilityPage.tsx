import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import Badge from '../components/ui/Badge';
import styles from './SustainabilityPage.module.css';

const SustainabilityPage = () => {
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
            <Leaf className={styles.heroIcon} />
          </div>
          <Badge variant="gold">Coming Soon</Badge>
          <h1 className={styles.heroTitle}>Sustainability Promise</h1>
          <p className={styles.heroSubtitle}>
            We partner only with chocolatiers committed to ethical sourcing and eco-friendly practices.
          </p>
        </div>
      </motion.div>

      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <div className={styles.comingSoonSection}>
            <h2 className={styles.sectionTitle}>Our Commitment to the Planet</h2>
            <p className={styles.description}>
              We're building a comprehensive sustainability program that showcases our partners' commitment to 
              ethical sourcing, fair trade practices, and environmental responsibility. Learn about the impact 
              of your chocolate choices and how we're working together to create a more sustainable future.
            </p>
            <p className={styles.description}>
              This page is coming soon with detailed information about our sustainability initiatives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityPage;
