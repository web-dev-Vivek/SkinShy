import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser, SignUp } from '@clerk/clerk-react';
import { syncUserWithBackend } from '../services/clerk';

export default function SignupPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      handleUserSignUp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user]);

  const handleUserSignUp = async () => {
    try {
      // Sync user with backend
      await syncUserWithBackend(
        user.id,
        user.primaryEmailAddress?.emailAddress,
        user.fullName,
        user.profileImageUrl
      );

      // Redirect to onboarding
      navigate('/onboarding');
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-rose-600 mb-2">Skinshy</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Create Account</h2>
        </div>
        
        <SignUp
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
          redirectUrl="/onboarding"
        />
      </div>
    </div>
  );
}
