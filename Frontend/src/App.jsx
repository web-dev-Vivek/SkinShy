import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { setAuthToken } from './services/api';
import { OnboardingProvider } from './context/OnboardingContext';
import UserSyncComponent from './components/UserSyncComponent';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import OnboardingCompletePage from './pages/OnboardingCompletePage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

function AuthTokenSetter({ children }) {
  const { getToken, isLoaded } = useAuth();
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      getToken()
        .then((token) => {
          if (token) {
            setAuthToken(token);
            console.log('[AuthTokenSetter] ✓ Auth token set successfully');
          } else {
            console.log('[AuthTokenSetter] No token available (user not signed in)');
          }
        })
        .catch((error) => {
          console.error('[AuthTokenSetter] ✗ Error setting auth token:', error.message);
          setAuthError(true);
          // Don't block the app if auth token fails
        });
    }
  }, [isLoaded, getToken]);

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/onboarding-complete" element={<OnboardingCompletePage />} />
       <Route 
         path="/onboarding" 
         element={
           <ProtectedRoute>
             <OnboardingPage />
           </ProtectedRoute>
         }
       />
      <Route 
        path="/search" 
        element={<SearchPage />}
      />
      <Route 
        path="/search/:productName" 
        element={<ProductPage />}
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default function App() {
  const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
  
  // If Clerk key is missing, show error but allow app to run
  if (!publishableKey) {
    console.warn('Warning: REACT_APP_CLERK_PUBLISHABLE_KEY is not set. Authentication features will not work.');
  }

  return (
    <ClerkProvider publishableKey={publishableKey || 'pk_test_placeholder'}>
      <UserSyncComponent>
        <OnboardingProvider>
          <AuthTokenSetter>
            <Router>
              <AppRoutes />
            </Router>
          </AuthTokenSetter>
        </OnboardingProvider>
      </UserSyncComponent>
    </ClerkProvider>
  );
}
