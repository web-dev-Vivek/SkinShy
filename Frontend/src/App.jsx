import React, { useEffect } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { OnboardingProvider } from './context/OnboardingContext';
import { UserProvider } from './context/UserContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { setClerkTokenGetter } from './services/api';
import Navbar from './components/Common/Navbar';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import ProductComparePage from './pages/ProductComparePage';
import GuidePage from './pages/GuidePage';
import ProtectedRoute from './components/ProtectedRoute';

// Component to initialize token getter - must be inside Router
function TokenInitializer() {
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkTokenGetter(getToken);
  }, [getToken]);

  return null;
}

function AppRoutes() {
  const location = useLocation();
  // Hide navbar on auth and full-screen pages
  const hideNavbarOnRoutes = ['/onboarding', '/login', '/signup'];
  const shouldShowNavbar = !hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      <TokenInitializer />
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search/:id"
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
        <Route
          path="/ingredient-glossary"
          element={
            <ProtectedRoute>
              <ProductComparePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guide"
          element={<GuidePage />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}>
      <UserProvider>
        <OnboardingProvider>
          <CurrencyProvider>
            <Router>
              <AppRoutes />
            </Router>
          </CurrencyProvider>
        </OnboardingProvider>
      </UserProvider>
    </ClerkProvider>
  );
}
