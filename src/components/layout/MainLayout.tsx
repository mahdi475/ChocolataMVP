import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingBag, User as UserIcon, Menu, X, Search, LogOut, Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import type { RootState } from '../../store';
import styles from './MainLayout.module.css';
import Button from '../ui/Button';
import SearchOverlay from './SearchOverlay';
import WhyWereDifferent from '../sections/WhyWereDifferent';
import chocolataLogo from '../../LogoAssets/ChokolatLogo.png';
import { prefetchHomepageData } from '../../lib/homepageData';

interface MainLayoutProps { children: ReactNode }

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, role, handleLogout } = useAuth();
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
            aria-label="Chocolata home"
            onMouseEnter={prefetchHomepageData}
            onFocus={prefetchHomepageData}
            onTouchStart={prefetchHomepageData}
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={chocolataLogo} alt="Chocolata" className={styles.logoImage} />
          </Link>

          <div className={styles.desktopLinks}>
            <Link to="/catalog" className={styles.link}>Shop</Link>
            <Link to="/chocolatiers" className={styles.link}>Chocolatiers</Link>
            <Link to="/collections" className={styles.link}>Collections</Link>
            <Link to="/corporate-portal" className={styles.link}>Corporate Gifts</Link>
            <Link to="/sustainability" className={styles.link}>Sustainability</Link>
            <Link to="/about" className={styles.link}>About Us</Link>
          </div>

          <div className={styles.icons}>
            <button
              onClick={() => setIsSearchOpen(true)}
              className={styles.iconButton}
              aria-label="Search"
            >
              <Search className={styles.icon} />
            </button>

            <Link
              to={user ? (role === 'buyer' ? '/profile' : `/${role}/dashboard`) : '/login'}
              className={styles.iconButton}
              aria-label="User profile"
            >
              <UserIcon className={styles.icon} />
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className={styles.iconButton}
              aria-label="Shopping cart"
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
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className={styles.icon} />
              </button>
            )}

            <button
              className={`${styles.mobileMenuButton} ${styles.mobileOnly}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className={styles.icon} /> : <Menu className={styles.icon} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link to="/catalog" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              Shop
            </Link>
            <Link to="/chocolatiers" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              Chocolatiers
            </Link>
            <Link to="/collections" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              Collections
            </Link>
            <Link to="/corporate-portal" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              Corporate Gifts
            </Link>
            <Link to="/sustainability" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              Sustainability
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              About Us
            </Link>
            {!user && (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
                Login / Register
              </Link>
            )}
            {user && (
              <button onClick={handleLogoutClick} className={styles.mobileLink}>
                Logout
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
            <h2 className={styles.newsletterTitle}>
              Stay in the Loop! 📬
            </h2>
            <p className={styles.newsletterDescription}>
              Get the latest drops, exclusive deals, and sweet surprises! 🎉
            </p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="your.email@cool.com"
                className={styles.newsletterInput}
              />
              <Button variant="gold" className={styles.newsletterButton}>
                Let's Go! 🚀
              </Button>
            </form>
          </div>
        </div>

        {/* Middle Section: Navigation Links - Four Columns */}
        <div className={styles.footerNavigation}>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Shop</h4>
            <ul className={styles.footerList}>
              <li><Link to="/catalog" className={styles.footerLink}>All Chocolates</Link></li>
              <li><Link to="/catalog?category=dark" className={styles.footerLink}>By Country</Link></li>
              <li><Link to="/catalog?category=gifts" className={styles.footerLink}>By Type</Link></li>
              <li><Link to="/catalog?category=gifts" className={styles.footerLink}>Gift Sets</Link></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Support</h4>
            <ul className={styles.footerList}>
              <li><a href="#" className={styles.footerLink}>FAQs</a></li>
              <li><a href="#" className={styles.footerLink}>Shipping Info</a></li>
              <li><a href="#" className={styles.footerLink}>Returns</a></li>
              <li><a href="#" className={styles.footerLink}>Contact Us</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Company</h4>
            <ul className={styles.footerList}>
              <li><Link to="/about" className={styles.footerLink}>About Us</Link></li>
              <li><Link to="/about" className={styles.footerLink}>Our Story</Link></li>
              <li><a href="#" className={styles.footerLink}>Sustainability</a></li>
              <li><a href="#" className={styles.footerLink}>Careers</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Legal</h4>
            <ul className={styles.footerList}>
              <li><a href="#" className={styles.footerLink}>Privacy Policy</a></li>
              <li><a href="#" className={styles.footerLink}>Terms of Service</a></li>
              <li><a href="#" className={styles.footerLink}>Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Branding, Social Media, Copyright */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBranding}>
            <img src={chocolataLogo} alt="Chocolata" className={styles.footerLogo} />
            <div className={styles.brandInfo}>
              <h3 className={styles.brandName}>CHOCOLATA</h3>
              <p className={styles.brandSlogan}>The Sweetest Spot on the Internet! 🌍✨</p>
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
          <p>&copy; {new Date().getFullYear()} Chocolata. Made with ❤️ for all the choco lovers out there! 🍫✨</p>
        </div>
      </footer>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default MainLayout;
