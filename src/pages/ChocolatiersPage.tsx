
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import styles from './ChocolatiersPage.module.css';

// --- Mock Data ---
interface Chocolatier {
  id: string;
  name: string;
  role: string;
  location: string;
  country: string;
  flag: string;
  description: string;
  specialty: string[];
  rating: number;
  reviewCount: number;
  image: string;
  avatar: string;
  featured?: boolean;
}

const MOCK_CHOCOLATIERS: Chocolatier[] = [
  {
    id: '1',
    name: 'Jean-Pierre Dubois',
    role: 'Master Chocolatier',
    location: 'Lyon',
    country: 'France',
    flag: '🇫🇷',
    description: 'Third-generation artisan specializing in dark chocolate ganaches infused with rare spices.',
    specialty: ['Dark Chocolate', 'Spices', 'Truffles'],
    rating: 4.9,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=2574&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2568&auto=format&fit=crop',
    featured: true,
  },
  {
    id: '2',
    name: 'Sophie Weber',
    role: 'Head Chocolatier',
    location: 'Zürich',
    country: 'Switzerland',
    flag: '🇨🇭',
    description: 'Combining Swiss precision with modern flavor profiles. Famous for her champagne truffles.',
    specialty: ['Milk Chocolate', 'Pralines', 'Alcohol Infusions'],
    rating: 4.8,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=2670&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1607631568010-a8724d548fb8?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Alessandro Moretti',
    role: 'Gelato & Chocolate Artist',
    location: 'Florence',
    country: 'Italy',
    flag: '🇮🇹',
    description: 'Sculptural works of edible art. Alessandro treats chocolate as a medium for expression.',
    specialty: ['Sculptures', 'Hazelnuts', 'Gelato'],
    rating: 5.0,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=2614&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?q=80&w=2574&auto=format&fit=crop',
    featured: true,
  },
  {
    id: '4',
    name: 'Elena Ivanova',
    role: 'Cacao Purist',
    location: 'St. Petersburg',
    country: 'Russia',
    flag: '🇷🇺',
    description: 'Bean-to-bar pioneer focusing on single-origin perfection and minimal processing.',
    specialty: ['Bean-to-Bar', 'Single Origin', 'Vegan'],
    rating: 4.7,
    reviewCount: 86,
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=2574&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2576&auto=format&fit=crop',
  },
  {
    id: '5',
    name: 'Yuki Tanaka',
    role: 'Fusion Chocolatier',
    location: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    description: 'Delicate balance of matcha, yuzu, and sakura with premium Belgian chocolate.',
    specialty: ['Matcha', 'Fusion', 'White Chocolate'],
    rating: 4.9,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=2670&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2568&auto=format&fit=crop',
  },
  {
    id: '6',
    name: 'Mateo Garcia',
    role: 'Cacao Farmer & Maker',
    location: 'Cusco, Peru',
    country: 'Peru',
    flag: '🇵🇪',
    description: 'Direct from the source. Mateo oversees the entire process from tree to truffle.',
    specialty: ['Raw Chocolate', 'Organic', 'Fair Trade'],
    rating: 4.8,
    reviewCount: 72,
    image: 'https://images.unsplash.com/photo-1605698592651-7af1cb446d3e?q=80&w=2574&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: '7',
    name: 'Claire Benoit',
    role: 'Patissier',
    location: 'Brussels, Belgium',
    country: 'Belgium',
    flag: '🇧🇪',
    description: 'Classic Belgian techniques with a modern twist. Known for her buttery caramels.',
    specialty: ['Caramel', 'Pralines', 'Gift Sets'],
    rating: 4.6,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf588?q=80&w=2670&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: '8',
    name: 'Kwame Osei',
    role: 'Cocoa Innovator',
    location: 'Accra, Ghana',
    country: 'Ghana',
    flag: '🇬🇭',
    description: 'Revitalizing Ghana\'s chocolate scene with bold, earthy flavors and sustainable practices.',
    specialty: ['Dark Chocolate', 'Spicy', 'Sustainable'],
    rating: 5.0,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=2670&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=2574&auto=format&fit=crop',
  },
];

const ChocolatiersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const filteredChocolatiers = MOCK_CHOCOLATIERS.filter((chocolatier) => {
    const matchesSearch = chocolatier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chocolatier.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion ? chocolatier.country === selectedRegion : true;
    return matchesSearch && matchesRegion;
  });

  const regions = Array.from(new Set(MOCK_CHOCOLATIERS.map(c => c.country)));

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
          <Badge variant="gold" className={styles.heroBadge}>Meet the Makers</Badge>
          <h1 className={styles.heroTitle}>Artisans of <span className={styles.highlight}>Flavor</span></h1>
          <p className={styles.heroSubtitle}>
            Discover the masterminds behind our exquisite chocolate creations.
            From Lyon to Tokyo, taste the world through their hands.
          </p>

          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, city, or specialty..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterContainer}>
          <div className={styles.filterHeader}>
            <Filter className={styles.filterIcon} />
            <span className={styles.filterLabel}>Filter by Region:</span>
          </div>
          <div className={styles.filterOptions}>
            <button
              className={`${styles.filterButton} ${selectedRegion === null ? styles.active : ''}`}
              onClick={() => setSelectedRegion(null)}
            >
              All
            </button>
            {regions.map((region) => (
              <button
                key={region}
                className={`${styles.filterButton} ${selectedRegion === region ? styles.active : ''}`}
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className={styles.content}>
        <div className={styles.gridContainer}>
          {filteredChocolatiers.length > 0 ? (
            filteredChocolatiers.map((chocolatier, index) => (
              <motion.div
                key={chocolatier.id}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.cardImageContainer}>
                  <img src={chocolatier.image} alt={chocolatier.name} className={styles.cardImage} />
                  {chocolatier.featured && (
                    <div className={styles.featuredBadge}>
                      <Star className={styles.starIcon} fill="currentColor" /> Featured
                    </div>
                  )}
                  <div className={styles.avatarContainer}>
                    <img src={chocolatier.avatar} alt={chocolatier.name} className={styles.avatar} />
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardName}>{chocolatier.name}</h3>
                      <p className={styles.cardRole}>{chocolatier.role}</p>
                    </div>
                    <div className={styles.ratingBadge}>
                      <Star className={styles.ratingIcon} fill="currentColor" />
                      <span>{chocolatier.rating}</span>
                    </div>
                  </div>

                  <div className={styles.location}>
                    <MapPin className={styles.locationIcon} />
                    <span>{chocolatier.location}, {chocolatier.country} {chocolatier.flag}</span>
                  </div>

                  <p className={styles.description}>{chocolatier.description}</p>

                  <div className={styles.tags}>
                    {chocolatier.specialty.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>

                  <Button variant="outline" className={styles.profileButton}>
                    View Profile
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={styles.noResults}>
              <h3 className={styles.noResultsTitle}>No artisans found</h3>
              <p className={styles.noResultsText}>Try adjusting your search or filters.</p>
              <Button variant="gold" onClick={() => { setSearchTerm(''); setSelectedRegion(null); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChocolatiersPage;
