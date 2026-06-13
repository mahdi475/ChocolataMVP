
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Gift, Briefcase, Award, PenTool, CheckCircle, Truck, ArrowRight } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import styles from './CorporatePortalPage.module.css';
import corporateHeroImage from '../assets/collections/office-praline-box.png';
import executiveGiftImage from '../assets/products/luxury-praline-box.png';
import tastingKitImage from '../assets/collections/tasting-flight.png';

const CorporatePortalPage = () => {
  const { t } = useTranslation('ui');

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
          <Badge variant="gold" className={styles.heroBadge}>{t('corporate.badge')}</Badge>
          <h1 className={styles.heroTitle}>{t('corporate.heroTitle')} <br /><span className={styles.highlight}>{t('corporate.heroAccent')}</span></h1>
          <p className={styles.heroSubtitle}>{t('corporate.heroSubtitle')}</p>
          <div className={styles.buttonGroup}>
            <Button variant="primary" size="lg" className={styles.ctaButton}>
              {t('corporate.startQuote')}
            </Button>
            <Button variant="outline" size="lg" className={styles.catalogButton}>
              {t('corporate.downloadCatalog')}
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
            <h3 className={styles.cardTitle}>{t('corporate.customBrandingTitle')}</h3>
            <p className={styles.cardText}>{t('corporate.customBrandingText')}</p>
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
            <h3 className={styles.cardTitle}>{t('corporate.premiumQualityTitle')}</h3>
            <p className={styles.cardText}>{t('corporate.premiumQualityText')}</p>
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
            <h3 className={styles.cardTitle}>{t('corporate.conciergeTitle')}</h3>
            <p className={styles.cardText}>{t('corporate.conciergeText')}</p>
          </motion.div>
        </div>
      </div>

      {/* How It Works */}
      <div className={styles.howItWorksRefined}>
        <div className={styles.sectionHeaderCentered}>
          <h2 className={styles.sectionTitle}>{t('corporate.processTitle')}</h2>
          <p className={styles.sectionSubtitle}>{t('corporate.processSubtitle')}</p>
        </div>

        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>01</div>
            <div className={styles.stepContent}>
              <div className={styles.stepIconWrapper}><Gift className={styles.stepIcon} /></div>
              <h3 className={styles.stepTitle}>{t('corporate.stepSelectTitle')}</h3>
              <p className={styles.stepDesc}>{t('corporate.stepSelectText')}</p>
            </div>
          </div>

          <div className={styles.connector}>
            <ArrowRight className={styles.connectorIcon} />
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>02</div>
            <div className={styles.stepContent}>
              <div className={styles.stepIconWrapper}><PenTool className={styles.stepIcon} /></div>
              <h3 className={styles.stepTitle}>{t('corporate.stepCustomizeTitle')}</h3>
              <p className={styles.stepDesc}>{t('corporate.stepCustomizeText')}</p>
            </div>
          </div>

          <div className={styles.connector}>
            <ArrowRight className={styles.connectorIcon} />
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>03</div>
            <div className={styles.stepContent}>
              <div className={styles.stepIconWrapper}><Truck className={styles.stepIcon} /></div>
              <h3 className={styles.stepTitle}>{t('corporate.stepDeliveryTitle')}</h3>
              <p className={styles.stepDesc}>{t('corporate.stepDeliveryText')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Collections Preview */}
      <div className={styles.collectionsSection}>
        <div className={styles.splitLayout}>
          <div className={styles.collectionText}>
            <Badge variant="gold">{t('corporate.occasionBadge')}</Badge>
            <h2 className={styles.sectionTitle}>{t('corporate.businessTitle')}</h2>
            <p className={styles.collectionDesc}>{t('corporate.businessText')}</p>

            <ul className={styles.featureList}>
              <li className={styles.featureItem}>
                <CheckCircle className={styles.checkIcon} />
                <span>{t('corporate.clientAppreciation')}</span>
              </li>
              <li className={styles.featureItem}>
                <CheckCircle className={styles.checkIcon} />
                <span>{t('corporate.employeeOnboarding')}</span>
              </li>
              <li className={styles.featureItem}>
                <CheckCircle className={styles.checkIcon} />
                <span>{t('corporate.virtualEvents')}</span>
              </li>
              <li className={styles.featureItem}>
                <CheckCircle className={styles.checkIcon} />
                <span>{t('corporate.holidayGifting')}</span>
              </li>
            </ul>

            <Button variant="primary" className={styles.collectionBtn}>{t('corporate.viewFullCatalog')}</Button>
          </div>

          <div className={styles.collectionGrid}>
            <div className={styles.mockProductCard}>
              <img src={executiveGiftImage} alt={t('corporate.executiveAlt')} className={styles.productImg} loading="lazy" />
              <div className={styles.productInfo}>
                <span className={styles.productTag}>{t('corporate.bestSeller')}</span>
                <h4>{t('corporate.executiveSuite')}</h4>
              </div>
            </div>
            <div className={styles.mockProductCard}>
              <img src={tastingKitImage} alt={t('corporate.tastingAlt')} className={styles.productImg} loading="lazy" />
              <div className={styles.productInfo}>
                <span className={styles.productTag}>{t('corporate.eventFavorite')}</span>
                <h4>{t('corporate.virtualTastingKit')}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Gen / Concierge */}
      <div className={styles.conciergeSection}>
        <div className={styles.conciergeContainer}>
          <div className={styles.conciergeContent}>
            <h2 className={styles.conciergeTitle}>{t('corporate.needHelp')}</h2>
            <p className={styles.conciergeDesc}>{t('corporate.needHelpText')}</p>
            <div className={styles.formVisual}>
              <div className={styles.fakeInput}>{t('corporate.emailPrompt')}</div>
              <Button variant="gold" className={styles.submitBtn}>{t('corporate.getConnected')}</Button>
            </div>
            <p className={styles.smallPrint}>{t('corporate.volumeDiscount')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporatePortalPage;
