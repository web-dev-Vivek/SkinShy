import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-custom-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-custom-charcoal mb-2 font-playfair">Skinshy</h1>
          <h2 className="text-2xl font-semibold text-custom-charcoal">Create Account</h2>
        </div>
         
        <SignUp
          signUpUrl="/signup"
          afterSignUpUrl="/onboarding-complete"
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
