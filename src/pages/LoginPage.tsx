import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginForm from '../components/forms/LoginForm';
import Card from '../components/ui/Card';
import FadeIn from '../components/animations/FadeIn';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = () => {
    // After successful login, redirect to home page
    // The AuthContext will handle role-based redirection from the HomePage
    navigate('/');
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

