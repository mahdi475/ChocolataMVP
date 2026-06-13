import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, User as UserIcon, Menu, X, Search, LogOut, Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import type { RootState } from '../../store';
import styles from './MainLayout.module.css';
import Button from '../ui/Button';
import SearchOverlay from './SearchOverlay';
import LanguageSelector from './LanguageSelector';
import WhyWereDifferent from '../sections/WhyWereDifferent';
import chocolataLogo from '../../LogoAssets/ChokolatLogo.png';
import { prefetchHomepageData } from '../../lib/homepageData';

interface MainLayoutProps { children: ReactNode }

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, role, handleLogout } = useAuth();
  const { t } = useTranslation('ui');
  const { setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useSelector((state: RootState) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Pages where WhyWereDifferent should not be shown
  const excludeWhyDifferentPages = [
    '/chocolate-passport',
    '/surprise-me',
    '/corporate-portal',
    '/sustainability',
    '/discover',
  ];

  const shouldShowWhyDifferent = !excludeWhyDifferentPages.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/');
  };

  return (
    <div className={styles.root}>
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navbarContainer}>
          <Link
            to="/"
            className={styles.brand}
            aria-label={t('nav.homeAria')}
            onMouseEnter={prefetchHomepageData}
            onFocus={prefetchHomepageData}
            onTouchStart={prefetchHomepageData}
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={chocolataLogo} alt="Chocolata" className={styles.logoImage} />
          </Link>

          <div className={styles.desktopLinks}>
            <Link to="/catalog" className={styles.link}>{t('nav.shop')}</Link>
            <Link to="/chocolatiers" className={styles.link}>{t('nav.chocolatiers')}</Link>
            <Link to="/collections" className={styles.link}>{t('nav.collections')}</Link>
            <Link to="/corporate-portal" className={styles.link}>{t('nav.corporateGifts')}</Link>
            <Link to="/sustainability" className={styles.link}>{t('nav.sustainability')}</Link>
            <Link to="/about" className={styles.link}>{t('nav.about')}</Link>
          </div>

          <div className={styles.icons}>
            <button
              onClick={() => setIsSearchOpen(true)}
              className={styles.iconButton}
              aria-label={t('nav.search')}
            >
              <Search className={styles.icon} />
            </button>

            <LanguageSelector />

            <Link
              to={user ? (role === 'buyer' ? '/profile' : `/${role}/dashboard`) : '/login'}
              className={styles.iconButton}
              aria-label={t('nav.profile')}
            >
              <UserIcon className={styles.icon} />
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className={styles.iconButton}
              aria-label={t('nav.cart')}
            >
              <ShoppingBag className={styles.icon} />
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </button>

            {user && (
              <button
                onClick={handleLogoutClick}
                className={`${styles.iconButton} ${styles.mobileOnly}`}
                aria-label={t('nav.logout')}
                title={t('nav.logout')}
              >
                <LogOut className={styles.icon} />
              </button>
            )}

            <button
              className={`${styles.mobileMenuButton} ${styles.mobileOnly}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={t('nav.toggleMenu')}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className={styles.icon} /> : <Menu className={styles.icon} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link to="/catalog" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              {t('nav.shop')}
            </Link>
            <Link to="/chocolatiers" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              {t('nav.chocolatiers')}
            </Link>
            <Link to="/collections" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              {t('nav.collections')}
            </Link>
            <Link to="/corporate-portal" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              {t('nav.corporateGifts')}
            </Link>
            <Link to="/sustainability" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              {t('nav.sustainability')}
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              {t('nav.about')}
            </Link>
            {!user && (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
                {t('nav.loginRegister')}
              </Link>
            )}
            {user && (
              <button onClick={handleLogoutClick} className={styles.mobileLink}>
                {t('nav.logout')}
              </button>
            )}
          </div>
        )}
      </nav>

      <main className={styles.main}>{children}</main>

      {shouldShowWhyDifferent && <WhyWereDifferent />}

      <footer className={styles.footer}>
        {/* Top Section: Newsletter Signup - Centered */}
        <div className={styles.footerNewsletter}>
          <div className={styles.newsletterContent}>
            <h2 className={styles.newsletterTitle}>{t('footer.newsletterTitle')}</h2>
            <p className={styles.newsletterDescription}>{t('footer.newsletterDescription')}</p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className={styles.newsletterInput}
              />
              <Button variant="gold" className={styles.newsletterButton}>{t('footer.newsletterButton')}</Button>
            </form>
          </div>
        </div>

        {/* Middle Section: Navigation Links - Four Columns */}
        <div className={styles.footerNavigation}>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>{t('footer.shop')}</h4>
            <ul className={styles.footerList}>
              <li><Link to="/catalog" className={styles.footerLink}>{t('footer.allChocolates')}</Link></li>
              <li><Link to="/catalog?category=dark" className={styles.footerLink}>{t('footer.byCountry')}</Link></li>
              <li><Link to="/catalog?category=gifts" className={styles.footerLink}>{t('footer.byType')}</Link></li>
              <li><Link to="/catalog?category=gifts" className={styles.footerLink}>{t('footer.giftSets')}</Link></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>{t('footer.support')}</h4>
            <ul className={styles.footerList}>
              <li><a href="#" className={styles.footerLink}>{t('footer.faqs')}</a></li>
              <li><a href="#" className={styles.footerLink}>{t('footer.shippingInfo')}</a></li>
              <li><a href="#" className={styles.footerLink}>{t('footer.returns')}</a></li>
              <li><a href="#" className={styles.footerLink}>{t('footer.contactUs')}</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>{t('footer.company')}</h4>
            <ul className={styles.footerList}>
              <li><Link to="/about" className={styles.footerLink}>{t('footer.aboutUs')}</Link></li>
              <li><Link to="/about" className={styles.footerLink}>{t('footer.ourStory')}</Link></li>
              <li><a href="#" className={styles.footerLink}>{t('footer.sustainability')}</a></li>
              <li><a href="#" className={styles.footerLink}>{t('footer.careers')}</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>{t('footer.legal')}</h4>
            <ul className={styles.footerList}>
              <li><a href="#" className={styles.footerLink}>{t('footer.privacyPolicy')}</a></li>
              <li><a href="#" className={styles.footerLink}>{t('footer.termsOfService')}</a></li>
              <li><a href="#" className={styles.footerLink}>{t('footer.cookiePolicy')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Branding, Social Media, Copyright */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBranding}>
            <img src={chocolataLogo} alt="Chocolata" className={styles.footerLogo} />
            <div className={styles.brandInfo}>
              <h3 className={styles.brandName}>CHOCOLATA</h3>
              <p className={styles.brandSlogan}>{t('footer.brandSlogan')}</p>
            </div>
          </div>
          <div className={styles.socialMedia}>
            <a href="#" className={styles.socialIcon} aria-label="Facebook">
              <Facebook className={styles.socialIconSvg} />
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Instagram">
              <Instagram className={styles.socialIconSvg} />
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Twitter">
              <Twitter className={styles.socialIconSvg} />
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Email">
              <Mail className={styles.socialIconSvg} />
            </a>
          </div>
        </div>
        <div className={styles.footerCopyright}>
          <p>&copy; {new Date().getFullYear()} Chocolata. {t('footer.copyright')}</p>
        </div>
      </footer>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default MainLayout;
