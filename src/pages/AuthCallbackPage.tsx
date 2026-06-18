import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';

type CallbackStatus = 'loading' | 'success' | 'error';

const AuthCallbackPage = () => {
  const { t } = useTranslation('auth');
  const [status, setStatus] = useState<CallbackStatus>('loading');

  useEffect(() => {
    const confirmAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error') || params.get('error_description');

        if (error) {
          setStatus('error');
          return;
        }

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          setStatus(exchangeError ? 'error' : 'success');
          return;
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        setStatus(sessionError || !data.session ? 'error' : 'success');
      } catch {
        setStatus('error');
      }
    };

    confirmAuth();
  }, []);

  const isSuccess = status === 'success';
  const isLoading = status === 'loading';

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
          maxWidth: '480px',
          background: '#fff',
          border: '1px solid rgba(90, 48, 24, 0.14)',
          borderRadius: '8px',
          boxShadow: '0 18px 44px rgba(60, 34, 18, 0.12)',
          padding: '28px',
          textAlign: 'center',
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
        <h1 style={{ margin: '0 0 14px', color: '#3a2116' }}>
          {isLoading && t('callback.confirming')}
          {isSuccess && t('callback.confirmedTitle')}
          {status === 'error' && t('callback.failedTitle')}
        </h1>
        <p style={{ margin: '0 0 24px', color: '#5d4033', lineHeight: 1.6 }}>
          {isLoading && t('callback.confirmingText')}
          {isSuccess && t('callback.confirmedText')}
          {status === 'error' && t('callback.failedText')}
        </p>
        <Link to={isSuccess ? '/login' : '/register'} style={{ textDecoration: 'none' }}>
          <Button type="button" variant="gold" style={{ width: '100%' }}>
            {isSuccess ? t('callback.loginButton') : t('callback.registerButton')}
          </Button>
        </Link>
      </section>
    </main>
  );
};

export default AuthCallbackPage;
