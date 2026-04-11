import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { completeOnboarding } from '../services/users';
import { useOnboarding } from '../context/OnboardingContext';
import { setAuthToken } from '../services/api';

export default function OnboardingCompletePage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const { onboardingData, clearOnboardingData } = useOnboarding();
  const [error, setError] = useState(null);

  useEffect(() => {
    const completeSignup = async () => {
      if (!isLoaded || !user) {
        return;
      }

      try {
        // Get fresh auth token and set it in API headers
        const freshToken = await getToken();
        setAuthToken(freshToken);

        // UserSyncComponent already synced user, so just save onboarding data if present
        if (onboardingData.skinType) {
          await completeOnboarding(
            onboardingData.skinType,
            onboardingData.highSensitivity,
            onboardingData.knownAllergies,
            onboardingData.productChangeRate
          );
          clearOnboardingData();
        }

        // Redirect to search
        navigate('/search', { replace: true });
       } catch (err) {
         console.error('Onboarding completion error:', err);
         setError(err.message || 'Failed to complete signup. Please try again.');
       }
    };

    completeSignup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user]);

  return (
    <div className="min-h-screen bg-custom-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {error ? (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium text-sm">{error}</p>
            <button
              onClick={() => navigate('/search')}
              className="mt-4 w-full bg-custom-charcoal text-custom-white py-2 px-4 rounded hover:bg-custom-black"
            >
              Continue to Search
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-custom-charcoal mb-2 font-playfair">Skinshy</h1>
              <p className="text-custom-dark-gray">Setting up your account...</p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="animate-spin w-6 h-6 border-3 border-custom-charcoal border-t-transparent rounded-full"></div>
              <p className="text-custom-charcoal">Processing your signup...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
