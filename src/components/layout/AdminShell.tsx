import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import styles from './AdminShell.module.css';

interface AdminShellProps {
  children: ReactNode;
}

const AdminShell = ({ children }: AdminShellProps) => {
  const { user, handleLogout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/sellers', label: 'Seller Approvals' },
    { path: '/admin/categories', label: 'Categories' },
    { path: '/admin/orders', label: 'Orders' },
  ];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/admin/dashboard" className={styles.logo}>
            🍫 Chocolata
            <span className={styles.adminBadge}>ADMIN PANEL</span>
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

export default AdminShell;

