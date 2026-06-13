import { motion } from 'framer-motion';
import Badge from '../components/ui/Badge';
import styles from './About.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      {/* Hero */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.heroBackground}>
          <img
            src="https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&q=80&w=2000"
            alt="Chocolatier"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <Badge variant="gold">Established 2024</Badge>
          <h1 className={styles.heroTitle}>Our Story</h1>
          <p className={styles.heroSubtitle}>
            Bringing the world's most exquisite flavors to your doorstep.
          </p>
        </div>
      </motion.div>

      <div className={styles.content}>
        <div className={styles.contentContainer}>
          <div className={styles.storySection}>
            <div className={styles.storyText}>
              <h2 className={styles.sectionTitle}>The Beginning</h2>
              <p className={styles.storyParagraph}>
                Chocolata began with a simple question: why is it so hard to find
                truly exceptional chocolate? We traveled from the misty cloud forests
                of Ecuador to the bustling markets of Brussels, seeking out artisans
                who treat cacao not as a commodity, but as a canvas.
              </p>
              <p className={styles.storyParagraph}>
                What started as a small tasting club has grown into a global
                marketplace connecting passionate makers with discerning connoisseurs.
              </p>
            </div>
            <div className={styles.storyDecoration}>
              <span className={styles.decorativeLetter}>C</span>
            </div>
          </div>

          <div className={styles.philosophySection}>
            <h2 className={styles.philosophyTitle}>Our Philosophy</h2>
            <div className={styles.philosophyGrid}>
              <div className={styles.philosophyCard}>
                <div className={styles.philosophyIcon}>🌱</div>
                <h3 className={styles.philosophyCardTitle}>Ethical Sourcing</h3>
                <p className={styles.philosophyCardText}>
                  We verify that every bean is sourced with respect for the farmers
                  and the environment.
                </p>
              </div>
              <div className={styles.philosophyCard}>
                <div className={styles.philosophyIcon}>🎨</div>
                <h3 className={styles.philosophyCardTitle}>Artistry</h3>
                <p className={styles.philosophyCardText}>
                  We celebrate chocolate as an art form, valuing technique,
                  creativity, and presentation.
                </p>
              </div>
              <div className={styles.philosophyCard}>
                <div className={styles.philosophyIcon}>📦</div>
                <h3 className={styles.philosophyCardTitle}>Freshness</h3>
                <p className={styles.philosophyCardText}>
                  Small batches mean you receive chocolate at its peak flavor
                  profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

