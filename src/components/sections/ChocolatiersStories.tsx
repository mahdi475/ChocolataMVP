import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import Badge from '../ui/Badge';
import { CHOCOLATIERS } from '../../data/chocolatiers';
import { formatLocalizedLocation, translateLabel } from '../../lib/translationLabels';
import styles from './ChocolatiersStories.module.css';

const FEATURED_CHOCOLATIER_SLUGS = [
  'maison-deluxe',
  'edelkakao',
  'atelier-du-cacao',
  'alpenschoggi',
];

const featuredChocolatiers = FEATURED_CHOCOLATIER_SLUGS
  .map((slug) => CHOCOLATIERS.find((chocolatier) => chocolatier.slug === slug))
  .filter(Boolean)
  .map((chocolatier) => chocolatier!);

const ChocolatiersStories = () => {
  const { t } = useTranslation('ui');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="gold" className={styles.headerBadge}>
            {t('home.meetMakers')}
          </Badge>
          <h2 className={styles.title}>{t('home.makersTitle')}</h2>
          <p className={styles.tagline}>
            {t('home.makersSubtitle')}
          </p>
        </motion.div>

        <div className={styles.cardsGrid}>
          {featuredChocolatiers.map((chocolatier, index) => (
            <motion.article
              key={chocolatier.slug}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <Link
                to={`/chocolatiers/${chocolatier.slug}`}
                className={styles.imageLink}
                aria-label={t('home.viewChocolatierProfileAria', { maker: chocolatier.name })}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={chocolatier.portrait}
                    alt={`${chocolatier.name} portrait`}
                    className={styles.image}
                    loading="lazy"
                  />
                  <div className={styles.badgeOverlay}>
                    <span>
                      <Sparkles className={styles.badgeIcon} />
                      {t('home.featuredMaker')}
                    </span>
                  </div>
                </div>
              </Link>

              <div className={styles.cardContent}>
                <Link to={`/chocolatiers/${chocolatier.slug}`} className={styles.nameLink}>
                  <h3 className={styles.name}>{chocolatier.name}</h3>
                </Link>
                <div className={styles.location}>
                  <MapPin className={styles.locationIcon} />
                  <span>
                    {formatLocalizedLocation(t, chocolatier.city, chocolatier.country)}
                  </span>
                </div>
                <p className={styles.description}>
                  {t(`chocolatierData.${chocolatier.slug}.tagline`, { defaultValue: chocolatier.tagline })}
                </p>
                <div className={styles.tags}>
                  {chocolatier.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{translateLabel(t, 'chocolatierTags', tag)}</span>
                  ))}
                </div>
                <Link to={`/chocolatiers/${chocolatier.slug}`} className={styles.profileLink}>
                  {t('home.viewProfile')} <ArrowRight className={styles.arrowIcon} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className={styles.footerAction}>
          <Link to="/chocolatiers" className={styles.allMakersLink}>
            {t('home.browseAllMakers')} <ArrowRight className={styles.arrowIcon} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ChocolatiersStories;
