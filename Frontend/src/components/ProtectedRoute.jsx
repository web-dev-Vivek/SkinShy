import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { api } from '../services/api';

/**
 * ProtectedRoute component that checks:
 * 1. User is authenticated (Clerk)
 * 2. User's onboarding is completed
 * If not, redirects appropriately
 */
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for Clerk to load
      if (!isLoaded) {
        return;
      }

      // Not authenticated - redirect to login
      if (!isSignedIn) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Fetch user profile to check onboarding status
        const response = await api.get('/users/profile');
        const profile = response.data.user;
        setUserProfile(profile);

        // Check if onboarding is completed
        if (!profile?.profile?.onboardingCompleted) {
          // Redirect to onboarding
          navigate('/onboarding', { replace: true });
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        
        // If 404, user doesn't exist in DB yet
        if (err.response?.status === 404) {
          // Redirect to onboarding to create user
          navigate('/onboarding', { replace: true });
          return;
        }

        setError('Failed to verify access. Please try again.');
        setLoading(false);
      }
    };

    checkAccess();
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-custom-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-charcoal mx-auto mb-4"></div>
          <p className="text-custom-dark-gray">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-custom-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-custom-charcoal text-custom-white rounded-lg hover:bg-custom-black transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
