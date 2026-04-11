import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser, SignIn } from '@clerk/clerk-react';
import { getUserPreferences } from '../services/users';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const hasProcessed = useRef(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !hasProcessed.current) {
      hasProcessed.current = true;
      handleUserSignIn();
    }
  }, [isLoaded, isSignedIn, user]);

  const handleUserSignIn = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Wait a bit for UserSyncComponent to sync user
      // (it syncs automatically when user loads in Clerk)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if onboarding is completed
      const preferences = await getUserPreferences();
      
      if (preferences?.onboardingCompleted) {
        navigate('/search');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to complete login. Please try again.');
      hasProcessed.current = false;
      setIsProcessing(false);
    }
  };

   return (
      <div className="min-h-screen bg-custom-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-custom-charcoal mb-2 font-playfair">Skinshy</h1>
            <h2 className="text-2xl font-semibold text-custom-charcoal">Welcome Back</h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs text-red-600 hover:text-red-800 font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <p className="text-blue-700 text-sm">Processing your login...</p>
            </div>
          )}
          
          <SignIn
            appearance={{
              elements: {
                card: 'bg-custom-white rounded-lg shadow-lg',
                headerTitle: 'text-custom-charcoal font-bold',
                headerSubtitle: 'text-custom-dark-gray',
                formButtonPrimary: 'bg-custom-charcoal hover:bg-custom-black text-custom-white',
                formFieldInput: 'border-custom-light-gray focus:ring-custom-charcoal',
                footerActionLink: 'text-custom-charcoal hover:text-custom-black'
              }
            }}
          />
        </div>
      </div>
    );
}
