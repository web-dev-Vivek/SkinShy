import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

/**
 * Custom hook for protected route navigation
 * Redirects to /signup if user is not authenticated and trying to access protected route
 * @returns {Function} - Protected navigate function
 */
export const useProtectedNavigate = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  // List of protected routes that require authentication
  const protectedRoutes = [
    '/search',
    '/profile',
    '/product_Comparasion',
    '/onboarding'
  ];

  const protectedNavigate = (path) => {
    // Check if the target route is protected
    const isProtectedRoute = protectedRoutes.includes(path);

    if (isProtectedRoute && !isSignedIn) {
      // User is not logged in and trying to access protected route
      console.log(`Protected route ${path} accessed by unauthenticated user. Redirecting to /signup`);
      navigate('/signup', { replace: true });
    } else {
      // Either public route or user is authenticated
      navigate(path);
    }
  };

  return protectedNavigate;
};

export default useProtectedNavigate;
