import { motion } from 'framer-motion';
import { Layers, ArrowRight, Gift, Coffee, Moon } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import styles from './CollectionsPage.module.css';

import heroTruffles from '../assets/collections/hero-truffles.png';
import winterTruffles from '../assets/collections/winter-truffles.png';
import romancePralines from '../assets/collections/romance-pralines.png';
import lunarGoldBonbons from '../assets/collections/lunar-gold-bonbons.png';
import selfCareTruffles from '../assets/collections/self-care-truffles.png';
import officePralineBox from '../assets/collections/office-praline-box.png';
import celebrationBonbons from '../assets/collections/celebration-bonbons.png';
import tastingFlight from '../assets/collections/tasting-flight.png';

interface Collection {
    id: string;
    title: string;
    description: string;
    image: string;
    priceStart: string;
    tags: string[];
}

const SEASONAL_COLLECTIONS: Collection[] = [
    {
        id: 'winter-spiced-truffles',
        title: 'Spiced Winter Truffles',
        description: 'Hand-rolled dark chocolate truffles infused with cinnamon, cardamom and star anise — pure cozy in a bite.',
        image: winterTruffles,
        priceStart: '€24.00',
        tags: ['Limited Edition', 'Truffles'],
    },
    {
        id: 'romance-pralines',
        title: 'Heart Pralines & Bonbons',
        description: 'Heart-shaped pralines, passion-fruit ganache bonbons and raspberry chocolates for the ones you love.',
        image: romancePralines,
        priceStart: '€35.00',
        tags: ['Gift Box', 'Pralines'],
    },
    {
        id: 'lunar-gold-bonbons',
        title: 'Gold Leaf Bonbons',
        description: 'Edible gold leaf chocolate bonbons in red lacquer gift boxes — a luxurious symbol of prosperity.',
        image: lunarGoldBonbons,
        priceStart: '€48.00',
        tags: ['Seasonal', 'Bonbons'],
    },
];

const MOOD_COLLECTIONS = [
    {
        id: 'self-care',
        title: 'Solo Truffle Ritual',
        icon: <Moon className={styles.moodIcon} />,
        description: 'Single-origin dark chocolate truffles paired with herbal infusions for your quiet evenings.',
        color: '#E6E6FA',
        image: selfCareTruffles,
    },
    {
        id: 'office-shared',
        title: 'Sharing Praline Box',
        icon: <Coffee className={styles.moodIcon} />,
        description: 'A curated assortment of pralines and bonbons — the gift that makes you the office hero.',
        color: '#FFF0F5',
        image: officePralineBox,
    },
    {
        id: 'celebration',
        title: 'Centerpiece Bonbons',
        icon: <Gift className={styles.moodIcon} />,
        description: 'Statement chocolate centerpieces with gold leaf and edible flowers for weddings and big moments.',
        color: '#F0FFF0',
        image: celebrationBonbons,
    },
];

const CollectionsPage = () => {
    return (
        <div className={styles.container} data-testid="collections-page">
            {/* Hero Section */}
            <motion.div
                className={styles.hero}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div
                    className={styles.heroBackground}
                    style={{ backgroundImage: `url(${heroTruffles})` }}
                >
                    <div className={styles.heroGradient}></div>
                </div>
                <div className={styles.heroContent}>
                    <div className={styles.iconWrapper}>
                        <Layers className={styles.heroIcon} />
                    </div>
                    <Badge variant="gold" className={styles.heroBadge}>Curated for You</Badge>
                    <h1 className={styles.heroTitle}>
                        The Chocolate <span className={styles.highlight}>Edit</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Hand-picked truffles, pralines and bonbons from Europe's finest small-batch chocolatiers — for every mood, moment and memory.
                    </p>
                    <Button variant="primary" size="lg" className={styles.exploreButton} data-testid="hero-browse-button">
                        Browse All Collections
                    </Button>
                </div>
            </motion.div>

            {/* Seasonal Edit Section */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>The Seasonal Edit</h2>
                    <Button variant="outline" className={styles.viewAllButton} data-testid="view-all-seasonals">
                        View All Seasonals <ArrowRight className={styles.arrowIcon} />
                    </Button>
                </div>
                <p className={styles.sectionLead}>
                    Limited-edition truffles, pralines and chocolate gift boxes — released for one season only.
                </p>
                <div className={styles.horizontalScroll}>
                    {SEASONAL_COLLECTIONS.map((collection, index) => (
                        <motion.div
                            key={collection.id}
                            className={styles.seasonalCard}
                            data-testid={`seasonal-card-${collection.id}`}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <div className={styles.seasonalImageContainer}>
                                <img src={collection.image} alt={collection.title} className={styles.seasonalImage} />
                                <div className={styles.priceTag}>From {collection.priceStart}</div>
                            </div>
                            <div className={styles.seasonalContent}>
                                <div className={styles.tags}>
                                    {collection.tags.map(tag => (
                                        <span key={tag} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                                <h3 className={styles.seasonalTitle}>{collection.title}</h3>
                                <p className={styles.seasonalDescription}>{collection.description}</p>
                                <button className={styles.cardButton} data-testid={`shop-${collection.id}`}>
                                    Shop Collection
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mood Based Section */}
            <div className={styles.moodSection}>
                <div className={styles.moodContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Shop Chocolate by Mood</h2>
                        <p className={styles.sectionSubtitle}>Find the perfect truffle or praline box for your moment.</p>
                    </div>

                    <div className={styles.moodGrid}>
                        {MOOD_COLLECTIONS.map((mood, index) => (
                            <motion.div
                                key={mood.id}
                                className={styles.moodCard}
                                data-testid={`mood-card-${mood.id}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <div className={styles.moodImageBg} style={{ backgroundImage: `url(${mood.image})` }}></div>
                                <div className={styles.moodOverlay}></div>
                                <div className={styles.moodContent}>
                                    <div className={styles.moodIconWrapper}>
                                        {mood.icon}
                                    </div>
                                    <h3 className={styles.moodTitle}>{mood.title}</h3>
                                    <p className={styles.moodDescription}>{mood.description}</p>
                                    <Button variant="outline" className={styles.moodButton} data-testid={`explore-${mood.id}`}>
                                        Explore
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tasting Flights Teaser */}
            <div className={styles.tastingSection}>
                <div className={styles.tastingContent}>
                    <div className={styles.tastingText}>
                        <Badge variant="gold">Experience</Badge>
                        <h2 className={styles.tastingTitle}>Guided Chocolate Tasting Flights</h2>
                        <p className={styles.tastingDescription}>
                            Four single-origin dark chocolate bars, four stories. Each flight box comes with a digital guide
                            so you can taste the difference between Peruvian, Ecuadorian, Madagascan and Ghanaian cacao —
                            from the comfort of your sofa.
                        </p>
                        <Button variant="primary" size="lg" data-testid="start-tasting-button">
                            Start Your Tasting Journey
                        </Button>
                    </div>
                    <div className={styles.tastingImageContainer}>
                        <img
                            src={tastingFlight}
                            alt="Single-origin chocolate tasting flight"
                            className={styles.tastingImage}
                        />
                        <div className={styles.floatingCard}>
                            <div className={styles.floatingIcon}>🍫</div>
                            <div className={styles.floatingText}>
                                <strong>Dark Origin Flight</strong>
                                <span>4 single-origin chocolate bars</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionsPage;
