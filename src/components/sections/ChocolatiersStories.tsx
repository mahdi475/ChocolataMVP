import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import Badge from '../ui/Badge';
import { CHOCOLATIERS } from '../../data/chocolatiers';
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
            Meet the Makers
          </Badge>
          <h2 className={styles.title}>European chocolatiers behind every box</h2>
          <p className={styles.tagline}>
            A featured edit from the same atelier profiles you can explore in the full makers directory.
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
                aria-label={`View ${chocolatier.name} chocolatier profile`}
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
                      Featured maker
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
                    {chocolatier.city}, {chocolatier.country}
                  </span>
                </div>
                <p className={styles.description}>{chocolatier.tagline}</p>
                <div className={styles.tags}>
                  {chocolatier.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link to={`/chocolatiers/${chocolatier.slug}`} className={styles.profileLink}>
                  View profile <ArrowRight className={styles.arrowIcon} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className={styles.footerAction}>
          <Link to="/chocolatiers" className={styles.allMakersLink}>
            Browse all chocolatiers <ArrowRight className={styles.arrowIcon} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ChocolatiersStories;

