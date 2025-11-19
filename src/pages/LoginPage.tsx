import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import LoginForm from '../components/forms/LoginForm';
import Card from '../components/ui/Card';
import FadeIn from '../components/animations/FadeIn';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const role = useSelector((state: RootState) => state.auth.role);

  const handleSuccess = () => {
    console.log('🚀 Login success, current role:', role);
    
    // Add a small delay to ensure role is set before redirect
    setTimeout(() => {
      const currentRole = role; // Re-check role after timeout
      console.log('🔄 Redirecting with role:', currentRole);
      
      // Redirect based on user role
      switch (currentRole) {
        case 'seller':
          console.log('➡️ Redirecting to seller dashboard');
          navigate('/seller/dashboard');
          break;
        case 'admin':
          console.log('➡️ Redirecting to admin dashboard');
          navigate('/admin/dashboard');
          break;
        case 'buyer':
        default:
          console.log('➡️ Redirecting to catalog');
          navigate('/catalog');
          break;
      }
    }, 100);
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

