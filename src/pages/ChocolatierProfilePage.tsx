import { useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Leaf,
  Gift,
  Heart,
  Users,
  Hammer,
  PackageCheck,
  ShieldCheck,
  ThermometerSun,
  Truck,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useCart } from '../contexts/CartContext';
import { getChocolatierBySlug, type Product, type ProductTag } from '../data/chocolatiers';
import { getShippingPackaging } from '../lib/shippingPackaging';
import {
  DEMO_SELLER_PROFILE_SLUG,
  isSellerProfileLive,
  loadSellerStoreProfile,
  sellerProfileToChocolatier,
} from '../lib/sellerProfile';
import { translateLabel } from '../lib/translationLabels';
import styles from './ChocolatierProfilePage.module.css';

const FILTERS: { key: ProductTag | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'dark', label: 'Dark' },
  { key: 'milk', label: 'Milk' },
  { key: 'white', label: 'White' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'nut-free', label: 'Nut-free' },
  { key: 'single-origin', label: 'Single-origin' },
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
  const { t } = useTranslation('ui');
  const { addToCart, setIsCartOpen } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        productId: product.id,
        name: `${product.name} - ${chocolatierName}`,
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
      <Link to={`/product/${product.id}`} className={styles.productImageWrap}>
        <img src={product.image} alt={product.name} className={styles.productImage} loading="lazy" />
      </Link>
      <div className={styles.productBody}>
        <Link to={`/product/${product.id}`} className={styles.productNameLink}>
          <h3 className={styles.productName}>{product.name}</h3>
        </Link>
        <p className={styles.productDescription}>{t(`chocolatierProducts.${product.id}.description`, { defaultValue: product.description })}</p>
        <div className={styles.productTags}>
          {product.tags.map((tag) => (
            <span key={tag} className={styles.productTag}>
              {translateLabel(t, 'filters', tag)}
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
              aria-label={t('cart.decrease')}
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
              aria-label={t('cart.increase')}
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
          <ShoppingBag size={16} /> {t('productCard.addToCart')}
        </Button>
      </div>
    </motion.div>
  );
};

const ChocolatierProfilePage = () => {
  const { t } = useTranslation('ui');
  const { slug } = useParams<{ slug: string }>();
  const sellerProfile = slug === DEMO_SELLER_PROFILE_SLUG ? loadSellerStoreProfile() : null;
  const chocolatier = slug === DEMO_SELLER_PROFILE_SLUG
    ? (sellerProfile && isSellerProfileLive(sellerProfile) ? sellerProfileToChocolatier(sellerProfile) : undefined)
    : getChocolatierBySlug(slug);
  const [activeFilter, setActiveFilter] = useState<ProductTag | 'all'>('all');

  const filteredProducts = useMemo(() => {
    if (!chocolatier) return [];
    if (activeFilter === 'all') return chocolatier.products;
    return chocolatier.products.filter((p) => p.tags.includes(activeFilter));
  }, [chocolatier, activeFilter]);

  if (!chocolatier) {
    return <Navigate to="/chocolatiers" replace />;
  }

  const coverImage = chocolatier.coverImage || chocolatier.portrait;
  const logoImage = chocolatier.logoImage || chocolatier.portrait;
  const gallery = [
    ...(chocolatier.galleryImages || []),
    coverImage,
    chocolatier.products[0]?.image,
    chocolatier.products[1]?.image,
    chocolatier.products[2]?.image,
  ].filter(Boolean).filter((src, index, all) => all.indexOf(src) === index) as string[];
  const shippingPackaging = getShippingPackaging(chocolatier.shippingPackaging, {
    shipsFromCountry: chocolatier.country,
    shipsFromCity: chocolatier.city,
  });
  const shipsFrom = [shippingPackaging.shipsFromCity, shippingPackaging.shipsFromCountry].filter(Boolean).join(', ');
  const deliveryEstimate = shippingPackaging.deliveryEstimate
    ? t('shippingPackaging.deliveryBusinessDays', { range: shippingPackaging.deliveryEstimate })
    : t('shippingPackaging.deliveryEstimateFallback');
  const shippingStandardItems = [
    {
      icon: Truck,
      label: t('shippingPackaging.shipsFrom'),
      value: shipsFrom || t('productDetail.europeanAtelier'),
    },
    {
      icon: ShieldCheck,
      label: t('shippingPackaging.deliveryEstimate'),
      value: deliveryEstimate,
    },
    {
      icon: PackageCheck,
      label: t('shippingPackaging.shippingEstimate'),
      value: t('shippingPackaging.calculatedAtCheckout'),
    },
    {
      icon: Truck,
      label: t('shippingPackaging.domesticEuShipping'),
      value: shippingPackaging.euShipping ? t('shippingPackaging.domesticAndEu') : t('shippingPackaging.domesticOnly'),
    },
    {
      icon: ThermometerSun,
      label: t('shippingPackaging.heatProtectionAvailable'),
      value: shippingPackaging.heatProtection ? t('shippingPackaging.available') : t('shippingPackaging.onRequest'),
    },
    {
      icon: Gift,
      label: t('shippingPackaging.giftPackagingAvailable'),
      value: shippingPackaging.giftPackaging ? t('shippingPackaging.available') : t('shippingPackaging.onRequest'),
    },
    {
      icon: ShieldCheck,
      label: t('shippingPackaging.summerShippingAvailable'),
      value: shippingPackaging.summerShipping ? t('shippingPackaging.available') : t('shippingPackaging.onRequest'),
    },
    {
      icon: Leaf,
      label: t('shippingPackaging.ecoPackagingAvailable'),
      value: shippingPackaging.ecoPackaging ? t('shippingPackaging.available') : t('shippingPackaging.onRequest'),
    },
  ];

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
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Link to="/chocolatiers" className={styles.backLink} data-testid="back-to-chocolatiers">
            <ArrowLeft size={16} /> {t('chocolatierProfile.backToAll')}
          </Link>
          <div className={styles.profileHeader}>
            <img src={logoImage} alt="" className={styles.profileLogo} />
            <div className={styles.profileHeaderText}>
              <Badge variant="gold">{t('chocolatierProfile.europeanChocolatier')}</Badge>
              <h1 className={styles.heroName}>{chocolatier.name}</h1>
            </div>
          </div>
          <div className={styles.heroLocation}>
            <MapPin size={18} />
            <span>
              {chocolatier.city}, {chocolatier.country} <span aria-hidden="true">{chocolatier.flag}</span>
            </span>
          </div>
          <p className={styles.heroTagline}>{t(`chocolatierData.${chocolatier.slug}.tagline`, { defaultValue: chocolatier.tagline })}</p>
          <div className={styles.heroBadges}>
            {[
              t('shippingPackaging.heatProtected'),
              t('shippingPackaging.giftReady'),
              t('shippingPackaging.ecoPackaging'),
            ].map((badge) => <span key={badge}>{badge}</span>)}
          </div>
          <div className={styles.heroActions}>
            <a href="#maker-products" className={styles.heroAction}>{t('chocolatierProfile.viewProducts')}</a>
            <a href={`mailto:hello@chocolata.example?subject=${encodeURIComponent(chocolatier.name)}`} className={styles.heroAction}>
              {t('chocolatierProfile.contactMaker')}
            </a>
          </div>
        </div>
      </motion.section>

      {/* Products */}
      <section className={styles.productsSection} id="maker-products" data-testid="products-section">
        <div className={styles.productsHeader}>
          <div>
            <Badge variant="gold">{t('chocolatierProfile.shopMaker')}</Badge>
            <h2 className={styles.sectionTitle}>{t('chocolatierProfile.handFinished')}</h2>
          </div>
        </div>

        <div className={styles.filters} role="tablist" aria-label={t('chocolatierProfile.filterProducts')}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`${styles.filterChip} ${activeFilter === f.key ? styles.filterChipActive : ''}`}
              onClick={() => setActiveFilter(f.key)}
              data-testid={`filter-${f.key}`}
              role="tab"
              aria-selected={activeFilter === f.key}
            >
              {translateLabel(t, 'filters', f.label)}
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
            <p>{t('chocolatierProfile.emptyProducts')}</p>
          </div>
        )}
      </section>

      {/* Gallery */}
      <section className={styles.gallerySection} data-testid="gallery-section">
        <div className={styles.galleryHeader}>
          <h2 className={styles.sectionTitle}>{t('chocolatierProfile.photoAlbum')}</h2>
          <p className={styles.sectionSubtitle}>{t('chocolatierProfile.gallerySubtitle')}</p>
        </div>
        <div className={styles.galleryGrid}>
          {gallery.map((src, i) => (
            <a key={src} href={src} target="_blank" rel="noreferrer" className={styles.galleryItem}>
              <img
                src={src}
                alt={t('chocolatierProfile.galleryImageAlt', { maker: chocolatier.name, number: i + 1 })}
                className={styles.galleryImage}
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </section>

      <section className={styles.shippingStandardsSection} data-testid="shipping-packaging-standards">
        <div className={styles.shippingStandardsInner}>
          <div className={styles.shippingStandardsHeader}>
            <Badge variant="gold">{t('shippingPackaging.standardsBadge')}</Badge>
            <h2 className={styles.sectionTitle}>{t('shippingPackaging.profileTitle')}</h2>
            <p className={styles.sectionSubtitle}>{t('shippingPackaging.profileManagedByMaker')}</p>
          </div>
          <div className={styles.shippingStandardsGrid}>
            {shippingStandardItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={styles.shippingStandardCard}>
                  <Icon className={styles.shippingStandardIcon} />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.value}</small>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className={styles.storySection} data-testid="story-section">
        <div className={styles.storyInner}>
          <div className={styles.storyText}>
            <Badge variant="gold">{t('chocolatierProfile.ourStory')}</Badge>
            <h2 className={styles.sectionTitle}>{t('chocolatierProfile.storyBehind', { maker: chocolatier.name })}</h2>
            <p className={styles.storyParagraph}>{t(`chocolatierData.${chocolatier.slug}.story`, { defaultValue: chocolatier.story })}</p>
            <dl className={styles.valueCard}>
              <div>
                <dt>{t('chocolatierProfile.aboutTheChocolatier')}</dt>
                <dd>{t(`chocolatierData.${chocolatier.slug}.tagline`, { defaultValue: chocolatier.tagline })}</dd>
              </div>
              <div>
                <dt>{t('chocolatierProfile.madeIn')}</dt>
                <dd>{chocolatier.city}, {chocolatier.country}</dd>
              </div>
              <div>
                <dt>{t('chocolatierProfile.founded')}</dt>
                <dd>{t(`chocolatierData.${chocolatier.slug}.founded`, { defaultValue: t('chocolatierProfile.smallBatchAtelier') })}</dd>
              </div>
              <div>
                <dt>{t('chocolatierProfile.specialties')}</dt>
                <dd>{chocolatier.tags.slice(0, 4).map((tag) => translateLabel(t, 'chocolatierTags', tag)).join(', ')}</dd>
              </div>
            </dl>
          </div>
          <div className={styles.storyPortrait}>
            <img src={coverImage} alt="" className={styles.storyImage} />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection} data-testid="values-section">
        <div className={styles.valuesInner}>
          <div className={styles.valuesHeader}>
            <Badge variant="gold">{t('chocolatierProfile.whatWeStandFor')}</Badge>
            <h2 className={styles.sectionTitle}>{t('chocolatierProfile.ourValues')}</h2>
          </div>
          <div className={styles.valuesGrid}>
            {chocolatier.values.map((v, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <div key={v.title} className={styles.valueCard}>
                  <div className={styles.valueIconWrap}>
                    <Icon size={22} />
                  </div>
                  <h3 className={styles.valueTitle}>{translateLabel(t, 'valueTitles', v.title)}</h3>
                  <p className={styles.valueDescription}>{translateLabel(t, 'valueDescriptions', v.description)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection} data-testid="cta-section">
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>{t('chocolatierProfile.browseRange', { maker: chocolatier.name })}</h2>
          <p className={styles.ctaSubtitle}>
            {t('chocolatierProfile.ctaSubtitle', { city: chocolatier.city })}
          </p>
          <Link to="/catalog" className={styles.ctaLink}>
            <Button variant="gold" size="lg" data-testid="cta-browse-button">
              {t('chocolatierProfile.browseAllProducts')}
            </Button>
          </Link>
          <div className={styles.filters}>
            <Link to="/catalog" className={styles.filterChip}>{t('chocolatierProfile.viewProducts')}</Link>
            <a href={`mailto:hello@chocolata.example?subject=${encodeURIComponent(chocolatier.name)}`} className={styles.filterChip}>{t('chocolatierProfile.contactMaker')}</a>
            <Link to="/catalog" className={styles.filterChip}>{t('chocolatierProfile.visitShop')}</Link>
            <span className={styles.filterChip}>{t('chocolatierProfile.awards')}</span>
            <span className={styles.filterChip}>{t('chocolatierProfile.ingredients')}</span>
            <span className={styles.filterChip}>{t('chocolatierProfile.sustainability')}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChocolatierProfilePage;
