import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingBag, User as UserIcon, Menu, X, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import type { RootState } from '../../store';
import styles from './MainLayout.module.css';
import Button from '../ui/Button';
import SearchOverlay from './SearchOverlay';

interface MainLayoutProps { children: ReactNode }

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, role, handleLogout } = useAuth();
  const { setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const cartCount = useSelector((state: RootState) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
          <Link to="/" className={styles.brand}>
            <span className={styles.brandIcon}>C</span>
            CHOCOLATA
          </Link>

          <div className={styles.desktopLinks}>
            <Link to="/catalog" className={styles.link}>Shop</Link>
            <Link to="/catalog?category=gifts" className={styles.link}>Gifts</Link>
            <Link to="/about" className={styles.link}>Our Story</Link>
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
                className={`${styles.iconButton} ${styles.desktopOnly}`}
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
              Shop Collection
            </Link>
            <Link to="/catalog?category=gifts" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              Gifts
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className={styles.mobileLink}>
              Our Story
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

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>CHOCOLATA</h3>
            <p className={styles.footerText}>
              Curating the world's finest artisan chocolates for the discerning palate. Handcrafted, ethically sourced, and delivered with care.
            </p>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Shop</h4>
            <ul className={styles.footerList}>
              <li><Link to="/catalog" className={styles.footerLink}>All Chocolates</Link></li>
              <li><Link to="/catalog?category=dark" className={styles.footerLink}>Dark Series</Link></li>
              <li><Link to="/catalog?category=gifts" className={styles.footerLink}>Gift Sets</Link></li>
              <li><Link to="/about" className={styles.footerLink}>Our Story</Link></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Support</h4>
            <ul className={styles.footerList}>
              <li><a href="#" className={styles.footerLink}>Shipping Policy</a></li>
              <li><a href="#" className={styles.footerLink}>Returns</a></li>
              <li><a href="#" className={styles.footerLink}>FAQ</a></li>
              <li><a href="#" className={styles.footerLink}>Contact Us</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerHeading}>Newsletter</h4>
            <p className={styles.footerText}>Subscribe for sweet updates.</p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Email address"
                className={styles.newsletterInput}
              />
              <Button variant="gold" className={styles.newsletterButton}>Go</Button>
            </form>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Chocolata Marketplace. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default MainLayout;
