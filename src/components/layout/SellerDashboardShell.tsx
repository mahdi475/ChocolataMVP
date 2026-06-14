import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_SELLER_PROFILE_SLUG } from '../../lib/sellerProfile';
import Button from '../ui/Button';
import styles from './SellerDashboardShell.module.css';

interface SellerDashboardShellProps {
  children: ReactNode;
}

const SellerDashboardShell = ({ children }: SellerDashboardShellProps) => {
  const { t } = useTranslation('ui');
  const { user, handleLogout } = useAuth();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { path: '/seller/dashboard', label: 'Dashboard' },
    { path: '/seller/products', label: 'Products' },
    { path: '/seller/products/new', label: 'Add product' },
    { path: '/seller/orders', label: 'Orders' },
    { path: '/seller/verification', label: 'Verification' },
    { path: '/seller/profile', label: 'Profile settings' },
  ];
  const publicProfilePath = `/chocolatiers/${DEMO_SELLER_PROFILE_SLUG}`;

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
      }
    };

    if (isMobileNavOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  const toggleMobileNav = () => setIsMobileNavOpen((prev) => !prev);
  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${isMobileNavOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/seller/dashboard" className={styles.logo}>
            🍭 Chocolata
            <span className={styles.sellerBadge}>{t('sellerShell.badge')}</span>
          </Link>
        </div>
        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <Link to={publicProfilePath} className={styles.navLink}>
            View public profile
          </Link>
          <Link to="/" className={styles.navLink}>
            View marketplace
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className={styles.logoutButton}>
            {t('nav.logout')}
          </Button>
        </div>
      </aside>
      <button
        type="button"
        aria-label={t('sellerShell.closeNavigation')}
        className={`${styles.overlay} ${isMobileNavOpen ? styles.overlayVisible : ''}`}
        onClick={closeMobileNav}
      />
      <main className={styles.main}>
        <div className={styles.mobileBar}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={t('sellerShell.toggleNavigation')}
            aria-expanded={isMobileNavOpen}
            onClick={toggleMobileNav}
          >
            <span className={styles.menuIcon} aria-hidden="true" />
            <span className={styles.menuText}>{t('sellerShell.menu')}</span>
          </button>
          <div className={styles.mobileContext}>
            <span className={styles.mobileLabel}>{t('sellerShell.portal')}</span>
            <span className={styles.mobileRoute}>
              {navItems.find((item) => location.pathname.startsWith(item.path))?.label ?? t('sellerShell.nav.overview')}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={styles.mobileLogout}
          >
            {t('nav.logout')}
          </Button>
        </div>
        <div className={styles.mainContent}>{children}</div>
      </main>
    </div>
  );
};

export default SellerDashboardShell;

