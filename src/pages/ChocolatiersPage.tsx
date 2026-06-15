import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { CHOCOLATIERS } from '../data/chocolatiers';
import { isSellerProfileLive, loadSellerStoreProfile, sellerProfileToChocolatier } from '../lib/sellerProfile';
import { translateLabel } from '../lib/translationLabels';
import heroBg from '../assets/collections/hero-truffles.png';
import styles from './ChocolatiersPage.module.css';

const ChocolatiersPage = () => {
  const { t } = useTranslation('ui');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const chocolatiers = useMemo(() => {
    const sellerProfile = loadSellerStoreProfile();
    const demoSeller = sellerProfileToChocolatier(sellerProfile);
    return [
      ...(isSellerProfileLive(sellerProfile) ? [demoSeller] : []),
      ...CHOCOLATIERS.filter((item) => item.slug !== demoSeller.slug),
    ];
  }, []);

  const countries = useMemo(
    () => Array.from(new Set(chocolatiers.map((c) => c.country))).sort(),
    [chocolatiers]
  );

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return chocolatiers.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCountry = selectedCountry ? c.country === selectedCountry : true;
      return matchesSearch && matchesCountry;
    });
  }, [chocolatiers, searchTerm, selectedCountry]);

  return (
    <div className={styles.container} data-testid="chocolatiers-page">
      {/* Hero Section */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.heroBackground} style={{ backgroundImage: `url(${heroBg})` }}>
          <div className={styles.heroGradient} />
        </div>
        <div className={styles.heroContent}>
          <Badge variant="gold" className={styles.heroBadge}>{t('chocolatiers.badge')}</Badge>
          <h1 className={styles.heroTitle}>
            {t('chocolatiers.titlePrefix')} <span className={styles.highlight}>{t('chocolatiers.titleAccent')}</span>
          </h1>
          <p className={styles.heroSubtitle}>
            {t('chocolatiers.subtitle')}
          </p>

          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t('chocolatiers.searchPlaceholder')}
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="chocolatier-search-input"
            />
          </div>
        </div>
      </motion.div>

      {/* Country Filter */}
      <div className={styles.filterSection}>
        <div className={styles.filterContainer}>
          <span className={styles.filterLabel}>{t('chocolatiers.filterByCountry')}</span>
          <div className={styles.filterOptions}>
            <button
              className={`${styles.filterButton} ${selectedCountry === null ? styles.active : ''}`}
              onClick={() => setSelectedCountry(null)}
              data-testid="filter-all"
            >
              {t('chocolatiers.all')}
            </button>
            {countries.map((country) => (
              <button
                key={country}
                className={`${styles.filterButton} ${selectedCountry === country ? styles.active : ''}`}
                onClick={() => setSelectedCountry(country)}
                data-testid={`filter-${country.toLowerCase()}`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={styles.content}>
        <div className={styles.gridContainer}>
          {filtered.length > 0 ? (
            filtered.map((c, index) => (
              <motion.article
                key={c.slug}
                className={styles.card}
                data-testid={`chocolatier-card-${c.slug}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
              >
                <Link to={`/chocolatiers/${c.slug}`} className={styles.cardImageLink}>
                  <div className={styles.cardImageContainer}>
                    <img src={c.portrait} alt={`${c.name} portrait`} className={styles.cardImage} loading="lazy" />
                    {c.logoImage && <img src={c.logoImage} alt="" className={styles.cardLogo} loading="lazy" />}
                  </div>
                </Link>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardName}>{c.name}</h3>
                  <div className={styles.location}>
                    <MapPin className={styles.locationIcon} />
                    <span>
                      {c.city}, {c.country} <span aria-hidden="true">{c.flag}</span>
                    </span>
                  </div>
                  <p className={styles.description}>{t(`chocolatierData.${c.slug}.tagline`, { defaultValue: c.tagline })}</p>
                  <div className={styles.tags}>
                    {c.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {translateLabel(t, 'chocolatierTags', tag)}
                      </span>
                    ))}
                  </div>
                  <Link to={`/chocolatiers/${c.slug}`} className={styles.profileButtonLink}>
                    <Button variant="outline" className={styles.profileButton} data-testid={`view-profile-${c.slug}`}>
                      {t('chocolatiers.viewProfile')} <ArrowRight className={styles.arrowIcon} />
                    </Button>
                  </Link>
                </div>
              </motion.article>
            ))
          ) : (
            <div className={styles.noResults}>
              <h3 className={styles.noResultsTitle}>{t('chocolatiers.emptyTitle')}</h3>
              <p className={styles.noResultsText}>{t('chocolatiers.emptyText')}</p>
              <Button
                variant="gold"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCountry(null);
                }}
                data-testid="clear-filters"
              >
                {t('chocolatiers.clearFilters')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChocolatiersPage;
