import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { setAuthToken } from './services/api';
import { OnboardingProvider } from './context/OnboardingContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
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

  useEffect(() => {
    if (isLoaded) {
      getToken().then((token) => {
        setAuthToken(token);
      }).catch((error) => {
        console.error('Error setting auth token:', error);
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
       <Route 
         path="/onboarding" 
         element={<OnboardingPage />}
       />
      <Route 
        path="/search" 
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/product/:id" 
        element={
          <ProtectedRoute>
            <ProductPage />
          </ProtectedRoute>
        } 
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
  return (
    <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}>
      <OnboardingProvider>
        <AuthTokenSetter>
          <Router>
            <AppRoutes />
          </Router>
        </AuthTokenSetter>
      </OnboardingProvider>
    </ClerkProvider>
  );
}
