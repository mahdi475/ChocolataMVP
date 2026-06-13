import { useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Leaf,
  Heart,
  Users,
  Hammer,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useCart } from '../contexts/CartContext';
import { getChocolatierBySlug, type Product, type ProductTag } from '../data/chocolatiers';
import styles from './ChocolatierProfilePage.module.css';

const FILTERS: { key: ProductTag | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'dark', label: 'Dark' },
  { key: 'milk', label: 'Milk' },
  { key: 'white', label: 'White' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'nut-free', label: 'Nut‑free' },
  { key: 'single-origin', label: 'Single‑origin' },
  { key: 'seasonal', label: 'Seasonal' },
];

const VALUE_ICONS = [Leaf, Heart, Users, Hammer];

const ProductCard = ({
  product,
  chocolatierName,
}: {
  product: Product;
  chocolatierName: string;
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        productId: product.id,
        name: `${product.name} — ${chocolatierName}`,
        price: product.price,
        imageUrl: product.image,
      });
    }
    setQty(1);
    setIsCartOpen(true);
  };

  return (
    <motion.div
      className={styles.productCard}
      data-testid={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.productImageWrap}>
        <img src={product.image} alt={product.name} className={styles.productImage} loading="lazy" />
      </div>
      <div className={styles.productBody}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productDescription}>{product.description}</p>
        <div className={styles.productTags}>
          {product.tags.map((t) => (
            <span key={t} className={styles.productTag}>
              {t}
            </span>
          ))}
        </div>
        <div className={styles.productFooter}>
          <span className={styles.productPrice}>€{product.price.toFixed(2)}</span>
          <div className={styles.qtySelector}>
            <button
              type="button"
              className={styles.qtyBtn}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              data-testid={`qty-minus-${product.id}`}
            >
              <Minus size={14} />
            </button>
            <span className={styles.qtyValue} data-testid={`qty-value-${product.id}`}>
              {qty}
            </span>
            <button
              type="button"
              className={styles.qtyBtn}
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              data-testid={`qty-plus-${product.id}`}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <Button
          variant="primary"
          className={styles.addToCartBtn}
          onClick={handleAdd}
          data-testid={`add-to-cart-${product.id}`}
        >
          <ShoppingBag size={16} /> Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

const ChocolatierProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const chocolatier = getChocolatierBySlug(slug);
  const [activeFilter, setActiveFilter] = useState<ProductTag | 'all'>('all');

  const filteredProducts = useMemo(() => {
    if (!chocolatier) return [];
    if (activeFilter === 'all') return chocolatier.products;
    return chocolatier.products.filter((p) => p.tags.includes(activeFilter));
  }, [chocolatier, activeFilter]);

  if (!chocolatier) {
    return <Navigate to="/chocolatiers" replace />;
  }

  // Gallery: portrait + reused product images as workshop/store/close-ups
  const gallery = [
    chocolatier.portrait,
    chocolatier.products[0]?.image,
    chocolatier.products[1]?.image,
    chocolatier.products[2]?.image,
  ].filter(Boolean) as string[];

  return (
    <div className={styles.container} data-testid="chocolatier-profile-page">
      {/* Hero */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div
          className={styles.heroBackground}
          style={{ backgroundImage: `url(${chocolatier.portrait})` }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Link to="/chocolatiers" className={styles.backLink} data-testid="back-to-chocolatiers">
            <ArrowLeft size={16} /> Back to all chocolatiers
          </Link>
          <Badge variant="gold">European Chocolatier</Badge>
          <h1 className={styles.heroName}>{chocolatier.name}</h1>
          <div className={styles.heroLocation}>
            <MapPin size={18} />
            <span>
              {chocolatier.city}, {chocolatier.country} <span aria-hidden="true">{chocolatier.flag}</span>
            </span>
          </div>
          <p className={styles.heroTagline}>{chocolatier.tagline}</p>
        </div>
      </motion.section>

      {/* Story */}
      <section className={styles.storySection} data-testid="story-section">
        <div className={styles.storyInner}>
          <div className={styles.storyText}>
            <Badge variant="gold">Our Story</Badge>
            <h2 className={styles.sectionTitle}>The story behind {chocolatier.name}</h2>
            <p className={styles.storyParagraph}>{chocolatier.story}</p>
          </div>
          <div className={styles.storyPortrait}>
            <img src={chocolatier.portrait} alt={`${chocolatier.name} portrait`} className={styles.storyImage} />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className={styles.gallerySection} data-testid="gallery-section">
        <div className={styles.galleryHeader}>
          <h2 className={styles.sectionTitle}>Inside the workshop</h2>
          <p className={styles.sectionSubtitle}>Portrait, workshop, store and product close‑ups.</p>
        </div>
        <div className={styles.galleryGrid}>
          {gallery.map((src, i) => (
            <div key={i} className={styles.galleryItem}>
              <img src={src} alt={`${chocolatier.name} gallery ${i + 1}`} className={styles.galleryImage} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className={styles.productsSection} data-testid="products-section">
        <div className={styles.productsHeader}>
          <div>
            <Badge variant="gold">Shop the Maker</Badge>
            <h2 className={styles.sectionTitle}>Hand-finished chocolates</h2>
          </div>
        </div>

        <div className={styles.filters} role="tablist" aria-label="Filter products">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.filterChip} ${activeFilter === f.key ? styles.filterChipActive : ''}`}
              onClick={() => setActiveFilter(f.key)}
              data-testid={`filter-${f.key}`}
              role="tab"
              aria-selected={activeFilter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} chocolatierName={chocolatier.name} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyProducts} data-testid="empty-products">
            <p>No products match this filter yet — try another.</p>
          </div>
        )}
      </section>

      {/* Values */}
      <section className={styles.valuesSection} data-testid="values-section">
        <div className={styles.valuesInner}>
          <div className={styles.valuesHeader}>
            <Badge variant="gold">What we stand for</Badge>
            <h2 className={styles.sectionTitle}>Our values</h2>
          </div>
          <div className={styles.valuesGrid}>
            {chocolatier.values.map((v, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <div key={v.title} className={styles.valueCard}>
                  <div className={styles.valueIconWrap}>
                    <Icon size={22} />
                  </div>
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueDescription}>{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection} data-testid="cta-section">
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Browse the full range from {chocolatier.name}</h2>
          <p className={styles.ctaSubtitle}>
            Truffles, pralines, bonbons and single-origin bars — shipped from {chocolatier.city} across Europe.
          </p>
          <Link to="/catalog" className={styles.ctaLink}>
            <Button variant="gold" size="lg" data-testid="cta-browse-button">
              Browse All Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ChocolatierProfilePage;
