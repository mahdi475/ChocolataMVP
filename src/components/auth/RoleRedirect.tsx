import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * Component that redirects authenticated users to their role-appropriate dashboard
 */
const RoleRedirect = () => {
  const { user, role, loading } = useAuth();

  console.log('🔀 RoleRedirect: user:', !!user, 'role:', role, 'loading:', loading);

  if (loading) {
    return <LoadingSpinner />;
  }

  // If no user, let them see the homepage
  if (!user) {
    return null; // Let the homepage render
  }

  // If user is authenticated, redirect to their appropriate dashboard
  switch (role) {
    case 'seller':
      console.log('➡️ RoleRedirect: Redirecting seller to dashboard');
      return <Navigate to="/seller/dashboard" replace />;
    case 'admin':
      console.log('➡️ RoleRedirect: Redirecting admin to dashboard');
      return <Navigate to="/admin/dashboard" replace />;
    case 'buyer':
    default:
      console.log('➡️ RoleRedirect: Redirecting buyer to catalog');
      return <Navigate to="/catalog" replace />;
  }
};

export default RoleRedirect;