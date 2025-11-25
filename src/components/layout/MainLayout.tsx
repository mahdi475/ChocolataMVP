import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import type { RootState } from '../../store';
import styles from './MainLayout.module.css';
import Button from '../ui/Button';

interface MainLayoutProps { children: ReactNode }

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, role, handleLogout } = useAuth();
  const cartCount = useSelector((state: RootState) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <div className={styles.root}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.brand}>Chocolata</Link>
        <div className={styles.links}>
          <Link to="/catalog" className={styles.link}>Marketplace</Link>
          <Link to="/cart" className={styles.link}>Cart{cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}</Link>
          {role === 'seller' && <Link to="/seller/dashboard" className={styles.link}>Seller</Link>}
          {role === 'admin' && <Link to="/admin/dashboard" className={styles.link}>Admin</Link>}
          {!user && <Link to="/login" className={styles.link}>Login</Link>}
          {!user && <Link to="/register" className={styles.link}>Register</Link>}
          {user && (
            <Button variant="gold" size="sm" onClick={handleLogout} className={styles.logoutBtn}>Logout</Button>
          )}
        </div>
      </nav>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>© {new Date().getFullYear()} Chocolata · Inspired by Oompaloompa design</footer>
    </div>
  );
};

export default MainLayout;
