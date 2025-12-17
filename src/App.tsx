import { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import i18n from './lib/i18n';
import AppRouter from './routes/AppRouter';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ToastContainer from './components/ui/ToastContainer';
import CartSidebar from './components/checkout/CartSidebar';
import SplashScreen from './components/animations/SplashScreen';

const AppContent = () => {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Show splash animation every time user visits homepage
    if (location.pathname === '/') {
      // Small delay to ensure content renders first
      const timer = setTimeout(() => {
        setShowSplash(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, [location.pathname]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <AppRouter />
      </Suspense>
      <ToastContainer />
      <CartSidebar />
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
    </>
  );
};

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
};

export default App;

