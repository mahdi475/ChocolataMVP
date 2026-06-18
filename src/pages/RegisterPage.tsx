import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RegisterForm from '../components/forms/RegisterForm';

const RegisterPage = () => {
  const { t } = useTranslation('auth');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <main
      style={{
        minHeight: '72vh',
        display: 'grid',
        placeItems: 'center',
        padding: '48px 20px',
        background: '#fff8ef',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#fff',
          border: '1px solid rgba(90, 48, 24, 0.14)',
          borderRadius: '8px',
          boxShadow: '0 18px 44px rgba(60, 34, 18, 0.12)',
          padding: '28px',
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            color: '#a26b2d',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Chocolata
        </p>
        <h1 style={{ margin: '0 0 22px', color: '#3a2116' }}>{t('register.title')}</h1>

        {message && (
          <p
            role="status"
            style={{
              margin: '0 0 16px',
              padding: '12px',
              borderRadius: '6px',
              background: '#ecfdf3',
              color: '#166534',
            }}
          >
            {message}
          </p>
        )}
        {error && (
          <p
            role="alert"
            style={{
              margin: '0 0 16px',
              padding: '12px',
              borderRadius: '6px',
              background: '#fef2f2',
              color: '#991b1b',
            }}
          >
            {error}
          </p>
        )}

        <RegisterForm
          onSuccess={() => {
            setError(null);
            setMessage(t('register.success'));
          }}
          onError={(nextError) => {
            setMessage(null);
            setError(nextError);
          }}
        />

        <p style={{ margin: '18px 0 0', color: '#5d4033', textAlign: 'center' }}>
          {t('register.hasAccount')}{' '}
          <Link to="/login" style={{ color: '#8b5a2b', fontWeight: 700 }}>
            {t('register.loginLink')}
          </Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;
