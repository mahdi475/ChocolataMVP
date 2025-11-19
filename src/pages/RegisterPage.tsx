import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RegisterForm from '../components/forms/RegisterForm';
import Card from '../components/ui/Card';
import FadeIn from '../components/animations/FadeIn';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = () => {
    // After successful registration, redirect to home page
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
          <h1 className={styles.title}>{t('register.title')}</h1>
          {error && <div className={styles.error}>{error}</div>}
          <RegisterForm onSuccess={handleSuccess} onError={handleError} />
          <p className={styles.footer}>
            {t('register.hasAccount')}{' '}
            <Link to="/login" className={styles.link}>
              {t('register.loginLink')}
            </Link>
          </p>
        </Card>
      </FadeIn>
    </div>
  );
};

export default RegisterPage;

