
import { motion } from 'framer-motion';
import { Layers, ArrowRight, Gift, Coffee, Moon } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import styles from './CollectionsPage.module.css';

// --- Mock Data ---
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
        id: 'winter-warmers',
        title: 'Winter Warmers',
        description: 'Spiced hot chocolate blends and rich ganaches to keep you cozy.',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=2621&auto=format&fit=crop',
        priceStart: '$24.00',
        tags: ['Limited Edition', 'Spiced'],
    },
    {
        id: 'valentines-preview',
        title: 'Romance Collection',
        description: 'Heart-shaped pralines and passion fruit infusions for your beloved.',
        // Replaced with a reliable high-quality valentines image
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2670&auto=format&fit=crop',
        priceStart: '$35.00',
        tags: ['Gift Box', 'Romantic'],
    },
    {
        id: 'lunar-new-year',
        title: 'Lunar Prosperity',
        description: 'Gold-leaf truffles and red envelop packaging for good fortune.',
        // Replaced with a reliable high-quality lunar new year aesthetic image
        image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?q=80&w=2670&auto=format&fit=crop',
        priceStart: '$48.00',
        tags: ['Seasonal', 'Luxury'],
    },
];

const MOOD_COLLECTIONS = [
    {
        id: 'self-care',
        title: 'Self-Care Sunday',
        icon: <Moon className={styles.moodIcon} />,
        description: 'Slow down with deep dark chocolate and herbal infusions.',
        color: '#E6E6FA', // Lavender
        image: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=2614&auto=format&fit=crop',
    },
    {
        id: 'office-shared',
        title: 'Office Hero',
        icon: <Coffee className={styles.moodIcon} />,
        description: 'Crowd-pleasers that will make you the favorite colleague.',
        color: '#FFF0F5', // Lavender Blush
        image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=2574&auto=format&fit=crop',
    },
    {
        id: 'celebration',
        title: 'Grand Celebration',
        icon: <Gift className={styles.moodIcon} />,
        description: 'Statement pieces for weddings, anniversaries, and big wins.',
        color: '#F0FFF0', // Honeydew
        // Updated to a reliable celebration image
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2670&auto=format&fit=crop',
    },
];

const CollectionsPage = () => {
    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <motion.div
                className={styles.hero}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className={styles.heroBackground}>
                    <div className={styles.heroGradient}></div>
                </div>
                <div className={styles.heroContent}>
                    <div className={styles.iconWrapper}>
                        <Layers className={styles.heroIcon} />
                    </div>
                    <Badge variant="gold" className={styles.heroBadge}>Curated for You</Badge>
                    <h1 className={styles.heroTitle}>The Collection <span className={styles.highlight}>Edit</span></h1>
                    <p className={styles.heroSubtitle}>
                        Handpicked assortments for every moment, mood, and memory.
                    </p>
                    <Button variant="primary" size="lg" className={styles.exploreButton}>
                        Browse All Collections
                    </Button>
                </div>
            </motion.div>

            {/* Seasonal Edit Section */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>The Seasonal Edit</h2>
                    <Button variant="outline" className={styles.viewAllButton}>
                        View All Seasonals <ArrowRight className={styles.arrowIcon} />
                    </Button>
                </div>
                <div className={styles.horizontalScroll}>
                    {SEASONAL_COLLECTIONS.map((collection, index) => (
                        <motion.div
                            key={collection.id}
                            className={styles.seasonalCard}
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
                                <button className={styles.cardButton}>Shop Collection</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Mood Based Section */}
            <div className={styles.moodSection}>
                <div className={styles.moodContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Shop by Mood</h2>
                        <p className={styles.sectionSubtitle}>Find the perfect match for your vibe today.</p>
                    </div>

                    <div className={styles.moodGrid}>
                        {MOOD_COLLECTIONS.map((mood, index) => (
                            <motion.div
                                key={mood.id}
                                className={styles.moodCard}
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
                                    <Button variant="outline" className={styles.moodButton}>
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
                        <h2 className={styles.tastingTitle}>Guided Tasting Flights</h2>
                        <p className={styles.tastingDescription}>
                            Embark on a culinary journey without leaving home. Our box sets come with a digital guide to help you
                            savor the nuance of every bite.
                        </p>
                        <Button variant="primary" size="lg">Start Your Journey</Button>
                    </div>
                    <div className={styles.tastingImageContainer}>
                        <img
                            src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=2670&auto=format&fit=crop"
                            alt="Tasting Flight"
                            className={styles.tastingImage}
                        />
                        <div className={styles.floatingCard}>
                            <div className={styles.floatingIcon}>🍫</div>
                            <div className={styles.floatingText}>
                                <strong>Dark Origin Flight</strong>
                                <span>Includes 4 single-origin bars</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionsPage;
