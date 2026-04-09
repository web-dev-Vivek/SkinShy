import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser, SignIn } from '@clerk/clerk-react';
import { syncUserWithBackend } from '../services/clerk';
import { getUserPreferences } from '../services/users';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      handleUserSignIn();
    }
  }, [isLoaded, isSignedIn, user]);

  const handleUserSignIn = async () => {
    try {
      // Sync user with backend
      await syncUserWithBackend(
        user.id,
        user.primaryEmailAddress?.emailAddress,
        user.fullName,
        user.profileImageUrl
      );

      // Check if onboarding is completed
      const preferences = await getUserPreferences();
      
      if (preferences.onboardingCompleted) {
        navigate('/search');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-rose-600 mb-2">Skinshy</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              card: 'bg-white rounded-lg shadow-lg',
              headerTitle: 'text-gray-900 font-bold',
              headerSubtitle: 'text-gray-600',
              formButtonPrimary: 'bg-rose-500 hover:bg-rose-600 text-white',
              formFieldInput: 'border-gray-300 focus:ring-rose-500',
              footerActionLink: 'text-rose-600 hover:text-rose-700'
            }
          }}
          redirectUrl="/search"
        />
      </div>
    </div>
  );
}
