import React, { useEffect, Suspense } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { OnboardingProvider } from './context/OnboardingContext';
import { UserProvider } from './context/UserContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { setClerkTokenGetter } from './services/api';
import Navbar from './components/Common/Navbar';
import LoadingFallback from './components/LoadingFallback';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load all pages for code splitting
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const ProductPage = React.lazy(() => import('./pages/ProductPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage'));
const ProductComparePage = React.lazy(() => import('./pages/ProductComparePage'));
const GuidePage = React.lazy(() => import('./pages/GuidePage'));

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
      <Suspense fallback={<LoadingFallback />}>
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
            path="/product_Comparasion"
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
      </Suspense>
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
