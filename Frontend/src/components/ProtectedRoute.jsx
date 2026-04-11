import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

/**
 * ProtectedRoute component that checks:
 * 1. User is authenticated (Clerk)
 * If not, redirects to signup
 */
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-custom-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-charcoal mx-auto mb-4"></div>
          <p className="text-custom-dark-gray">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to signup
  if (!isSignedIn) {
    navigate('/signup', { replace: true });
    return null;
  }

  // Authenticated - render children
  return children;
};

export default ProtectedRoute;
