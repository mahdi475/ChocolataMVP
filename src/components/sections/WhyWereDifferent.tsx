import { useNavigate } from 'react-router-dom';
import { BookOpen, Dice1, Gift, Leaf, Compass, ArrowRight } from 'lucide-react';
import styles from './WhyWereDifferent.module.css';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  route: string;
}

const WhyWereDifferent = () => {
  const navigate = useNavigate();

  const features: FeatureCard[] = [
    {
      icon: <BookOpen className={styles.iconSvg} />,
      title: 'Chocolate Passport',
      description: 'Collect stamps from different countries as you explore. Complete your passport for exclusive rewards!',
      buttonText: 'Start Collecting',
      route: '/chocolate-passport',
    },
    {
      icon: <Dice1 className={styles.iconSvg} />,
      title: 'Surprise Me',
      description: 'Feeling adventurous? Let us randomly select an artisan box tailored to your taste preferences.',
      buttonText: 'Get Surprised',
      route: '/surprise-me',
    },
    {
      icon: <Gift className={styles.iconSvg} />,
      title: 'Corporate Portal',
      description: 'Easy bulk ordering with branded packaging options. Perfect for client gifts and employee rewards.',
      buttonText: 'Explore Corporate',
      route: '/corporate-portal',
    },
    {
      icon: <Leaf className={styles.iconSvg} />,
      title: 'Sustainability Promise',
      description: 'We partner only with chocolatiers committed to ethical sourcing and eco-friendly practices.',
      buttonText: 'Learn More',
      route: '/sustainability',
    },
    {
      icon: <Compass className={styles.iconSvg} />,
      title: 'Discover',
      description: 'Explore new flavors and chocolatiers through our curated discovery program. Find your next favorite chocolate.',
      buttonText: 'Start Exploring',
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
            Why We're Different!
            <span className={styles.decorativeIcon}>✨</span>
          </h2>
          <p className={styles.tagline}>
            Not your basic chocolate shop - we're bringing the fun!
            <span className={styles.decorativeIcon}>🎩</span>
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconContainer}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
              <button
                className={styles.cardButton}
                onClick={() => handleCardClick(feature.route)}
                aria-label={feature.buttonText}
              >
                {feature.buttonText}
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
