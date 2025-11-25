import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import styles from './SellerDashboardShell.module.css';

interface SellerDashboardShellProps {
  children: ReactNode;
}

const SellerDashboardShell = ({ children }: SellerDashboardShellProps) => {
  const { user, handleLogout } = useAuth();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { path: '/seller/dashboard', label: 'Dashboard' },
    { path: '/seller/products', label: 'Products' },
    { path: '/seller/orders', label: 'Orders' },
    { path: '/seller/verification', label: 'Verification' },
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
          <Link to="/seller/dashboard" className={styles.logo}>
            🍭 Oompaloompa
            <span className={styles.sellerBadge}>SELLER DASHBOARD</span>
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
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </Button>
        </div>
      </aside>
      <button
        type="button"
        aria-label="Close navigation"
        className={`${styles.overlay} ${isMobileNavOpen ? styles.overlayVisible : ''}`}
        onClick={closeMobileNav}
      />
      <main className={styles.main}>
        <div className={styles.mobileBar}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="Toggle seller navigation"
            aria-expanded={isMobileNavOpen}
            onClick={toggleMobileNav}
          >
            <span className={styles.menuIcon} aria-hidden="true" />
            <span className={styles.menuText}>Menu</span>
          </button>
          <div className={styles.mobileContext}>
            <span className={styles.mobileLabel}>Seller Portal</span>
            <span className={styles.mobileRoute}>{navItems.find((item) => location.pathname.startsWith(item.path))?.label ?? 'Overview'}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={styles.mobileLogout}
          >
            Logout
          </Button>
        </div>
        <div className={styles.mainContent}>{children}</div>
      </main>
    </div>
  );
};

export default SellerDashboardShell;

