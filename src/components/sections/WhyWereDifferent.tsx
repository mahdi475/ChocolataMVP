import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Dice1, Gift, Leaf, Compass, ArrowRight } from 'lucide-react';
import styles from './WhyWereDifferent.module.css';

interface FeatureCard {
  icon: React.ReactNode;
  key: string;
  route: string;
}

const WhyWereDifferent = () => {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();

  const features: FeatureCard[] = [
    {
      icon: <BookOpen className={styles.iconSvg} />,
      key: 'passport',
      route: '/chocolate-passport',
    },
    {
      icon: <Dice1 className={styles.iconSvg} />,
      key: 'surprise',
      route: '/surprise-me',
    },
    {
      icon: <Gift className={styles.iconSvg} />,
      key: 'corporate',
      route: '/corporate-portal',
    },
    {
      icon: <Leaf className={styles.iconSvg} />,
      key: 'sustainability',
      route: '/sustainability',
    },
    {
      icon: <Compass className={styles.iconSvg} />,
      key: 'discover',
      route: '/discover',
    },
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {t('whyDifferent.title')}
            <span className={styles.decorativeIcon}>✨</span>
          </h2>
          <p className={styles.tagline}>
            {t('whyDifferent.tagline')}
            <span className={styles.decorativeIcon}>🎩</span>
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconContainer}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{t(`whyDifferent.features.${feature.key}.title`)}</h3>
              <p className={styles.cardDescription}>{t(`whyDifferent.features.${feature.key}.description`)}</p>
              <button
                className={styles.cardButton}
                onClick={() => handleCardClick(feature.route)}
                aria-label={t(`whyDifferent.features.${feature.key}.button`)}
              >
                {t(`whyDifferent.features.${feature.key}.button`)}
                <ArrowRight className={styles.buttonIcon} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyWereDifferent;
