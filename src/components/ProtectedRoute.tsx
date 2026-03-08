import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

/**
 * Route-level authentication guard.
 * - requireAdmin=true → only admin users pass through
 * - requireAdmin=false (default) → any logged-in user passes through
 * Redirects to /auth while preserving the intended destination via `from` state.
 */
export function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = '/auth',
}: ProtectedRouteProps) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Still resolving auth state — render nothing to avoid flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Logged in but not admin when admin is required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
