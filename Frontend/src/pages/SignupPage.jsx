import React, { useEffect } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useOnboarding } from '../context/OnboardingContext';
import { api } from '../services/api';
import { getUserName, getUserEmail } from '../services/auth';
import BackButton from "../components/Back"

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { setSignupComplete, complete_onboarding, complete_signup } = useOnboarding();

  // Manual redirect after successful signup
  useEffect(() => {
    console.log('SignupPage useEffect - isLoaded:', isLoaded, 'user:', !!user, 'complete_onboarding:', complete_onboarding, 'complete_signup:', complete_signup);
    
    if (isLoaded && user) {
      // Only call setSignupComplete if we haven't already
      if (complete_signup === null) {
        console.log('User detected in SignupPage, creating user in MongoDB and calling setSignupComplete');
        
        // Create user in MongoDB immediately after Clerk signup
        api.post('/users', {
          clerkId: user.id,
          email: getUserEmail(user),
          name: getUserName(user)
        }).then(() => {
          console.log('User created in MongoDB successfully');
          setSignupComplete(); // Set complete_signup = 0
        }).catch((err) => {
          console.error('Error creating user in MongoDB:', err);
          // Still mark signup as complete even if user creation fails
          // The error will be caught again during onboarding
          setSignupComplete();
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user, complete_signup, setSignupComplete]);

  // Separate effect to handle the redirect after signup is marked complete
  useEffect(() => {
    if (isLoaded && user && complete_signup === 0) {
      console.log('complete_signup is now 0, checking if should redirect');
      
      // If onboarding is already complete, go to search
      if (complete_onboarding === 1) {
        console.log('Onboarding already complete, redirecting to /search');
        navigate('/search', { replace: true });
      } else {
        // Otherwise go to onboarding
        console.log('Onboarding not complete, redirecting to /onboarding');
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isLoaded, user, complete_signup, complete_onboarding, navigate]);

  return (
    <div className="w-full min-h-screen bg-custom-white flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
      {/* Back Button */}
        <BackButton
          text="← Back to Home"
          path="/"
        />

      <div className="w-full max-w-md flex flex-col">
        

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold font-playfair text-custom-charcoal mb-2">Join Skinshy</h1>
          <p className="text-sm sm:text-base text-custom-dark-gray">Create your account to get personalized skin recommendations</p>
        </div>

         {/* Clerk SignUp Component */}
         <div className="bg-custom-white rounded-lg border border-custom-light-gray/20 p-5 sm:p-8 w-full">
           <SignUp
             appearance={{
               elements: {
                 rootBox: 'w-full',
                 card: 'bg-custom-white shadow-none border-0',
                 formButtonPrimary: 'bg-custom-charcoal hover:bg-custom-black transition w-full',
                 formFieldInput: 'border border-custom-light-gray/30 focus:ring-custom-charcoal',
                 footerAction: 'text-custom-dark-gray text-xs sm:text-sm',
                 footerActionLink: 'text-custom-charcoal hover:text-custom-black',
               }
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
