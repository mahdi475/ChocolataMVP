import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  Sprout,
  HandCoins,
  Recycle,
  Eye,
  Package,
  Globe2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import styles from './SustainabilityPage.module.css';

import heroImg from '../assets/sustainability/hero-cacao.png';
import imgCacaoFarming from '../assets/sustainability/cacao-farming.png';
import imgArtisanMakers from '../assets/sustainability/artisan-makers.png';
import imgSmallBatch from '../assets/sustainability/small-batch.png';
import imgTransparency from '../assets/sustainability/transparency.png';
import imgEcoPackaging from '../assets/sustainability/eco-packaging.png';

type IconType = typeof Sprout;

interface PillarImageProps {
  src: string;
  alt: string;
  label: string;
  Icon: IconType;
  testId: string;
}

const PillarImage = ({ src, alt, label, Icon, testId }: PillarImageProps) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className={styles.pillarImage} data-testid={testId}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          className={styles.pillarPhoto}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={styles.imagePlaceholder}>
          <Icon className={styles.placeholderIcon} />
          <span className={styles.placeholderLabel}>{label}</span>
        </div>
      )}
    </div>
  );
};

const sdgs = [
  { code: 'SDG 8', label: 'Decent Work & Economic Growth' },
  { code: 'SDG 9', label: 'Industry, Innovation & Infrastructure' },
  { code: 'SDG 10', label: 'Reduced Inequalities' },
  { code: 'SDG 12', label: 'Responsible Consumption & Production' },
  { code: 'SDG 17', label: 'Partnerships for the Goals' },
];

const SustainabilityPage = () => {
  return (
    <div className={styles.container} data-testid="sustainability-page">
      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        data-testid="sustainability-hero"
      >
        <div
          className={styles.heroBackground}
          style={{ backgroundImage: `url(${heroImg})` }}
        >
          <div className={styles.heroGradient} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.iconWrapper}>
            <Leaf className={styles.heroIcon} />
          </div>
          <Badge variant="gold">Our Commitment</Badge>
          <h1 className={styles.heroTitle}>
            Sustainability isn't a slogan.
            <br />
            <span className={styles.highlight}>It's our foundation.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            At Chocolata, we connect small chocolate makers and chocolatiers directly with European
            consumers — building a fairer, more transparent, and more environmentally responsible
            chocolate ecosystem.
          </p>
        </div>
      </motion.section>

      {/* Intro paragraph block */}
      <section className={styles.introSection}>
        <div className={styles.introInner}>
          <p className={styles.lead}>
            Most craft chocolate makers already work with ethically sourced cacao, fair wages, and
            environmentally conscious production. Chocolata gives them a modern digital storefront
            so they can grow without compromising their values — and gives you a way to enjoy some
            of the finest chocolate in Europe while supporting that mission.
          </p>
        </div>
      </section>

      {/* 1. Supporting Ethical, Small-Batch Producers */}
      <section className={styles.pillarBlock}>
        <div className={styles.pillarRow}>
          <div className={styles.pillarText}>
            <span className={styles.pillarNumber}>01</span>
            <h2 className={styles.sectionTitle}>Supporting Ethical, Small‑Batch Producers</h2>
            <p className={styles.description}>
              Most craft chocolate makers already work with ethically sourced cacao, fair wages, and
              environmentally conscious production. Chocolata gives them a modern digital storefront
              so they can grow without compromising their values.
            </p>
            <ul className={styles.checkList}>
              <li>
                <CheckCircle2 className={styles.checkIcon} />
                <span>Better income for producers</span>
              </li>
              <li>
                <CheckCircle2 className={styles.checkIcon} />
                <span>More investment in sustainable farming</span>
              </li>
              <li>
                <CheckCircle2 className={styles.checkIcon} />
                <span>Stronger local communities</span>
              </li>
            </ul>
          </div>
          <PillarImage
            testId="image-cacao-farming"
            src={imgCacaoFarming}
            alt="Cacao pods growing on a tree at a small ethical farm"
            label="Sustainable Cacao Farming"
            Icon={Sprout}
          />
        </div>
      </section>

      {/* 2. Fairer Economics */}
      <section className={`${styles.pillarBlock} ${styles.pillarAlt}`}>
        <div className={`${styles.pillarRow} ${styles.pillarRowReverse}`}>
          <div className={styles.pillarText}>
            <span className={styles.pillarNumber}>02</span>
            <h2 className={styles.sectionTitle}>Fairer Economics for Chocolate Makers</h2>
            <p className={styles.description}>
              Traditional retail takes huge margins. Industrial chocolate squeezes farmers and
              artisans. Chocolata flips the model:
            </p>
            <div className={styles.flowCard}>
              <span className={styles.flowStep}>Producers sell directly</span>
              <ArrowRight className={styles.flowArrow} />
              <span className={styles.flowStep}>They keep more revenue</span>
              <ArrowRight className={styles.flowArrow} />
              <span className={styles.flowStep}>Reinvest in sustainable production</span>
            </div>
          </div>
          <PillarImage
            testId="image-artisan-makers"
            src={imgArtisanMakers}
            alt="Chocolatier hands shaping artisan chocolate"
            label="Artisan Chocolate Makers"
            Icon={HandCoins}
          />
        </div>
      </section>

      {/* 3. Low-Waste, Small-Batch Production */}
      <section className={styles.pillarBlock}>
        <div className={styles.pillarRow}>
          <div className={styles.pillarText}>
            <span className={styles.pillarNumber}>03</span>
            <h2 className={styles.sectionTitle}>Low‑Waste, Small‑Batch Production</h2>
            <p className={styles.description}>
              Craft chocolate is made in small batches, reducing overproduction and waste. By
              increasing demand for artisanal chocolate, we help reduce the environmental footprint
              of the industry.
            </p>
          </div>
          <PillarImage
            testId="image-small-batch"
            src={imgSmallBatch}
            alt="Hand-poured small-batch dark chocolate bars"
            label="Small‑Batch Production"
            Icon={Recycle}
          />
        </div>
      </section>

      {/* 4. Transparency & Traceability */}
      <section className={`${styles.pillarBlock} ${styles.pillarAlt}`}>
        <div className={`${styles.pillarRow} ${styles.pillarRowReverse}`}>
          <div className={styles.pillarText}>
            <span className={styles.pillarNumber}>04</span>
            <h2 className={styles.sectionTitle}>Transparency &amp; Traceability</h2>
            <p className={styles.description}>Consumers can see:</p>
            <ul className={styles.checkList}>
              <li>
                <CheckCircle2 className={styles.checkIcon} />
                <span>Who made the chocolate</span>
              </li>
              <li>
                <CheckCircle2 className={styles.checkIcon} />
                <span>Where the cacao comes from</span>
              </li>
              <li>
                <CheckCircle2 className={styles.checkIcon} />
                <span>How it was produced</span>
              </li>
              <li>
                <CheckCircle2 className={styles.checkIcon} />
                <span>What values the maker stands for</span>
              </li>
            </ul>
            <p className={styles.descriptionMuted}>
              This transparency encourages responsible consumption and strengthens trust.
            </p>
          </div>
          <PillarImage
            testId="image-transparency"
            src={imgTransparency}
            alt="Fermented cocoa beans drying — traceable origin"
            label="Transparent Sourcing"
            Icon={Eye}
          />
        </div>
      </section>

      {/* 5. Environmentally Conscious Packaging */}
      <section className={styles.pillarBlock}>
        <div className={styles.pillarRow}>
          <div className={styles.pillarText}>
            <span className={styles.pillarNumber}>05</span>
            <h2 className={styles.sectionTitle}>Environmentally Conscious Packaging</h2>
            <p className={styles.description}>Many of our makers use:</p>
            <ul className={styles.checkList}>
              <li>
                <CheckCircle2 className={styles.checkIcon} />
                <span>Recyclable materials</span>
              </li>
              <li>
                <CheckCircle2 className={styles.checkIcon} />
                <span>Compostable packaging</span>
              </li>
              <li>
                <CheckCircle2 className={styles.checkIcon} />
                <span>Minimalistic, low‑impact designs</span>
              </li>
            </ul>
            <p className={styles.descriptionMuted}>
              We highlight these producers and encourage others to follow.
            </p>
          </div>
          <PillarImage
            testId="image-eco-packaging"
            src={imgEcoPackaging}
            alt="Recyclable kraft paper chocolate packaging"
            label="Eco‑Friendly Packaging"
            Icon={Package}
          />
        </div>
      </section>

      {/* 6. UN SDG Alignment */}
      <section className={styles.sdgSection} data-testid="sdg-section">
        <div className={styles.sdgInner}>
          <div className={styles.sdgHeader}>
            <Globe2 className={styles.sdgHeaderIcon} />
            <Badge variant="gold">United Nations</Badge>
            <h2 className={styles.sdgTitle}>UN SDG Alignment</h2>
            <p className={styles.sdgSubtitle}>Chocolata contributes to:</p>
          </div>

          <div className={styles.sdgGrid}>
            {sdgs.map((sdg, i) => (
              <motion.div
                key={sdg.code}
                className={styles.sdgCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                data-testid={`sdg-card-${i + 1}`}
              >
                <span className={styles.sdgCode}>{sdg.code}</span>
                <span className={styles.sdgLabel}>{sdg.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className={styles.ctaSection} data-testid="sustainability-cta">
        <div className={styles.ctaContent}>
          <Leaf className={styles.ctaIcon} />
          <h2>A Better Chocolate Future</h2>
          <p>
            By choosing Chocolata, you support ethical sourcing, fairer economics, and
            environmentally responsible production — while enjoying some of the finest chocolate
            Europe has to offer.
          </p>
          <Button variant="gold" size="lg" data-testid="cta-shop-button">
            Explore Our Makers <ArrowRight className={styles.btnIcon} />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default SustainabilityPage;
