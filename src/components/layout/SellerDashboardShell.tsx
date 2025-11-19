import { ReactNode } from 'react';
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

  const navItems = [
    { path: '/seller/dashboard', label: 'Dashboard' },
    { path: '/seller/products', label: 'Products' },
    { path: '/seller/orders', label: 'Orders' },
    { path: '/seller/verification', label: 'Verification' },
  ];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/seller/dashboard" className={styles.logo}>
            🍫 Chocolata
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
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default SellerDashboardShell;

