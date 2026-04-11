import React, { useEffect } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  // If already signed in, redirect to onboarding
  useEffect(() => {
    if (isSignedIn) {
      navigate('/onboarding', { replace: true });
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-custom-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center text-custom-charcoal hover:text-custom-dark-gray transition"
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-playfair text-custom-charcoal mb-2">Join Skinshy</h1>
          <p className="text-custom-dark-gray">Create your account to get personalized skin recommendations</p>
        </div>

        {/* Clerk SignUp Component */}
        <div className="bg-custom-white rounded-lg border border-custom-light-gray/20 p-8">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-custom-white shadow-none border-0',
                formButtonPrimary: 'bg-custom-charcoal hover:bg-custom-black transition w-full',
                formFieldInput: 'border border-custom-light-gray/30 focus:ring-custom-charcoal',
                footerAction: 'text-custom-dark-gray',
                footerActionLink: 'text-custom-charcoal hover:text-custom-black',
              }
            }}
            redirectUrl="/onboarding"
            signInUrl="/login"
          />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-custom-dark-gray">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-custom-charcoal font-semibold hover:text-custom-black transition"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}
