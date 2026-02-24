
import { motion } from 'framer-motion';
import { Leaf, Award, Recycle, Users, Sprout, ArrowRight, Map } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import styles from './SustainabilityPage.module.css';

const SustainabilityPage = () => {
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
            <Leaf className={styles.heroIcon} />
          </div>
          <h1 className={styles.heroTitle}>Ethical from <br /><span className={styles.highlight}>Bean to Bar</span></h1>
          <p className={styles.heroSubtitle}>
            We believe chocolate tastes better when it's good for the planet and the people who grow it.
            Transparency, fairness, and regenerative agriculture are at our core.
          </p>
        </div>

        {/* Animated Stats Bar */}
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Slave-Free</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>50k+</span>
            <span className={styles.statLabel}>Trees Planted</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>3x</span>
            <span className={styles.statLabel}>Fair Trade Price</span>
          </div>
        </div>
      </motion.div>

      {/* Sourcing Map Section */}
      <div className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <div className={styles.mapText}>
            <Badge variant="gold">Global Impact</Badge>
            <h2 className={styles.sectionTitle}>Sourcing with Purpose</h2>
            <p className={styles.description}>
              We partner directly with cooperatives in Peru, Ghana, and Ecuador. By cutting out middlemen,
              we ensure farmers receive a living income while preserving heirloom cacao varieties.
            </p>
            <ul className={styles.regionList}>
              <li className={styles.regionItem}>
                <span className={styles.regionDot} style={{ background: '#D4AF37' }}></span>
                <strong>Cusco, Peru:</strong> Regenerative Chuncho Cacao
              </li>
              <li className={styles.regionItem}>
                <span className={styles.regionDot} style={{ background: '#8B4513' }}></span>
                <strong>Ashanti, Ghana:</strong> Women-led Cooperatives
              </li>
              <li className={styles.regionItem}>
                <span className={styles.regionDot} style={{ background: '#228B22' }}></span>
                <strong>Esmeraldas, Ecuador:</strong> Cloud Forest Preservation
              </li>
            </ul>
            <Button variant="primary" className={styles.mapBtn}>
              <Map className={styles.btnIcon} /> Explore Interactive Map
            </Button>
          </div>

          <div className={styles.mapVisual}>
            {/* OpenStreetMap Embed */}
            <div className={styles.worldMap}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://www.openstreetmap.org/export/embed.html?bbox=-73.58%2C-3.88%2C-73.1%2C-3.6&amp;layer=mapnik"
                style={{ border: 0, borderRadius: '16px' }}
                title="Sourcing Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars of Impact */}
      <div className={styles.pillarsSection}>
        <div className={styles.sectionHeaderCentered}>
          <h2 className={styles.sectionTitle}>Our Impact Pillars</h2>
        </div>

        <div className={styles.pillarsGrid}>
          <motion.div
            className={styles.pillarCard}
            whileHover={{ y: -10 }}
          >
            <div className={styles.pillarIconBox}><Users className={styles.pillarIcon} /></div>
            <h3>Farmer Prosperity</h3>
            <p>Paying premiums directly to farmers to support education, healthcare, and community infrastructure.</p>
          </motion.div>

          <motion.div
            className={styles.pillarCard}
            whileHover={{ y: -10 }}
          >
            <div className={styles.pillarIconBox}><Sprout className={styles.pillarIcon} /></div>
            <h3>Regenerative Ag</h3>
            <p>Supporting agroforestry systems that restore soil health and biodiversity rather than depleting it.</p>
          </motion.div>

          <motion.div
            className={styles.pillarCard}
            whileHover={{ y: -10 }}
          >
            <div className={styles.pillarIconBox}><Recycle className={styles.pillarIcon} /></div>
            <h3>Zero Waste</h3>
            <p>Compostable packaging and upcycling cacao fruit pulp into new, delicious products.</p>
          </motion.div>
        </div>
      </div>

      {/* Timeline / Transparency */}
      <div className={styles.timelineSection}>
        <div className={styles.timelineRow}>
          <div className={styles.timelineImageWrapper}>
            <img src="https://images.unsplash.com/photo-1594916325514-d035414dc995?q=80&w=2670&auto=format&fit=crop" alt="Cacao Pod" className={styles.timelineImage} />
          </div>
          <div className={styles.timelineContent}>
            <div className={styles.timelineStep}>
              <div className={styles.stepLine}></div>
              <div className={styles.stepNumber}>01</div>
              <h4>Harvest</h4>
              <p>Ripe pods are hand-harvested and beans are fermented in wooden boxes for 6 days to develop flavor.</p>
            </div>
            <div className={styles.timelineStep}>
              <div className={styles.stepLine}></div>
              <div className={styles.stepNumber}>02</div>
              <h4>Direct Trade</h4>
              <p>Beans are purchased directly at farm-gate prices, verified by blockchain technology for full traceability.</p>
            </div>
            <div className={styles.timelineStep}>
              <div className={styles.stepNumber}>03</div>
              <h4>Craft</h4>
              <p>Slow roasted in small batches to preserve the unique terroir of each origin.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Join the Movement */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <Award className={styles.ctaIcon} />
          <h2>Be Part of the Change</h2>
          <p>Every bar you buy supports a fairer, greener future for chocolate.</p>
          <Button variant="gold" size="lg">Shop Sustainable Collection <ArrowRight className={styles.btnIcon} /></Button>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityPage;
