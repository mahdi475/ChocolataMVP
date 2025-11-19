import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import i18n from './lib/i18n';
import AppRouter from './routes/AppRouter';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ToastContainer from './components/ui/ToastContainer';

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <AppRouter />
          </Suspense>
          <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
};

export default App;

