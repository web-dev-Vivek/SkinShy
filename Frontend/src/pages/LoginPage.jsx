import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold font-playfair text-custom-charcoal mb-2">Welcome Back</h1>
          <p className="text-custom-dark-gray">Sign in to your Skinshy account</p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="bg-custom-white rounded-lg border border-custom-light-gray/20 p-8">
          <SignIn
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
            signUpUrl="/signup"
          />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-custom-dark-gray">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-custom-charcoal font-semibold hover:text-custom-black transition"
          >
            Sign up here
          </button>
        </div>
      </div>
    </div>
  );
}
