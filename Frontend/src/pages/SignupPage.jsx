import React, { useEffect } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useOnboarding } from '../context/OnboardingContext';
import { api } from '../services/api';
import { getUserName, getUserEmail } from '../services/auth';
import BackButton from "../components/Back";

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { setSignupComplete, complete_onboarding, complete_signup } = useOnboarding();

  // Manual redirect after successful signup
  useEffect(() => {
    console.log(
      'SignupPage useEffect - isLoaded:',
      isLoaded,
      'user:',
      !!user,
      'complete_onboarding:',
      complete_onboarding,
      'complete_signup:',
      complete_signup
    );

    if (isLoaded && user) {
      if (complete_signup === null) {
        console.log(
          'User detected in SignupPage, creating user in MongoDB and calling setSignupComplete'
        );

        api
          .post('/users', {
            clerkId: user.id,
            email: getUserEmail(user),
            name: getUserName(user),
          })
          .then(() => {
            console.log('User created in MongoDB successfully');
            setSignupComplete();
          })
          .catch((err) => {
            console.error('Error creating user in MongoDB:', err);
            setSignupComplete();
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user, complete_signup, setSignupComplete]);

  // Separate effect to handle redirect
  useEffect(() => {
    if (isLoaded && user && complete_signup === 0) {
      console.log('complete_signup is now 0, checking if should redirect');

      if (complete_onboarding === 1) {
        console.log('Onboarding already complete, redirecting to /search');
        navigate('/search', { replace: true });
      } else {
        console.log('Onboarding not complete, redirecting to /onboarding');
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isLoaded, user, complete_signup, complete_onboarding, navigate]);

  return (
    <div className="w-full min-h-screen bg-custom-white flex flex-col lg:flex-row items-center justify-center px-3 sm:px-4 py-6 sm:py-8 gap-4 sm:gap-8 lg:gap-12">

      {/* Back Button */}
      <div className="w-full absolute top-4 sm:top-6 left-3 sm:left-4">
        <BackButton
          text="← Back to Home"
          path="/"
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-md flex flex-col mt-8 sm:mt-0">

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-playfair text-custom-charcoal mb-2">
            Join Skinshy
          </h1>

          <p className="text-sm sm:text-base text-custom-dark-gray">
            Create your account to get personalized skin recommendations
          </p>
        </div>

        {/* Clerk SignUp Component */}
        <div className="bg-custom-white rounded-lg border border-custom-light-gray/20 p-5 sm:p-8 w-full shadow-sm">

          {/* Animated Image - shown while loading */}
          {!isLoaded && (
            <div className="rounded-3xl animate-scale-grow">
              <img
                src="/Signup.png"
                alt="Signup illustration skeleton"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-custom-white shadow-none border-0',
                formButtonPrimary:
                  'bg-custom-charcoal hover:bg-custom-black transition w-full',
                formFieldInput:
                  'border border-custom-light-gray/30 focus:ring-custom-charcoal',
                footerAction:
                  'text-custom-dark-gray text-xs sm:text-sm',
                footerActionLink:
                  'text-custom-charcoal hover:text-custom-black',
              },
            }}
            afterSignUpUrl="/signup"
            signInUrl="/login"
          />
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-custom-dark-gray px-2">
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