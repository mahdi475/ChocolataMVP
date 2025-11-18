import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import BuyerLayout from '../components/layout/BuyerLayout';
import SellerDashboardShell from '../components/layout/SellerDashboardShell';
import AdminShell from '../components/layout/AdminShell';

// Public pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Buyer pages
import CatalogPage from '../pages/buyer/CatalogPage';
import ProductDetailPage from '../pages/buyer/ProductDetailPage';
import CartPage from '../pages/buyer/CartPage';
import CheckoutPage from '../pages/buyer/CheckoutPage';
import CheckoutConfirmationPage from '../pages/buyer/CheckoutConfirmationPage';

// Seller pages
import SellerDashboardPage from '../pages/seller/SellerDashboardPage';
import SellerProductsPage from '../pages/seller/SellerProductsPage';
import SellerProductEditPage from '../pages/seller/SellerProductEditPage';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage';

// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminSellersPage from '../pages/admin/AdminSellersPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';

const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactElement;
  requiredRole?: 'buyer' | 'seller' | 'admin';
}) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <BuyerLayout>
            <HomePage />
          </BuyerLayout>
        }
      />
      <Route
        path="/login"
        element={
          <BuyerLayout>
            <LoginPage />
          </BuyerLayout>
        }
      />
      <Route
        path="/register"
        element={
          <BuyerLayout>
            <RegisterPage />
          </BuyerLayout>
        }
      />

      {/* Buyer routes */}
      <Route
        path="/catalog"
        element={
          <BuyerLayout>
            <CatalogPage />
          </BuyerLayout>
        }
      />
      <Route
        path="/product/:id"
        element={
          <BuyerLayout>
            <ProductDetailPage />
          </BuyerLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <BuyerLayout>
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          </BuyerLayout>
        }
      />
      <Route
        path="/checkout"
        element={
          <BuyerLayout>
            <ProtectedRoute requiredRole="buyer">
              <CheckoutPage />
            </ProtectedRoute>
          </BuyerLayout>
        }
      />
      <Route
        path="/checkout/confirmation/:id"
        element={
          <BuyerLayout>
            <ProtectedRoute requiredRole="buyer">
              <CheckoutConfirmationPage />
            </ProtectedRoute>
          </BuyerLayout>
        }
      />

      {/* Seller routes */}
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboardShell>
              <SellerDashboardPage />
            </SellerDashboardShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboardShell>
              <SellerProductsPage />
            </SellerDashboardShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/new"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboardShell>
              <SellerProductEditPage />
            </SellerDashboardShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/:id/edit"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboardShell>
              <SellerProductEditPage />
            </SellerDashboardShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/orders"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboardShell>
              <SellerOrdersPage />
            </SellerDashboardShell>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminShell>
              <AdminDashboardPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sellers"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminShell>
              <AdminSellersPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminShell>
              <AdminCategoriesPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;

