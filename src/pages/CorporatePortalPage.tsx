
import { motion } from 'framer-motion';
import { Gift, Briefcase, Award, PenTool, CheckCircle, Truck, ArrowRight } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import styles from './CorporatePortalPage.module.css';
import corporateHeroImage from '../assets/collections/office-praline-box.png';
import executiveGiftImage from '../assets/products/luxury-praline-box.png';
import tastingKitImage from '../assets/collections/tasting-flight.png';

const CorporatePortalPage = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className={styles.heroBackground}
          style={{ backgroundImage: `url(${corporateHeroImage})` }}
        >
          <div className={styles.heroGradient}></div>
        </div>
        <div className={styles.heroContent}>
          <Badge variant="gold" className={styles.heroBadge}>Corporate Gifting, Elevated</Badge>
          <h1 className={styles.heroTitle}>Make a Lasting <br /><span className={styles.highlight}>Impression</span></h1>
          <p className={styles.heroSubtitle}>
            Premium chocolate gifts tailored for your clients, employees, and events.
            Custom branding, volume pricing, and white-glove concierge service.
          </p>
          <div className={styles.buttonGroup}>
            <Button variant="primary" size="lg" className={styles.ctaButton}>
              Start a Quote
            </Button>
            <Button variant="outline" size="lg" className={styles.catalogButton}>
              Download Catalog
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Value Proposition Grid */}
      <div className={styles.section}>
        <div className={styles.valueGrid}>
          <motion.div
            className={styles.valueCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.iconBox}>
              <PenTool className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Custom Branding</h3>
            <p className={styles.cardText}>
              Your logo, your colors. We offer fully customizable packaging options including sleeves,
              ribbons, and gift cards to keep your brand front and center.
            </p>
          </motion.div>

          <motion.div
            className={styles.valueCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.iconBox}>
              <Award className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Premium Quality</h3>
            <p className={styles.cardText}>
              Gifts that reflect your standards. Our chocolates are sourced from the world's finest
              artisans, ensuring an unboxing experience that screams excellence.
            </p>
          </motion.div>

          <motion.div
            className={styles.valueCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.iconBox}>
              <Briefcase className={styles.icon} />
            </div>
            <h3 className={styles.cardTitle}>Concierge Service</h3>
            <p className={styles.cardText}>
              Dedicated account managers to handle everything from address collection to
              scheduling shipments. We do the heavy lifting, you get the credit.
            </p>
          </motion.div>
        </div>
      </div>

      {/* How It Works */}
      <div className={styles.howItWorksRefined}>
        <div className={styles.sectionHeaderCentered}>
          <h2 className={styles.sectionTitle}>Seamless Gifting Process</h2>
          <p className={styles.sectionSubtitle}>From selection to delivery in three easy steps.</p>
        </div>

        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>01</div>
            <div className={styles.stepContent}>
              <div className={styles.stepIconWrapper}><Gift className={styles.stepIcon} /></div>
              <h3 className={styles.stepTitle}>Select Your Gift</h3>
              <p className={styles.stepDesc}>Choose from our curated collections or build a custom assortment.</p>
            </div>
          </div>

          <div className={styles.connector}>
            <ArrowRight className={styles.connectorIcon} />
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>02</div>
            <div className={styles.stepContent}>
              <div className={styles.stepIconWrapper}><PenTool className={styles.stepIcon} /></div>
              <h3 className={styles.stepTitle}>Customize & Brand</h3>
              <p className={styles.stepDesc}>Add your logo, personal message, and choose your packaging finish.</p>
            </div>
          </div>

          <div className={styles.connector}>
            <ArrowRight className={styles.connectorIcon} />
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>03</div>
            <div className={styles.stepContent}>
              <div className={styles.stepIconWrapper}><Truck className={styles.stepIcon} /></div>
              <h3 className={styles.stepTitle}>We Handle Delivery</h3>
              <p className={styles.stepDesc}>Whether to one office or 1,000 individual homes, we ensure successful arrival.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Collections Preview */}
      <div className={styles.collectionsSection}>
        <div className={styles.splitLayout}>
          <div className={styles.collectionText}>
            <Badge variant="gold">For Every Occasion</Badge>
            <h2 className={styles.sectionTitle}>Curated for Business</h2>
            <p className={styles.collectionDesc}>
              Whether you need a thousand boxes for a conference or distinct luxury sets for your board members,
              we have categories designed for corporate needs.
            </p>

            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <CheckCircle className={styles.checkIcon} />
                <span>Client Appreciation & Retention</span>
              </li>
              <li className={styles.featureItem}>
                <CheckCircle className={styles.checkIcon} />
                <span>Employee Onboarding & Milestones</span>
              </li>
              <li className={styles.featureItem}>
                <CheckCircle className={styles.checkIcon} />
                <span>Virtual Event Tasting Kits</span>
              </li>
              <li className={styles.featureItem}>
                <CheckCircle className={styles.checkIcon} />
                <span>Holiday Gifting Campaigns</span>
              </li>
            </ul>

            <Button variant="primary" className={styles.collectionBtn}>View Full Catalog</Button>
          </div>

          <div className={styles.collectionGrid}>
            <div className={styles.mockProductCard}>
              <img src={executiveGiftImage} alt="Luxury chocolate gift box" className={styles.productImg} loading="lazy" />
              <div className={styles.productInfo}>
                <span className={styles.productTag}>Best Seller</span>
                <h4>The Executive Suite</h4>
              </div>
            </div>
            <div className={styles.mockProductCard}>
              <img src={tastingKitImage} alt="Premium chocolate tasting set" className={styles.productImg} loading="lazy" />
              <div className={styles.productInfo}>
                <span className={styles.productTag}>Event Favorite</span>
                <h4>Virtual Tasting Kit</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Gen / Concierge */}
      <div className={styles.conciergeSection}>
        <div className={styles.conciergeContainer}>
          <div className={styles.conciergeContent}>
            <h2 className={styles.conciergeTitle}>Need help planning?</h2>
            <p className={styles.conciergeDesc}>
              Our gifting specialists are ready to help you curate the perfect experience for your budget and timeline.
            </p>
            <div className={styles.formVisual}>
              <div className={styles.fakeInput}>Enter your work email...</div>
              <Button variant="gold" className={styles.submitBtn}>Get Connected</Button>
            </div>
            <p className={styles.smallPrint}>Volume discounts available for orders over 50 units.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporatePortalPage;
