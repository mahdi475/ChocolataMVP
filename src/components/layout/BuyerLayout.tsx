import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import Button from '../ui/Button';
import styles from './BuyerLayout.module.css';

interface BuyerLayoutProps {
  children: ReactNode;
}

const BuyerLayout = ({ children }: BuyerLayoutProps) => {
  const { user, role, handleLogout } = useAuth();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const getHomeUrl = () => {
    switch (role) {
      case 'seller': return '/seller/dashboard';
      case 'admin': return '/admin/dashboard';
      case 'buyer':
      default: return '/catalog';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to={getHomeUrl()} className={styles.logo}>
          🍫 Chocolata
          {role && (
            <span className={`${styles.roleBadge} ${styles[`role${role.charAt(0).toUpperCase() + role.slice(1)}`]}`}>
              {role.toUpperCase()}
            </span>
          )}
        </Link>
        <nav className={styles.nav}>
          <Link to="/catalog" className={styles.navLink}>
            Catalog
          </Link>
          <Link to="/cart" className={styles.navLink}>
            Cart ({cartItems.length})
          </Link>
          {user && (
            <Link to="/profile" className={styles.navLink}>
              Profile
            </Link>
          )}
          {user && (
            <Link to="/orders" className={styles.navLink}>
              Orders
            </Link>
          )}
          {user ? (
            <>
              <span className={styles.userEmail}>{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Chocolata. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BuyerLayout;

