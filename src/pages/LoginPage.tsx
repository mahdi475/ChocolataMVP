import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/forms/LoginForm';
import Card from '../components/ui/Card';
import FadeIn from '../components/animations/FadeIn';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const redirectParam = new URLSearchParams(location.search).get('redirect');
  const stateRedirect = (location.state as { from?: string } | null)?.from;
  const redirectTo = redirectParam || stateRedirect;

  useEffect(() => {
    // If already logged in, redirect based on role
    if (role) {
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'seller':
          navigate(redirectTo?.startsWith('/seller') ? redirectTo : '/seller/dashboard', { replace: true });
          break;
        case 'buyer':
        default:
          navigate(redirectTo && redirectTo.startsWith('/') ? redirectTo : '/catalog', { replace: true });
          break;
      }
    }
  }, [role, navigate, redirectTo]);

  const handleSuccess = () => {
    // Don't navigate here - let the useEffect handle it after role is set
    // This ensures we wait for the role to be fetched from the database
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className={styles.container}>
      <FadeIn>
        <Card className={styles.card}>
          <h1 className={styles.title}>{t('login.title')}</h1>
          {error && <div className={styles.error}>{error}</div>}
          <LoginForm onSuccess={handleSuccess} onError={handleError} />
          <p className={styles.footer}>
            {t('login.noAccount')}{' '}
            <Link to="/register" className={styles.link}>
              {t('login.registerLink')}
            </Link>
          </p>
        </Card>
      </FadeIn>
    </div>
  );
};

export default LoginPage;

