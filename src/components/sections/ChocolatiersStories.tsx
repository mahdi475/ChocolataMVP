import { motion } from 'framer-motion';
import { MapPin, Award } from 'lucide-react';
import Badge from '../ui/Badge';
import styles from './ChocolatiersStories.module.css';
import chocolatier1Image from '../../LogoAssets/Skärmbild 2026-01-26 140459.png';
import chocolatier2Image from '../../LogoAssets/Skärmbild 2026-01-26 140536.png';

interface Chocolatier {
  name: string;
  role: string;
  location: string;
  description: string;
  image: string;
}

const ChocolatiersStories = () => {
  const chocolatiers: Chocolatier[] = [
    {
      name: 'Jean-Pierre Dubois',
      role: '3rd Generation Chocolatier',
      location: 'Lyon, France',
      description: 'For over 60 years, the Dubois family has been crafting exquisite chocolates using traditional French techniques passed down through generations. Every truffle is a masterpiece.',
      image: chocolatier1Image,
    },
    {
      name: 'Sophie Weber',
      role: 'Master Swiss Chocolatier',
      location: 'Zürich, Switzerland',
      description: 'Trained in the finest Swiss chocolate houses, Sophie combines innovation with tradition. Her award-winning creations have redefined luxury chocolate in Switzerland.',
      image: chocolatier2Image,
    },
    {
      name: 'Alessandro Moretti',
      role: 'Gelato & Chocolate Artist',
      location: 'Florence, Italy',
      description: 'Alessandro blends classic Italian flavors with modern art design. His chocolate sculptures are as beautiful as they are delicious.',
      image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?q=80&w=2574&auto=format&fit=crop',
    },
    {
      name: 'Elena Ivanova',
      role: 'Cacao Purist',
      location: 'St. Petersburg, Russia',
      description: 'Elena focuses on single-origin beans, roasting them to perfection to highlight their unique terroir and flavor profiles.',
      image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?q=80&w=2574&auto=format&fit=crop',
    },
  ];

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
          <h2 className={styles.title}>
            Meet the Cool Makers!
            <span className={styles.decorativeIcon}>💭</span>
          </h2>
          <p className={styles.tagline}>
            The awesome people creating these sweet treats! They're literally chocolate wizards!
            <span className={styles.decorativeIcon}>✨</span>
          </p>
        </motion.div>

        <div className={styles.cardsGrid}>
          {chocolatiers.map((chocolatier, index) => (
            <motion.div
              key={chocolatier.name}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div className={styles.imageContainer}>
                <img
                  src={chocolatier.image}
                  alt={chocolatier.name}
                  className={styles.image}
                />
                <div className={styles.badgeOverlay}>
                  <Badge variant="gold" className={styles.masterBadge}>
                    <Award className={styles.badgeIcon} />
                    Choco Master
                  </Badge>
                </div>
                <div className={styles.decorativeOverlay}>
                  {index === 0 ? (
                    <span className={styles.decorativeStar}>⭐</span>
                  ) : (
                    <span className={styles.decorativeShape}>✨</span>
                  )}
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.name}>{chocolatier.name}</h3>
                <p className={styles.role}>{chocolatier.role}</p>
                <div className={styles.location}>
                  <MapPin className={styles.locationIcon} />
                  <span>{chocolatier.location}</span>
                </div>
                <p className={styles.description}>{chocolatier.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChocolatiersStories;
