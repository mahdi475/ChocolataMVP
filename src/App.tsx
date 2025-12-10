import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import i18n from './lib/i18n';
import AppRouter from './routes/AppRouter';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ToastContainer from './components/ui/ToastContainer';
import CartSidebar from './components/checkout/CartSidebar';

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <AppRouter />
            </Suspense>
            <ToastContainer />
            <CartSidebar />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
};

export default App;

