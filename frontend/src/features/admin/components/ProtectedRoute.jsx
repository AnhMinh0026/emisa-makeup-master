import { Navigate, Outlet } from 'react-router-dom';

/**
 * A wrapper to protect routes that require authentication.
 * For now, simulates auth by checking for a token in localStorage.
 *
 * @returns {JSX.Element} Either the protected route content or a redirect to home.
 */
export const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
