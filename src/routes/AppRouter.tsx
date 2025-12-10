import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import MainLayout from '../components/layout/MainLayout';
import SellerDashboardShell from '../components/layout/SellerDashboardShell';
import AdminShell from '../components/layout/AdminShell';

// Public pages
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/About';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Buyer pages
import CatalogPage from '../pages/buyer/CatalogPage';
import ProductDetailPage from '../pages/buyer/ProductDetailPage';
import SellerProfilePage from '../pages/buyer/SellerProfilePage';
import CartPage from '../pages/buyer/CartPage';
import CheckoutPage from '../pages/buyer/CheckoutPage';
import CheckoutConfirmationPage from '../pages/buyer/CheckoutConfirmationPage';
import BuyerOrdersPage from '../pages/buyer/BuyerOrdersPage';
import OrderDetailPage from '../pages/buyer/OrderDetailPage';
import CustomerProfilePage from '../pages/buyer/CustomerProfilePage';

// Seller pages
import SellerDashboardPage from '../pages/seller/SellerDashboardPage';
import SellerProductsPage from '../pages/seller/SellerProductsPage';
import SellerProductEditPage from '../pages/seller/SellerProductEditPage';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage';
import SellerVerificationPage from '../pages/seller/SellerVerificationPage';

// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminSellersPage from '../pages/admin/AdminSellersPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminActivityPage from '../pages/admin/AdminActivityPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';

const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactElement;
  requiredRole?: 'buyer' | 'seller' | 'admin';
}) => {
  const { user, role, loading } = useAuth();

  console.log('🛡️ ProtectedRoute check:', { 
    hasUser: !!user, 
    userRole: role, 
    requiredRole, 
    loading 
  });

  if (loading) {
    console.log('🛡️ ProtectedRoute: Still loading...');
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log('🛡️ ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    const redirectUrl = role === 'seller' 
      ? '/seller/dashboard' 
      : role === 'admin' 
      ? '/admin/dashboard' 
      : '/catalog';
    console.log('🛡️ ProtectedRoute: Wrong role! User is', role, 'but needs', requiredRole, '→ redirecting to', redirectUrl);
    return <Navigate to={redirectUrl} replace />;
  }

  console.log('🛡️ ProtectedRoute: Access granted!');
  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={<MainLayout><HomePage /></MainLayout>}
      />
      <Route
        path="/login"
        element={<MainLayout><LoginPage /></MainLayout>}
      />
      <Route
        path="/register"
        element={<MainLayout><RegisterPage /></MainLayout>}
      />
      <Route
        path="/about"
        element={<MainLayout><AboutPage /></MainLayout>}
      />

      {/* Buyer routes */}
      <Route
        path="/catalog"
        element={<MainLayout><CatalogPage /></MainLayout>}
      />
      <Route
        path="/product/:id"
        element={<MainLayout><ProductDetailPage /></MainLayout>}
      />
      <Route
        path="/seller/:id"
        element={<MainLayout><SellerProfilePage /></MainLayout>}
      />
      <Route
        path="/cart"
        element={<MainLayout><CartPage /></MainLayout>}
      />
      <Route
        path="/checkout"
        element={<MainLayout><ProtectedRoute requiredRole="buyer"><CheckoutPage /></ProtectedRoute></MainLayout>}
      />
      <Route
        path="/checkout/confirmation/:id"
        element={<MainLayout><ProtectedRoute requiredRole="buyer"><CheckoutConfirmationPage /></ProtectedRoute></MainLayout>}
      />
      <Route
        path="/orders"
        element={<MainLayout><ProtectedRoute requiredRole="buyer"><BuyerOrdersPage /></ProtectedRoute></MainLayout>}
      />
      <Route
        path="/orders/:id"
        element={<MainLayout><ProtectedRoute requiredRole="buyer"><OrderDetailPage /></ProtectedRoute></MainLayout>}
      />
      <Route
        path="/profile"
        element={<MainLayout><ProtectedRoute requiredRole="buyer"><CustomerProfilePage /></ProtectedRoute></MainLayout>}
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
      <Route
        path="/seller/verification"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboardShell>
              <SellerVerificationPage />
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
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminShell>
              <AdminOrdersPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/activity"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminShell>
              <AdminActivityPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminShell>
              <AdminProductsPage />
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

