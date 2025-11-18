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
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          🍫 Chocolata
        </Link>
        <nav className={styles.nav}>
          <Link to="/catalog" className={styles.navLink}>
            Catalog
          </Link>
          <Link to="/cart" className={styles.navLink}>
            Cart ({cartItems.length})
          </Link>
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

