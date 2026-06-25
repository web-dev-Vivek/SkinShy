import React, { useEffect, Suspense } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { OnboardingProvider } from './context/OnboardingContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { setClerkTokenGetter } from './services/api';
import Navbar from './components/Common/Navbar';
import LoadingFallback from './components/LoadingFallback';
import ProtectedRoute from './components/ProtectedRoute';
import HomeSkeleton from './components/Skeletons/HomeSkeleton';
import GuideSkeleton from './components/Skeletons/GuideSkeleton';

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
      <Routes>
        <Route path="/" element={<Suspense fallback={<HomeSkeleton />}><LandingPage /></Suspense>} />
        <Route path="/login" element={<Suspense fallback={<LoadingFallback />}><LoginPage /></Suspense>} />
        <Route path="/signup" element={<Suspense fallback={<LoadingFallback />}><SignupPage /></Suspense>} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}><OnboardingPage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}><SearchPage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}><ProductPage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}><ProfilePage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/product_Comparasion"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}><ProductComparePage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/guide"
          element={<Suspense fallback={<GuideSkeleton />}><GuidePage /></Suspense>}
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}>
      <OnboardingProvider>
        <CurrencyProvider>
          <Router>
            <AppRoutes />
          </Router>
        </CurrencyProvider>
      </OnboardingProvider>
    </ClerkProvider>
  );
}
