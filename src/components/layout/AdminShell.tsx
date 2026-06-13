import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import styles from './AdminShell.module.css';

interface AdminShellProps {
  children: ReactNode;
}

const AdminShell = ({ children }: AdminShellProps) => {
  const { t } = useTranslation('ui');
  const { user, handleLogout } = useAuth();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { path: '/admin/dashboard', labelKey: 'dashboard' },
    { path: '/admin/products', labelKey: 'products' },
    { path: '/admin/sellers', labelKey: 'sellerApprovals' },
    { path: '/admin/categories', labelKey: 'categories' },
    { path: '/admin/orders', labelKey: 'orders' },
    { path: '/admin/activity', labelKey: 'activityLog' },
  ];

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
          <Link to="/admin/dashboard" className={styles.logo}>
            🍭 Chocolata
            <span className={styles.adminBadge}>{t('adminShell.badge')}</span>
          </Link>
        </div>
        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
            >
              {t(`adminShell.nav.${item.labelKey}`)}
            </Link>
          ))}
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
        aria-label={t('adminShell.closeNavigation')}
        className={`${styles.overlay} ${isMobileNavOpen ? styles.overlayVisible : ''}`}
        onClick={closeMobileNav}
        tabIndex={-1}
      />
      <main className={styles.main}>
        <div className={styles.mobileBar}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={t('adminShell.toggleNavigation')}
            aria-expanded={isMobileNavOpen}
            onClick={toggleMobileNav}
          >
            <span className={styles.menuIcon} aria-hidden="true" />
            <span className={styles.menuText}>{t('adminShell.menu')}</span>
          </button>
          <div className={styles.mobileContext}>
            <span className={styles.mobileLabel}>{t('adminShell.panel')}</span>
            <span className={styles.mobileRoute}>
              {t(`adminShell.nav.${navItems.find((item) => location.pathname.startsWith(item.path))?.labelKey ?? 'overview'}`)}
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

export default AdminShell;

